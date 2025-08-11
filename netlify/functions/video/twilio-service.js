// Twilio Video service utilities for Netlify Functions
const twilio = require('twilio');

class TwilioVideoService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { accountSid: process.env.TWILIO_ACCOUNT_SID }
    );
  }

  async generateVideoToken(identity, roomName = null) {
    try {
      const token = new twilio.jwt.AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { identity }
      );

      // Add Video grant
      const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
        room: roomName,
      });
      token.addGrant(videoGrant);

      return {
        token: token.toJwt(),
        identity,
        roomName: roomName || 'default-room',
      };
    } catch (error) {
      console.error('Generate video token error:', error);
      throw new Error('Failed to generate video token');
    }
  }

  async createRoom(roomData) {
    try {
      const roomOptions = {
        type: roomData.type || 'group',
        uniqueName: roomData.roomName,
        recordParticipantsOnConnect: roomData.recordParticipantsOnConnect || false,
      };

      if (roomData.statusCallback) {
        roomOptions.statusCallback = roomData.statusCallback;
      }

      const room = await this.client.video.v1.rooms.create(roomOptions);
      return room;
    } catch (error) {
      console.error('Create room error:', error);
      throw new Error('Failed to create video room');
    }
  }

  async getRoom(roomSid) {
    try {
      const room = await this.client.video.v1.rooms(roomSid).fetch();
      return room;
    } catch (error) {
      console.error('Get room error:', error);
      throw new Error('Failed to get video room');
    }
  }

  async getRooms(status = 'in-progress') {
    try {
      const rooms = await this.client.video.v1.rooms.list({ status });
      return rooms;
    } catch (error) {
      console.error('Get rooms error:', error);
      throw new Error('Failed to get video rooms');
    }
  }

  async completeRoom(roomSid) {
    try {
      const room = await this.client.video.v1.rooms(roomSid).update({ status: 'completed' });
      return room;
    } catch (error) {
      console.error('Complete room error:', error);
      throw new Error('Failed to complete video room');
    }
  }

  async getRoomParticipants(roomSid) {
    try {
      const participants = await this.client.video.v1.rooms(roomSid).participants.list();
      return participants;
    } catch (error) {
      console.error('Get room participants error:', error);
      throw new Error('Failed to get room participants');
    }
  }

  async removeParticipant(roomSid, participantSid) {
    try {
      const participant = await this.client.video.v1.rooms(roomSid)
        .participants(participantSid)
        .update({ status: 'disconnected' });
      return participant;
    } catch (error) {
      console.error('Remove participant error:', error);
      throw new Error('Failed to remove participant');
    }
  }

  async getParticipant(roomSid, participantSid) {
    try {
      const participant = await this.client.video.v1.rooms(roomSid)
        .participants(participantSid)
        .fetch();
      return participant;
    } catch (error) {
      console.error('Get participant error:', error);
      throw new Error('Failed to get participant');
    }
  }

  async subscribeToTrack(roomSid, participantSid, trackSid) {
    try {
      const subscribedTrack = await this.client.video.v1.rooms(roomSid)
        .participants(participantSid)
        .subscribedTracks(trackSid)
        .update({ status: 'enabled' });
      return subscribedTrack;
    } catch (error) {
      console.error('Subscribe to track error:', error);
      throw new Error('Failed to subscribe to track');
    }
  }

  async unsubscribeFromTrack(roomSid, participantSid, trackSid) {
    try {
      const unsubscribedTrack = await this.client.video.v1.rooms(roomSid)
        .participants(participantSid)
        .subscribedTracks(trackSid)
        .update({ status: 'disabled' });
      return unsubscribedTrack;
    } catch (error) {
      console.error('Unsubscribe from track error:', error);
      throw new Error('Failed to unsubscribe from track');
    }
  }

  async getRecordingRules(roomSid) {
    try {
      const rules = await this.client.video.v1.rooms(roomSid)
        .recordingRules()
        .fetch();
      return rules;
    } catch (error) {
      console.error('Get recording rules error:', error);
      throw new Error('Failed to get recording rules');
    }
  }

  async updateRecordingRules(roomSid, rules) {
    try {
      const updatedRules = await this.client.video.v1.rooms(roomSid)
        .recordingRules()
        .update({ rules });
      return updatedRules;
    } catch (error) {
      console.error('Update recording rules error:', error);
      throw new Error('Failed to update recording rules');
    }
  }

  async getCompositions(roomSid) {
    try {
      const compositions = await this.client.video.v1.rooms(roomSid)
        .compositions
        .list();
      return compositions;
    } catch (error) {
      console.error('Get compositions error:', error);
      throw new Error('Failed to get compositions');
    }
  }

  async createComposition(roomSid, compositionData) {
    try {
      const composition = await this.client.video.v1.compositions.create({
        roomSid: roomSid,
        format: compositionData.format || 'mp4',
        videoLayout: compositionData.videoLayout || 'grid',
        audioSources: compositionData.audioSources || '*',
      });
      return composition;
    } catch (error) {
      console.error('Create composition error:', error);
      throw new Error('Failed to create composition');
    }
  }

  async getComposition(compositionSid) {
    try {
      const composition = await this.client.video.v1.compositions(compositionSid).fetch();
      return composition;
    } catch (error) {
      console.error('Get composition error:', error);
      throw new Error('Failed to get composition');
    }
  }

  async deleteComposition(compositionSid) {
    try {
      await this.client.video.v1.compositions(compositionSid).remove();
      return { success: true };
    } catch (error) {
      console.error('Delete composition error:', error);
      throw new Error('Failed to delete composition');
    }
  }

  // Utility functions
  validateRoomName(roomName) {
    // Room names must be between 1-100 characters and contain only letters, numbers, and hyphens
    const roomNameRegex = /^[a-zA-Z0-9-]{1,100}$/;
    return roomNameRegex.test(roomName);
  }

  validateIdentity(identity) {
    // Identity must be between 1-50 characters and contain only letters, numbers, and underscores
    const identityRegex = /^[a-zA-Z0-9_]{1,50}$/;
    return identityRegex.test(identity);
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  getRoomStatusText(status) {
    const statusMap = {
      'in-progress': 'Active',
      'completed': 'Completed',
      'failed': 'Failed',
    };
    return statusMap[status] || status;
  }

  getParticipantStatusText(status) {
    const statusMap = {
      'connected': 'Connected',
      'disconnected': 'Disconnected',
      'failed': 'Failed',
    };
    return statusMap[status] || status;
  }

  // Statistics and monitoring
  async getRoomStatistics(roomSid) {
    try {
      const room = await this.getRoom(roomSid);
      const participants = await this.getRoomParticipants(roomSid);
      
      return {
        roomSid: room.sid,
        roomName: room.uniqueName,
        status: room.status,
        duration: room.duration,
        maxParticipants: room.maxParticipants,
        currentParticipants: participants.length,
        created: room.dateCreated,
        ended: room.dateUpdated,
        recordingEnabled: room.recordParticipantsOnConnect,
      };
    } catch (error) {
      console.error('Get room statistics error:', error);
      throw new Error('Failed to get room statistics');
    }
  }

  async getAccountUsage() {
    try {
      const usage = await this.client.api.v2010.accounts(process.env.TWILIO_ACCOUNT_SID)
        .usage
        .records
        .list({ category: 'video' });
      return usage;
    } catch (error) {
      console.error('Get account usage error:', error);
      throw new Error('Failed to get account usage');
    }
  }
}

module.exports = TwilioVideoService;