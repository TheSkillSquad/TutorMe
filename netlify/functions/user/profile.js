// Netlify Function for user profile management
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');
const ValidationHelper = require('../utils/validation');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  try {
    const method = event.httpMethod;
    const decodedToken = await AuthHelper.authenticateRequest(event);

    if (method === 'GET') {
      return await getProfile(decodedToken.uid);
    } else if (method === 'PUT') {
      return await updateProfile(decodedToken.uid, event);
    } else if (method === 'PATCH') {
      return await updateProfile(decodedToken.uid, event);
    } else {
      return ResponseHelper.error('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Profile error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to process profile request');
  }
};

async function getProfile(uid) {
  try {
    const user = await DatabaseHelper.findUserByUid(uid);
    
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Return user profile without sensitive information
    const profile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      subscription: user.subscription,
      profile: user.profile,
    };

    return ResponseHelper.success({ user: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return ResponseHelper.serverError('Failed to get user profile');
  }
}

async function updateProfile(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const validatedData = ValidationHelper.validate(ValidationHelper.updateUserSchema, body);

    // Update user in database
    const updatedUser = await DatabaseHelper.updateUser(uid, {
      ...validatedData,
      updatedAt: new Date().toISOString(),
    });

    // Update Firebase user if displayName changed
    if (validatedData.displayName) {
      await AuthHelper.updateUser(uid, {
        displayName: validatedData.displayName,
      });
    }

    // Return updated profile
    const profile = {
      uid: updatedUser.uid,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL,
      updatedAt: updatedUser.updatedAt,
      subscription: updatedUser.subscription,
      profile: updatedUser.profile,
    };

    return ResponseHelper.success({
      user: profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    return ResponseHelper.serverError('Failed to update profile');
  }
}