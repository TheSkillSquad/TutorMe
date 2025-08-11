import { NextRequest, NextResponse } from 'next/server';
import { twilioVideoService } from '@/lib/twilio-video'; // ✅ Import the instance

export async function POST(request: NextRequest) {
  try {
    // ✅ Extract bearer token safely
    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    // ✅ Validate request body
    const { roomName, options } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // ✅ OPTIONAL: Add your Firebase or custom token verification here
    // Example:
    // const decoded = await firebaseAdmin.verifyToken(token);
    // const uid = decoded.uid;

    // ✅ Use the instance (not class) and method that exists
    const room = await twilioVideoService.createVideoRoom(roomName, options);

    return NextResponse.json({ room });
  } catch (error) {
    console.error('Twilio room error:', error);
    return NextResponse.json({ error: 'Failed to create or join room' }, { status: 500 });
  }
}