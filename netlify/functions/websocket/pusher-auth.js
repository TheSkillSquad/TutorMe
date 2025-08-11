// Netlify Function for Pusher authentication
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    const body = JSON.parse(event.body);
    const { socket_id, channel_name } = body;

    if (!socket_id || !channel_name) {
      return ResponseHelper.validationError('Socket ID and channel name are required');
    }

    // Authenticate the user
    const decodedToken = await AuthHelper.authenticateRequest(event);
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);

    if (!user) {
      return ResponseHelper.unauthorized('User not found');
    }

    // Check if user has access to the channel
    const channelAccess = await checkChannelAccess(user, channel_name);

    if (!channelAccess.allowed) {
      return ResponseHelper.forbidden(channelAccess.reason);
    }

    // Generate Pusher authentication signature
    const pusher = require('pusher');
    const pusherClient = new pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    });

    const auth = pusherClient.authenticate(socket_id, channel_name, {
      user_id: user.uid,
      user_info: {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      },
    });

    return ResponseHelper.success({
      auth: auth.auth,
      channel_data: auth.channel_data,
    });

  } catch (error) {
    console.error('Pusher auth error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    if (error.message.includes('Forbidden')) {
      return ResponseHelper.forbidden(error.message);
    }

    return ResponseHelper.serverError('Failed to authenticate with Pusher');
  }
};

// Helper function to check channel access
async function checkChannelAccess(user, channelName) {
  // Private user channel
  if (channelName.startsWith('private-user-')) {
    const userId = channelName.replace('private-user-', '');
    if (userId === user.uid) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Access denied to user channel' };
  }

  // Private session channel
  if (channelName.startsWith('private-session-')) {
    const sessionId = channelName.replace('private-session-', '');
    // Check if user is part of the session
    const session = await DatabaseHelper.findSession(sessionId);
    if (session && (session.userId === user.id || session.participantId === user.id)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Access denied to session channel' };
  }

  // Private course channel
  if (channelName.startsWith('private-course-')) {
    const courseId = channelName.replace('private-course-', '');
    // Check if user owns the course or is enrolled
    const course = await DatabaseHelper.findCourse(courseId);
    if (course && (course.userId === user.id || course.enrolledUsers?.includes(user.id))) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Access denied to course channel' };
  }

  // Private video channel
  if (channelName.startsWith('private-video-')) {
    const roomId = channelName.replace('private-video-', '');
    // Check if user is part of the video session
    const session = await DatabaseHelper.findSessionByRoomId(roomId);
    if (session && (session.userId === user.id || session.participantId === user.id)) {
      return { allowed: true };
    }
    return { allowed: false, reason: 'Access denied to video channel' };
  }

  // Public channels - allow access to all authenticated users
  if (['notifications', 'online-users'].includes(channelName)) {
    return { allowed: true };
  }

  // Unknown channel type
  return { allowed: false, reason: 'Unknown channel type' };
}