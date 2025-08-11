// Netlify Function for generating AI exercises
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
    
    const { skillTopic, difficulty = 'intermediate', type = 'practical' } = body;

    // Validate input
    if (!skillTopic || !OpenRouterService.prototype.validateSkillTopic(skillTopic)) {
      return ResponseHelper.validationError('Invalid skill topic');
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (!validDifficulties.includes(difficulty)) {
      return ResponseHelper.validationError('Invalid difficulty level');
    }

    const validTypes = ['practical', 'quiz', 'project'];
    if (!validTypes.includes(type)) {
      return ResponseHelper.validationError('Invalid exercise type');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user has active subscription for AI features
    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription || subscription.status !== 'active') {
      return ResponseHelper.forbidden('Active subscription required for AI exercise generation');
    }

    // Initialize OpenRouter service
    const openRouterService = new OpenRouterService();

    // Generate exercise
    const exercise = await openRouterService.generateExercise(skillTopic, difficulty, type);

    // Store exercise in database
    const exerciseRecord = await DatabaseHelper.createSession({
      userId: user.id,
      sessionType: 'ai_exercise',
      exerciseData: exercise,
      createdAt: new Date().toISOString(),
    });

    // Log exercise generation for analytics
    console.log(`Exercise generated for user ${user.uid}: ${skillTopic} (${difficulty}, ${type})`);

    return ResponseHelper.success({
      exercise: exercise,
      exerciseId: exerciseRecord.id,
      generatedAt: exercise.generatedAt,
      message: 'Exercise generated successfully',
    });

  } catch (error) {
    console.error('Generate exercise error:', error);
    
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
    if (error.message.includes('Failed to generate exercise')) {
      return ResponseHelper.serverError('Failed to generate exercise. Please try again later.');
    }

    return ResponseHelper.serverError('Failed to generate exercise');
  }
};