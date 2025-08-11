// Netlify Function for generating AI courses
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
    
    const validatedData = ValidationHelper.validate(ValidationHelper.aiCourseSchema, body);

    // Validate input
    if (!OpenRouterService.prototype.validateSkillTopic(validatedData.skillTopic)) {
      return ResponseHelper.validationError('Invalid skill topic');
    }

    if (!OpenRouterService.prototype.validateUserLevel(validatedData.userLevel)) {
      return ResponseHelper.validationError('Invalid user level');
    }

    if (!OpenRouterService.prototype.validateDuration(validatedData.duration)) {
      return ResponseHelper.validationError('Invalid duration');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user has active subscription for AI features
    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription || subscription.status !== 'active') {
      return ResponseHelper.forbidden('Active subscription required for AI course generation');
    }

    // Initialize OpenRouter service
    const openRouterService = new OpenRouterService();

    // Generate AI course
    const courseContent = await openRouterService.generateSkillCourse(
      validatedData.skillTopic,
      validatedData.userLevel,
      validatedData.duration,
      {
        includeExercises: validatedData.includeExercises,
        includeQuizzes: validatedData.includeQuizzes,
        includeProjects: validatedData.includeProjects,
      }
    );

    // Store course in database
    const course = await DatabaseHelper.createCourse({
      userId: user.id,
      title: courseContent.title || `${validatedData.skillTopic} Course`,
      description: courseContent.description,
      skillTopic: validatedData.skillTopic,
      userLevel: validatedData.userLevel,
      duration: validatedData.duration,
      content: courseContent,
      isPublished: false,
      generatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Log course generation for analytics
    console.log(`Course generated for user ${user.uid}: ${validatedData.skillTopic}`);

    return ResponseHelper.success({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        skillTopic: course.skillTopic,
        userLevel: course.userLevel,
        duration: course.duration,
        content: course.content,
        isPublished: course.isPublished,
        generatedAt: course.generatedAt,
      },
      metadata: {
        skillTopic: validatedData.skillTopic,
        userLevel: validatedData.userLevel,
        duration: validatedData.duration,
        includeExercises: validatedData.includeExercises,
        includeQuizzes: validatedData.includeQuizzes,
        includeProjects: validatedData.includeProjects,
        generatedAt: courseContent.generatedAt,
      },
      message: 'Course generated successfully',
    });

  } catch (error) {
    console.error('Generate course error:', error);
    
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
    if (error.message.includes('Failed to generate skill course')) {
      return ResponseHelper.serverError('Failed to generate course. Please try again later.');
    }

    return ResponseHelper.serverError('Failed to generate course');
  }
};