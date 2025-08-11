// Netlify Function for Pusher configuration (Alternative to WebSockets)
const ResponseHelper = require('../utils/response');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'GET') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    // Pusher configuration for real-time features
    const pusherConfig = {
      key: process.env.PUSHER_KEY || 'your-pusher-key',
      cluster: process.env.PUSHER_CLUSTER || 'us2',
      encrypted: true,
      authEndpoint: '/.netlify/functions/websocket/pusher-auth',
      auth: {
        params: {},
        headers: {},
      },
    };

    // Available channels for different features
    const channels = {
      // User-specific channels
      user: (userId) => `private-user-${userId}`,
      
      // Session channels
      session: (sessionId) => `private-session-${sessionId}`,
      
      // Public channels
      notifications: 'notifications',
      onlineUsers: 'online-users',
      
      // Course channels
      course: (courseId) => `private-course-${courseId}`,
      
      // Video session channels
      video: (roomId) => `private-video-${roomId}`,
    };

    // Available events
    const events = {
      // User events
      'user-online': 'User came online',
      'user-offline': 'User went offline',
      'user-updated': 'User profile updated',
      
      // Session events
      'session-started': 'Video session started',
      'session-ended': 'Video session ended',
      'session-participant-joined': 'Participant joined session',
      'session-participant-left': 'Participant left session',
      
      // Notification events
      'notification-new': 'New notification',
      'notification-read': 'Notification read',
      
      // Course events
      'course-created': 'Course created',
      'course-updated': 'Course updated',
      'course-published': 'Course published',
      
      // Payment events
      'payment-completed': 'Payment completed',
      'subscription-activated': 'Subscription activated',
      'subscription-cancelled': 'Subscription cancelled',
      
      // Matching events
      'tutor-found': 'Tutor match found',
      'session-requested': 'Session requested',
      'session-accepted': 'Session accepted',
      'session-rejected': 'Session rejected',
    };

    return ResponseHelper.success({
      config: pusherConfig,
      channels,
      events,
      setup: {
        status: 'configured',
        instructions: {
          frontend: 'Use pusher-js library in frontend',
          backend: 'Use Pusher server libraries',
          auth: 'Authentication endpoint configured',
        },
        requiredEnvVars: [
          'PUSHER_KEY',
          'PUSHER_SECRET',
          'PUSHER_CLUSTER',
          'PUSHER_APP_ID',
        ],
      },
    });

  } catch (error) {
    console.error('Pusher config error:', error);
    return ResponseHelper.serverError('Failed to get Pusher configuration');
  }
};