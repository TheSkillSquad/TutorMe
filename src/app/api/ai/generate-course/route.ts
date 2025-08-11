import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';
import { openRouterService } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    // ✅ Fix: Declare token properly
    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    const { skillTopic, userLevel, duration } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // ✅ Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // ✅ Generate AI course
    const courseContent = await openRouterService.generateSkillCourse(
      skillTopic,
      userLevel || 'beginner',
      duration || 3
    );

    return NextResponse.json({ 
      success: true,
      course: courseContent,
      metadata: {
        skillTopic,
        userLevel,
        duration,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Course generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate course' 
    }, { status: 500 });
  }
}