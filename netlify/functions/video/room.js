// Netlify Function for managing Twilio video rooms
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

  try {
    const method = event.httpMethod;
    const decodedToken = await AuthHelper.authenticateRequest(event);

    if (method === 'POST') {
      return await createRoom(decodedToken.uid, event);
    } else if (method === 'GET') {
      return await getRooms(decodedToken.uid, event);
    } else if (method === 'DELETE') {
      return await deleteRoom(decodedToken.uid, event);
    } else {
      return ResponseHelper.error('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Room management error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to process room request');
  }
};

async function createRoom(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const validatedData = ValidationHelper.validate(ValidationHelper.twilioRoomSchema, body);

    // Validate room name
    if (!TwilioVideoService.prototype.validateRoomName(validatedData.roomName)) {
      return ResponseHelper.validationError('Invalid room name format');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user has active subscription
    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription || subscription.status !== 'active') {
      return ResponseHelper.forbidden('Active subscription required for video sessions');
    }

    // Initialize Twilio service
    const twilioService = new TwilioVideoService();

    // Create video room
    const room = await twilioService.createRoom(validatedData);

    // Create session record in database
    const session = await DatabaseHelper.createSession({
      userId: user.id,
      roomName: validatedData.roomName,
      roomSid: room.sid,
      status: 'created',
      type: validatedData.type,
      maxParticipants: validatedData.maxParticipants || 50,
      isRecorded: validatedData.recordParticipantsOnConnect || false,
      createdAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      room: {
        sid: room.sid,
        name: room.uniqueName,
        status: room.status,
        type: room.type,
        maxParticipants: room.maxParticipants,
        recordParticipantsOnConnect: room.recordParticipantsOnConnect,
        dateCreated: room.dateCreated,
        url: room.url,
      },
      session: {
        id: session.id,
        status: session.status,
      },
      message: 'Video room created successfully',
    });

  } catch (error) {
    console.error('Create room error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    if (error.message.includes('Forbidden')) {
      return ResponseHelper.forbidden(error.message);
    }

    return ResponseHelper.serverError('Failed to create video room');
  }
}

async function getRooms(uid, event) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { status, roomSid } = queryParams;

    // Get user information
    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Initialize Twilio service
    const twilioService = new TwilioVideoService();

    let rooms;
    if (roomSid) {
      // Get specific room
      const room = await twilioService.getRoom(roomSid);
      rooms = [room];
    } else {
      // Get rooms by status
      rooms = await twilioService.getRooms(status || 'in-progress');
    }

    // Get additional room details
    const roomsWithDetails = await Promise.all(rooms.map(async (room) => {
      try {
        const participants = await twilioService.getRoomParticipants(room.sid);
        const statistics = await twilioService.getRoomStatistics(room.sid);
        
        return {
          sid: room.sid,
          name: room.uniqueName,
          status: room.status,
          type: room.type,
          maxParticipants: room.maxParticipants,
          currentParticipants: participants.length,
          duration: statistics.duration,
          dateCreated: room.dateCreated,
          dateUpdated: room.dateUpdated,
          recordingEnabled: room.recordParticipantsOnConnect,
          participants: participants.map(p => ({
            sid: p.sid,
            identity: p.identity,
            status: p.status,
            startTime: p.startTime,
            endTime: p.endTime,
          })),
        };
      } catch (error) {
        console.error('Error getting room details:', error);
        return {
          sid: room.sid,
          name: room.uniqueName,
          status: room.status,
          error: 'Failed to get room details',
        };
      }
    }));

    // Filter rooms by user if needed
    const userRooms = roomsWithDetails.filter(room => {
      // In a real implementation, you'd check if the user has access to this room
      // For now, we'll return all rooms
      return true;
    });

    return ResponseHelper.success({
      rooms: userRooms,
      total: userRooms.length,
      message: 'Rooms retrieved successfully',
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    return ResponseHelper.serverError('Failed to get rooms');
  }
}

async function deleteRoom(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { roomSid, reason = 'User requested deletion' } = body;

    if (!roomSid) {
      return ResponseHelper.validationError('Room SID is required');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Initialize Twilio service
    const twilioService = new TwilioVideoService();

    // Complete the room (this effectively ends the room)
    const room = await twilioService.completeRoom(roomSid);

    // Update session record
    await DatabaseHelper.updateSession(roomSid, {
      status: 'completed',
      endedAt: new Date().toISOString(),
      endReason: reason,
    });

    return ResponseHelper.success({
      room: {
        sid: room.sid,
        status: room.status,
        dateUpdated: room.dateUpdated,
      },
      message: 'Room completed successfully',
    });

  } catch (error) {
    console.error('Delete room error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    return ResponseHelper.serverError('Failed to delete room');
  }
}