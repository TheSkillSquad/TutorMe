// Netlify Function for finding AI tutor matches
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');
const ValidationHelper = require('../utils/validation');
const OpenRouterService = require('./openrouter-service');

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
    
    const validatedData = ValidationHelper.validate(ValidationHelper.aiMatchingSchema, body);

    // Validate skills
    if (!Array.isArray(validatedData.skills) || validatedData.skills.length === 0) {
      return ResponseHelper.validationError('Skills must be a non-empty array');
    }

    // Validate each skill
    for (const skill of validatedData.skills) {
      if (!OpenRouterService.prototype.validateSkillTopic(skill)) {
        return ResponseHelper.validationError(`Invalid skill: ${skill}`);
      }
    }

    // Validate user level if provided
    if (validatedData.userLevel && !OpenRouterService.prototype.validateUserLevel(validatedData.userLevel)) {
      return ResponseHelper.validationError('Invalid user level');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user has active subscription for AI features
    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription || subscription.status !== 'active') {
      return ResponseHelper.forbidden('Active subscription required for AI matching');
    }

    // Initialize OpenRouter service
    const openRouterService = new OpenRouterService();

    // Find tutor matches
    const matches = await openRouterService.findTutorMatches(
      validatedData.skills,
      validatedData.userLevel,
      validatedData.preferences
    );

    // Store search results for analytics
    await DatabaseHelper.createSession({
      userId: user.id,
      sessionType: 'ai_matching',
      searchData: {
        skills: validatedData.skills,
        userLevel: validatedData.userLevel,
        preferences: validatedData.preferences,
      },
      searchResults: matches,
      createdAt: new Date().toISOString(),
    });

    // Log matching request for analytics
    console.log(`AI matching request for user ${user.uid}: ${validatedData.skills.join(', ')}`);

    return ResponseHelper.success({
      matches: matches.matches || [],
      recommendations: matches.recommendations || [],
      searchSummary: matches.searchSummary || '',
      searchCriteria: matches.searchCriteria || {
        skills: validatedData.skills,
        userLevel: validatedData.userLevel,
        preferences: validatedData.preferences,
      },
      generatedAt: matches.generatedAt,
      message: 'Tutor matches found successfully',
    });

  } catch (error) {
    console.error('Find matches error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    if (error.message.includes('Forbidden')) {
      return ResponseHelper.forbidden(error.message);
    }

    // Handle OpenRouter API errors
    if (error.message.includes('Failed to find tutor matches')) {
      return ResponseHelper.serverError('Failed to find tutor matches. Please try again later.');
    }

    return ResponseHelper.serverError('Failed to find tutor matches');
  }
};