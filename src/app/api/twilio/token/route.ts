// src/app/api/twilio/token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { twilioVideoService } from '@/lib/twilio-video';

export async function POST(req: NextRequest) {
  try {
    // Expect JSON: { identity: string, roomName?: string }
    const body = await req.json().catch(() => ({}));
    const identity = typeof body?.identity === 'string' ? body.identity : '';
    const roomName = typeof body?.roomName === 'string' ? body.roomName : undefined;

    if (!identity) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'identity (string) is required' },
        },
        { status: 400 }
      );
    }

    // Service returns { token, identity, room?: string }
    const result = await twilioVideoService.generateVideoToken(identity, roomName);

    return NextResponse.json({
      success: true,
      data: {
        token: result.token,
        identity: result.identity,
        // Map the returned 'room' to 'roomName' so your frontend can keep using 'roomName'
        roomName: result.room ?? roomName ?? null,
      },
    });
  } catch (error) {
    console.error('Twilio token error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'VIDEO_SERVICE_ERROR', message: 'Failed to generate token' },
      },
      { status: 500 }
    );
  }
}