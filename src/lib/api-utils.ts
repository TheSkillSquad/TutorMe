import { NextRequest, NextResponse } from 'next/server';

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export class APIErrorImpl extends Error {
  public code: string;
  public details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

export class ErrorHandler {
  static handle(error: unknown, request?: NextRequest): NextResponse<APIResponse> {
    console.error('API Error:', error);

    if (error instanceof APIErrorImpl) {
      return NextResponse.json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: this.generateRequestId(),
          version: '1.0.0'
        }
      }, { status: this.getHttpStatus(error.code) });
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        version: '1.0.0'
      }
    }, { status: 500 });
  }

  private static getHttpStatus(code: string): number {
    const statusMap: Record<string, number> = {
      'UNAUTHORIZED': 401,
      'FORBIDDEN': 403,
      'NOT_FOUND': 404,
      'VALIDATION_ERROR': 400,
      'CONFLICT': 409,
      'RATE_LIMIT': 429,
      'SERVICE_UNAVAILABLE': 503,
      'INTERNAL_ERROR': 500
    };

    return statusMap[code] || 500;
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class APIValidator {
  static validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new APIErrorImpl('VALIDATION_ERROR', `${field} is required`);
      }
    }
  }

  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new APIErrorImpl('VALIDATION_ERROR', 'Invalid email format');
    }
  }

  static validateString(data: string, fieldName: string, minLength?: number, maxLength?: number): void {
    if (typeof data !== 'string') {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be a string`);
    }

    if (minLength && data.length < minLength) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be at least ${minLength} characters`);
    }

    if (maxLength && data.length > maxLength) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be no more than ${maxLength} characters`);
    }
  }

  static validateNumber(data: number, fieldName: string, min?: number, max?: number): void {
    if (typeof data !== 'number' || isNaN(data)) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be a number`);
    }

    if (min !== undefined && data < min) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be at least ${min}`);
    }

    if (max !== undefined && data > max) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be no more than ${max}`);
    }
  }

  static validateEnum(data: any, fieldName: string, allowedValues: any[]): void {
    if (!allowedValues.includes(data)) {
      throw new APIErrorImpl('VALIDATION_ERROR', `${fieldName} must be one of: ${allowedValues.join(', ')}`);
    }
  }
}

export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 60000;
  private static readonly MAX_REQUESTS = 100;

  static checkRateLimit(identifier: string): void {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;

    let record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + this.WINDOW_MS
      };
      this.requests.set(key, record);
    } else {
      record.count++;

      if (record.count > this.MAX_REQUESTS) {
        throw new APIErrorImpl('RATE_LIMIT', 'Too many requests. Please try again later.');
      }
    }
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

setInterval(() => RateLimiter.cleanup(), 60000);

// Define a type for schema rules
interface SchemaRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object';
  enum?: any[];
  minLength?: number;
  maxLength?: number;
}

export class APIRouter {
  static async withAuth(
    handler: (request: NextRequest, userId: string) => Promise<NextResponse>,
    request: NextRequest
  ): Promise<NextResponse> {
    try {
      const token = request.headers.get('authorization')?.split('Bearer ')[1];
      if (!token) {
        throw new APIErrorImpl('UNAUTHORIZED', 'No token provided');
      }

      const { firebaseAdmin } = await import('@/lib/firebase-admin');
      const decodedToken = await firebaseAdmin.verifyToken(token);

      RateLimiter.checkRateLimit(decodedToken.uid);

      return await handler(request, decodedToken.uid);
    } catch (error) {
      return ErrorHandler.handle(error, request);
    }
  }

  static async withValidation(
    handler: (request: NextRequest, data: any) => Promise<NextResponse>,
    request: NextRequest,
    schema: Record<string, SchemaRule>
  ): Promise<NextResponse> {
    try {
      const body = await request.json();
      this.validateSchema(body, schema);
      return await handler(request, body);
    } catch (error) {
      return ErrorHandler.handle(error, request);
    }
  }

  private static validateSchema(data: any, schema: Record<string, SchemaRule>): void {
    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && (data[key] === undefined || data[key] === null || data[key] === '')) {
        throw new APIErrorImpl('VALIDATION_ERROR', `${key} is required`);
      }

      if (data[key] !== undefined) {
        if (rules.type && typeof data[key] !== rules.type) {
          throw new APIErrorImpl('VALIDATION_ERROR', `${key} must be of type ${rules.type}`);
        }

        if (rules.enum && !rules.enum.includes(data[key])) {
          throw new APIErrorImpl('VALIDATION_ERROR', `${key} must be one of: ${rules.enum.join(', ')}`);
        }

        if (rules.minLength && data[key].length < rules.minLength) {
          throw new APIErrorImpl('VALIDATION_ERROR', `${key} must be at least ${rules.minLength} characters`);
        }

        if (rules.maxLength && data[key].length > rules.maxLength) {
          throw new APIErrorImpl('VALIDATION_ERROR', `${key} must be no more than ${rules.maxLength} characters`);
        }
      }
    }
  }
}

export function createSuccessResponse<T>(data: T, metadata?: any): NextResponse<APIResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: ErrorHandler['generateRequestId'](),
      version: '1.0.0',
      ...metadata
    }
  });
}

export function createErrorResponse(code: string, message: string, details?: any): NextResponse<APIResponse> {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      details
    },
    metadata: {
      timestamp: new Date().toISOString(),
      requestId: ErrorHandler['generateRequestId'](),
      version: '1.0.0'
    }
  }, { status: ErrorHandler['getHttpStatus'](code) });
}