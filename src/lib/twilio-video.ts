// src/lib/twilio-video.ts

/**
 * Twilio Video service wrapper
 * - Generates Access Tokens for clients to join rooms
 * - Basic room management helpers via Twilio REST API
 *
 * Notes:
 * - VideoGrant is available at AccessToken.VideoGrant (not twilio.jwt.VideoGrant).
 * - Twilio Programmable Video does not support start/stop recording via REST at will.
 *   You enable recording on room creation, or use Compositions/Media Processor.
 */

type TwilioClient = any;

class TwilioVideoService {
  private accountSid: string;
  private apiKey: string;
  private apiSecret: string;
  private client: TwilioClient | null = null;

  constructor(opts?: {
    accountSid?: string;
    apiKey?: string;
    apiSecret?: string;
  }) {
    this.accountSid = opts?.accountSid ?? process.env.TWILIO_ACCOUNT_SID ?? '';
    this.apiKey = opts?.apiKey ?? process.env.TWILIO_API_KEY ?? '';
    this.apiSecret = opts?.apiSecret ?? process.env.TWILIO_API_SECRET ?? '';

    if (!this.accountSid || !this.apiKey || !this.apiSecret) {
      // We keep construction lenient so builds don’t crash in CI.
      // Methods will throw helpful errors if credentials are actually missing at runtime.
      // console.warn('Twilio credentials are missing. Set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET.');
    }
  }

  private ensureCreds() {
    if (!this.accountSid || !this.apiKey || !this.apiSecret) {
      throw new Error(
        'Twilio Video credentials missing. Please set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET.'
      );
    }
  }

  private async getClient() {
    if (this.client) return this.client;
    this.ensureCreds();
    const twilio = await import('twilio');
    // REST client: for Room/Participant operations
    this.client = new twilio.Twilio(this.apiKey, this.apiSecret, {
      accountSid: this.accountSid,
    });
    return this.client;
  }

  /**
   * Generate a client access token to join a Video room.
   * @param identity A unique user identity
   * @param roomName Optional room to scope the grant to
   */
  async generateVideoToken(
    identity: string,
    roomName?: string
  ): Promise<{ token: string; identity: string; room?: string }> {
    this.ensureCreds();

    const twilio = await import('twilio');
    const { AccessToken } = twilio.jwt;
    const { VideoGrant } = AccessToken; // <-- Correct place for VideoGrant

    const token = new AccessToken(this.accountSid, this.apiKey, this.apiSecret, {
      identity,
      // Optionally set TTL: ttl: 60 * 60,
    });

    const grant = new VideoGrant(
      roomName ? { room: roomName } : undefined
    );
    token.addGrant(grant);

    const jwt = token.toJwt();
    return { token: jwt, identity, room: roomName };
  }

  /**
   * Create a Video room.
   * For simple usage, "type: 'go'" creates ad-hoc Go Rooms (no REST recordings).
   * For Group Rooms (with recordings support), use type: 'group' or 'group-small'.
   */
  async createVideoRoom(
    roomName: string,
    options?: Partial<{
      type: 'go' | 'group' | 'group-small' | 'peer-to-peer';
      recordParticipantsOnConnect: boolean;
      mediaRegion: string;
      maxParticipants: number;
      statusCallback: string;
    }>
  ): Promise<any> {
    const client = await this.getClient();
    const payload: any = {
      uniqueName: roomName,
      type: options?.type ?? 'go',
    };

    if (options?.recordParticipantsOnConnect !== undefined) {
      payload.recordParticipantsOnConnect = options.recordParticipantsOnConnect;
    }
    if (options?.mediaRegion) payload.mediaRegion = options.mediaRegion;
    if (options?.maxParticipants) payload.maxParticipants = options.maxParticipants;
    if (options?.statusCallback) payload.statusCallback = options.statusCallback;

    return client.video.v1.rooms.create(payload);
  }

  /**
   * Fetch a Video room by SID or uniqueName.
   */
  async getVideoRoom(roomSidOrName: string): Promise<any> {
    const client = await this.getClient();
    return client.video.v1.rooms(roomSidOrName).fetch();
  }

  /**
   * Complete (end) a room. Works for in-progress Group rooms.
   */
  async completeVideoRoom(roomSidOrName: string): Promise<any> {
    const client = await this.getClient();
    return client.video.v1.rooms(roomSidOrName).update({ status: 'completed' });
  }

  /**
   * List participants for a room.
   */
  async getRoomParticipants(roomSidOrName: string): Promise<any[]> {
    const client = await this.getClient();
    return client.video.v1.rooms(roomSidOrName).participants.list();
  }

  /**
   * Twilio Programmable Video does not expose a direct "start recording" toggle via REST.
   * Recording is configured at room creation or via Composition/Media Processor.
   * These stubs return informative messages so the rest of your app can proceed safely.
   */
  async startRecording(_roomSidOrName: string): Promise<{ message: string }> {
    return {
      message:
        'Start recording is not directly supported by Twilio Programmable Video REST API. ' +
        'Enable recording when creating Group rooms (recordParticipantsOnConnect) or use Compositions.',
    };
  }

  async stopRecording(_roomSidOrName: string): Promise<{ message: string }> {
    return {
      message:
        'Stop recording is not directly supported by Twilio Programmable Video REST API. ' +
        'To end recordings, complete the room or finalize compositions.',
    };
  }

  /**
   * List recordings for a room (Group rooms). For Go rooms, recordings aren’t available.
   */
  async getRecordings(roomSid: string): Promise<any[]> {
    const client = await this.getClient();
    // Filter recordings grouped by room SID
    return client.video.v1.recordings.list({ groupingSid: [roomSid] });
  }

  /**
   * Placeholder analytics. Twilio has Video Insights/Rooms API but no single "analytics" endpoint here.
   * You can build analytics on participants, tracks, and recordings as needed.
   */
  async getRoomAnalytics(roomSidOrName: string): Promise<{
    room: any;
    participants: any[];
    recordings: any[];
  }> {
    const [room, participants, recordings] = await Promise.all([
      this.getVideoRoom(roomSidOrName),
      this.getRoomParticipants(roomSidOrName),
      this.getRecordings(roomSidOrName).catch(() => []),
    ]);

    return { room, participants, recordings };
  }
}

// Export a singleton for convenience
export const twilioVideoService = new TwilioVideoService();
export type TwilioVideoServiceType = typeof twilioVideoService;
export default TwilioVideoService;