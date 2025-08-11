/**
 * Environment variable validation utility
 * This file provides type-safe access to environment variables with validation
 */

// Environment variable validation function
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value || '';
}

// Firebase configuration
export const firebaseConfig = {
  apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
};

// Firebase Admin configuration
export const firebaseAdminConfig = {
  clientEmail: getEnvVar('FIREBASE_ADMIN_CLIENT_EMAIL'),
  privateKey: getEnvVar('FIREBASE_ADMIN_PRIVATE_KEY'),
  projectId: getEnvVar('FIREBASE_ADMIN_PROJECT_ID'),
};

// OpenRouter configuration
export const openRouterConfig = {
  apiKey: getEnvVar('OPENROUTER_API_KEY'),
};

// PayPal configuration
export const paypalConfig = {
  clientId: getEnvVar('PAYPAL_CLIENT_ID'),
  clientSecret: getEnvVar('PAYPAL_CLIENT_SECRET'),
  environment: getEnvVar('PAYPAL_ENVIRONMENT', false) || 'sandbox',
  webhookId: getEnvVar('PAYPAL_WEBHOOK_ID', false),
  webhookUrl: getEnvVar('PAYPAL_WEBHOOK_URL', false),
};

// Twilio configuration
export const twilioConfig = {
  accountSid: getEnvVar('TWILIO_ACCOUNT_SID'),
  apiKey: getEnvVar('TWILIO_API_KEY'),
  apiSecret: getEnvVar('TWILIO_API_SECRET'),
  authToken: getEnvVar('TWILIO_AUTH_TOKEN', false),
};

// NextAuth configuration
export const nextAuthConfig = {
  secret: getEnvVar('NEXTAUTH_SECRET'),
  url: getEnvVar('NEXTAUTH_URL', false) || 'http://localhost:3000',
};

// Database configuration
export const databaseConfig = {
  url: getEnvVar('DATABASE_URL', false) || 'file:./dev.db',
};

// Application configuration
export const appConfig = {
  nodeEnv: getEnvVar('NODE_ENV', false) || 'development',
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',
  debug: getEnvVar('DEBUG', false) === 'true',
};

// Validation function to check all required environment variables
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required Firebase variables
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    errors.push('NEXT_PUBLIC_FIREBASE_API_KEY is required');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    errors.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required');
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    errors.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
  }

  // Check required Firebase Admin variables
  if (!process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    errors.push('FIREBASE_ADMIN_CLIENT_EMAIL is required');
  }
  if (!process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    errors.push('FIREBASE_ADMIN_PRIVATE_KEY is required');
  }

  // Check OpenRouter
  if (!process.env.OPENROUTER_API_KEY) {
    errors.push('OPENROUTER_API_KEY is required');
  }

  // Check PayPal
  if (!process.env.PAYPAL_CLIENT_ID) {
    errors.push('PAYPAL_CLIENT_ID is required');
  }
  if (!process.env.PAYPAL_CLIENT_SECRET) {
    errors.push('PAYPAL_CLIENT_SECRET is required');
  }

  // Check Twilio
  if (!process.env.TWILIO_ACCOUNT_SID) {
    errors.push('TWILIO_ACCOUNT_SID is required');
  }
  if (!process.env.TWILIO_API_KEY) {
    errors.push('TWILIO_API_KEY is required');
  }
  if (!process.env.TWILIO_API_SECRET) {
    errors.push('TWILIO_API_SECRET is required');
  }

  // Check NextAuth
  if (!process.env.NEXTAUTH_SECRET) {
    errors.push('NEXTAUTH_SECRET is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Development mode check
export function isDevelopment(): boolean {
  return appConfig.nodeEnv === 'development';
}

// Production mode check
export function isProduction(): boolean {
  return appConfig.nodeEnv === 'production';
}

// Debug mode check
export function isDebug(): boolean {
  return appConfig.debug;
}

// Export all configurations for easy access
export const env = {
  firebase: firebaseConfig,
  firebaseAdmin: firebaseAdminConfig,
  openRouter: openRouterConfig,
  paypal: paypalConfig,
  twilio: twilioConfig,
  nextAuth: nextAuthConfig,
  database: databaseConfig,
  app: appConfig,
  validate: validateEnvironment,
  isDevelopment,
  isProduction,
  isDebug,
};

export default env;