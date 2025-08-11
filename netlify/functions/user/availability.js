// Netlify Function for user availability management
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
      return await getAvailability(decodedToken.uid);
    } else if (method === 'PUT') {
      return await updateAvailability(decodedToken.uid, event);
    } else if (method === 'PATCH') {
      return await updateAvailability(decodedToken.uid, event);
    } else {
      return ResponseHelper.error('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Availability error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to process availability request');
  }
};

async function getAvailability(uid) {
  try {
    const user = await DatabaseHelper.findUserByUid(uid);
    
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    return ResponseHelper.success({
      availability: user.profile?.availability || {},
    });
  } catch (error) {
    console.error('Get availability error:', error);
    return ResponseHelper.serverError('Failed to get user availability');
  }
}

async function updateAvailability(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { availability } = body;

    // Validate availability structure
    const availabilitySchema = {
      monday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      tuesday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      wednesday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      thursday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      friday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      saturday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
      sunday: Joi.array().items(Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
    };

    const validatedAvailability = ValidationHelper.validate(availabilitySchema, availability);

    // Validate time slots (must be in pairs and properly formatted)
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    for (const day of days) {
      if (validatedAvailability[day]) {
        const timeSlots = validatedAvailability[day];
        if (timeSlots.length % 2 !== 0) {
          return ResponseHelper.validationError(`${day} must have an even number of time slots (start-end pairs)`);
        }

        // Validate time slot pairs
        for (let i = 0; i < timeSlots.length; i += 2) {
          const startTime = timeSlots[i];
          const endTime = timeSlots[i + 1];
          
          if (startTime >= endTime) {
            return ResponseHelper.validationError(`${day}: End time must be after start time`);
          }
        }
      }
    }

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    await DatabaseHelper.updateUser(uid, {
      profile: {
        ...user.profile,
        availability: validatedAvailability,
      },
      updatedAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      availability: validatedAvailability,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    console.error('Update availability error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    return ResponseHelper.serverError('Failed to update availability');
  }
}

// Helper function to validate time format
function isValidTime(time) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Helper function to compare times
function compareTimes(time1, time2) {
  const [hours1, minutes1] = time1.split(':').map(Number);
  const [hours2, minutes2] = time2.split(':').map(Number);
  
  if (hours1 !== hours2) {
    return hours1 - hours2;
  }
  return minutes1 - minutes2;
}