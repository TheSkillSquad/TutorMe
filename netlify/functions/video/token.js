// Netlify Function for generating Twilio video tokens
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');
const ValidationHelper = require('../utils/validation');
const TwilioVideoService = require('./twilio-service');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    const decodedToken = await AuthHelper.authenticateRequest(event);
    const body = JSON.parse(event.body);
    
    const validatedData = ValidationHelper.validate(ValidationHelper.twilioTokenSchema, body);

    // Validate identity
    if (!TwilioVideoService.prototype.validateIdentity(validatedData.identity)) {
      return ResponseHelper.validationError('Invalid identity format');
    }

    // Validate room name if provided
    if (validatedData.roomName && !TwilioVideoService.prototype.validateRoomName(validatedData.roomName)) {
      return ResponseHelper.validationError('Invalid room name format');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user has active subscription for video features
    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription || subscription.status !== 'active') {
      return ResponseHelper.forbidden('Active subscription required for video sessions');
    }

    // Initialize Twilio service
    const twilioService = new TwilioVideoService();

    // Generate video token
    const videoToken = await twilioService.generateVideoToken(
      validatedData.identity,
      validatedData.roomName
    );

    // Log token generation for analytics
    await DatabaseHelper.createSession({
      userId: user.id,
      roomName: validatedData.roomName || 'default-room',
      identity: validatedData.identity,
      status: 'token_generated',
      tokenGeneratedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      token: videoToken.token,
      identity: videoToken.identity,
      roomName: videoToken.roomName,
      message: 'Video token generated successfully',
    });

  } catch (error) {
    console.error('Generate video token error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    if (error.message.includes('Forbidden')) {
      return ResponseHelper.forbidden(error.message);
    }

    return ResponseHelper.serverError('Failed to generate video token');
  }
};