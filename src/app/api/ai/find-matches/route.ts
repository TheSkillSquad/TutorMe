import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    const { availableTraders } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // ✨ Add your actual match-finding logic here
    // This is just placeholder output for now:
    const matched = availableTraders?.filter(() => Math.random() > 0.5); // Mock match logic

    return NextResponse.json({
      message: 'Matches found',
      matched,
    });
  } catch (error) {
    console.error('Find matches error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}