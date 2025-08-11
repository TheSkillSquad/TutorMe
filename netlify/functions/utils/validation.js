// Validation utilities for Netlify Functions
const Joi = require('joi');

class ValidationHelper {
  static validate(schema, data) {
    const { error, value } = schema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    return value;
  }

  // User validation schemas
  static userSchema = Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().min(2).max(50).required(),
    photoURL: Joi.string().uri().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    bio: Joi.string().max(500).optional(),
    experience: Joi.string().max(1000).optional(),
    hourlyRate: Joi.number().min(0).optional(),
    availability: Joi.object({
      monday: Joi.array().items(Joi.string()).optional(),
      tuesday: Joi.array().items(Joi.string()).optional(),
      wednesday: Joi.array().items(Joi.string()).optional(),
      thursday: Joi.array().items(Joi.string()).optional(),
      friday: Joi.array().items(Joi.string()).optional(),
      saturday: Joi.array().items(Joi.string()).optional(),
      sunday: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  });

  static updateUserSchema = Joi.object({
    displayName: Joi.string().min(2).max(50).optional(),
    photoURL: Joi.string().uri().optional(),
    skills: Joi.array().items(Joi.string()).optional(),
    bio: Joi.string().max(500).optional(),
    experience: Joi.string().max(1000).optional(),
    hourlyRate: Joi.number().min(0).optional(),
    availability: Joi.object({
      monday: Joi.array().items(Joi.string()).optional(),
      tuesday: Joi.array().items(Joi.string()).optional(),
      wednesday: Joi.array().items(Joi.string()).optional(),
      thursday: Joi.array().items(Joi.string()).optional(),
      friday: Joi.array().items(Joi.string()).optional(),
      saturday: Joi.array().items(Joi.string()).optional(),
      sunday: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  });

  // Course validation schemas
  static courseSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    skillTopic: Joi.string().min(2).max(50).required(),
    userLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').required(),
    duration: Joi.number().min(1).max(52).required(), // weeks
    price: Joi.number().min(0).optional(),
    isPublished: Joi.boolean().default(false),
    tags: Joi.array().items(Joi.string()).optional(),
  });

  // Session validation schemas
  static sessionSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    scheduledAt: Joi.date().iso().required(),
    duration: Joi.number().min(15).max(240).required(), // minutes
    price: Joi.number().min(0).required(),
    maxParticipants: Joi.number().min(1).max(100).optional(),
    isRecorded: Joi.boolean().default(false),
  });

  // Payment validation schemas
  static paymentSchema = Joi.object({
    orderId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    currency: Joi.string().length(3).default('USD'),
    paymentMethod: Joi.string().valid('paypal', 'stripe').required(),
    description: Joi.string().max(500).optional(),
  });

  // PayPal validation schemas
  static paypalOrderSchema = Joi.object({
    amount: Joi.object({
      currency_code: Joi.string().length(3).default('USD'),
      value: Joi.string().required(),
    }).required(),
    description: Joi.string().max(127).required(),
  });

  // Twilio validation schemas
  static twilioTokenSchema = Joi.object({
    identity: Joi.string().min(1).max(50).required(),
    roomName: Joi.string().min(1).max(100).optional(),
  });

  static twilioRoomSchema = Joi.object({
    roomName: Joi.string().min(1).max(100).required(),
    type: Joi.string().valid('group', 'peer-to-peer').default('group'),
    recordParticipantsOnConnect: Joi.boolean().default(false),
    statusCallback: Joi.string().uri().optional(),
  });

  // AI course generation schemas
  static aiCourseSchema = Joi.object({
    skillTopic: Joi.string().min(2).max(100).required(),
    userLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner'),
    duration: Joi.number().min(1).max(52).default(3), // weeks
    includeExercises: Joi.boolean().default(true),
    includeQuizzes: Joi.boolean().default(true),
    includeProjects: Joi.boolean().default(true),
  });

  // AI matching schemas
  static aiMatchingSchema = Joi.object({
    skills: Joi.array().items(Joi.string()).min(1).required(),
    userLevel: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
    preferences: Joi.object({
      minRating: Joi.number().min(0).max(5).optional(),
      maxPrice: Joi.number().min(0).optional(),
      availability: Joi.array().items(Joi.string()).optional(),
      language: Joi.string().optional(),
    }).optional(),
  });

  // Subscription validation schemas
  static subscriptionSchema = Joi.object({
    plan: Joi.string().valid('basic', 'premium', 'enterprise').required(),
    billingCycle: Joi.string().valid('monthly', 'yearly').default('monthly'),
    paymentMethod: Joi.string().valid('paypal', 'stripe').required(),
  });

  // Authentication validation schemas
  static registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    displayName: Joi.string().min(2).max(50).required(),
  });

  static loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  // Health check validation
  static healthSchema = Joi.object({
    check: Joi.string().valid('database', 'firebase', 'paypal', 'twilio', 'all').default('all'),
  });

  // Generic validation middleware
  static validateRequest(schema) {
    return (event) => {
      try {
        const body = event.body ? JSON.parse(event.body) : {};
        const query = event.queryStringParameters || {};
        const params = event.pathParameters || {};
        
        const data = { ...body, ...query, ...params };
        return this.validate(schema, data);
      } catch (error) {
        throw new Error(`Validation error: ${error.message}`);
      }
    };
  }

  // Validate email format
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static isValidPassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  // Sanitize input
  static sanitizeInput(input) {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '');
    }
    return input;
  }

  // Validate and sanitize user input
  static validateAndSanitize(input, schema) {
    const sanitized = this.sanitizeInput(input);
    return this.validate(schema, sanitized);
  }
}

module.exports = ValidationHelper;