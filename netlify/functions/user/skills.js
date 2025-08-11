// Netlify Function for user skills management
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
      return await getSkills(decodedToken.uid);
    } else if (method === 'POST') {
      return await addSkill(decodedToken.uid, event);
    } else if (method === 'PUT') {
      return await updateSkills(decodedToken.uid, event);
    } else if (method === 'DELETE') {
      return await removeSkill(decodedToken.uid, event);
    } else {
      return ResponseHelper.error('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Skills error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to process skills request');
  }
};

async function getSkills(uid) {
  try {
    const user = await DatabaseHelper.findUserByUid(uid);
    
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    return ResponseHelper.success({
      skills: user.profile?.skills || [],
    });
  } catch (error) {
    console.error('Get skills error:', error);
    return ResponseHelper.serverError('Failed to get user skills');
  }
}

async function addSkill(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { skill } = body;

    if (!skill || typeof skill !== 'string') {
      return ResponseHelper.validationError('Skill is required and must be a string');
    }

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    const currentSkills = user.profile?.skills || [];
    
    // Check if skill already exists
    if (currentSkills.includes(skill)) {
      return ResponseHelper.validationError('Skill already exists');
    }

    // Add new skill
    const updatedSkills = [...currentSkills, skill];

    await DatabaseHelper.updateUser(uid, {
      profile: {
        ...user.profile,
        skills: updatedSkills,
      },
      updatedAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      skills: updatedSkills,
      message: 'Skill added successfully',
    });
  } catch (error) {
    console.error('Add skill error:', error);
    return ResponseHelper.serverError('Failed to add skill');
  }
}

async function updateSkills(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { skills } = body;

    if (!Array.isArray(skills)) {
      return ResponseHelper.validationError('Skills must be an array');
    }

    // Validate each skill
    for (const skill of skills) {
      if (typeof skill !== 'string') {
        return ResponseHelper.validationError('All skills must be strings');
      }
    }

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    await DatabaseHelper.updateUser(uid, {
      profile: {
        ...user.profile,
        skills: skills,
      },
      updatedAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      skills,
      message: 'Skills updated successfully',
    });
  } catch (error) {
    console.error('Update skills error:', error);
    return ResponseHelper.serverError('Failed to update skills');
  }
}

async function removeSkill(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { skill } = body;

    if (!skill || typeof skill !== 'string') {
      return ResponseHelper.validationError('Skill is required and must be a string');
    }

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    const currentSkills = user.profile?.skills || [];
    
    // Check if skill exists
    if (!currentSkills.includes(skill)) {
      return ResponseHelper.validationError('Skill not found');
    }

    // Remove skill
    const updatedSkills = currentSkills.filter(s => s !== skill);

    await DatabaseHelper.updateUser(uid, {
      profile: {
        ...user.profile,
        skills: updatedSkills,
      },
      updatedAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      skills: updatedSkills,
      message: 'Skill removed successfully',
    });
  } catch (error) {
    console.error('Remove skill error:', error);
    return ResponseHelper.serverError('Failed to remove skill');
  }
}