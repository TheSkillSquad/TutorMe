// Netlify Function for creating users (admin function)
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');
const ValidationHelper = require('../utils/validation');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    // Authenticate the request (admin only)
    const decodedToken = await AuthHelper.authenticateRequest(event);
    
    // Check if user is admin (you'd implement this logic)
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user || user.role !== 'admin') {
      return ResponseHelper.forbidden('Admin access required');
    }

    const body = JSON.parse(event.body);
    const validatedData = ValidationHelper.validate(ValidationHelper.registerSchema, body);

    // Check if user already exists
    const existingUser = await DatabaseHelper.findUserByEmail(validatedData.email);
    if (existingUser) {
      return ResponseHelper.validationError('User with this email already exists');
    }

    // Create user in Firebase Auth
    const firebaseUser = await AuthHelper.createUser({
      email: validatedData.email,
      password: validatedData.password,
      displayName: validatedData.displayName,
    });

    // Create user in database
    const dbUser = await DatabaseHelper.createUser({
      uid: firebaseUser.uid,
      email: validatedData.email,
      displayName: validatedData.displayName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      role: validatedData.role || 'user',
      subscription: {
        status: 'free',
        plan: 'free',
        activatedAt: new Date().toISOString(),
      },
      profile: {
        bio: '',
        skills: [],
        experience: '',
        hourlyRate: 0,
        availability: {},
        rating: 0,
        totalSessions: 0,
        totalEarnings: 0,
      },
    });

    return ResponseHelper.success({
      user: {
        uid: dbUser.uid,
        email: dbUser.email,
        displayName: dbUser.displayName,
        createdAt: dbUser.createdAt,
        role: dbUser.role,
        subscription: dbUser.subscription,
        profile: dbUser.profile,
      },
    }, 201);

  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }
    
    if (error.message.includes('already exists')) {
      return ResponseHelper.validationError('User already exists');
    }

    if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
      return ResponseHelper.forbidden(error.message);
    }

    return ResponseHelper.serverError('Failed to create user');
  }
};