import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // Get user profile
    const userProfile = await firebaseAdmin.getUserProfile(uid);
    
    return NextResponse.json({ user: userProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to get user profile' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split('Bearer ')[1];
    const updateData = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // Update user profile
    await firebaseAdmin.updateUserProfile(uid, updateData);
    
    return NextResponse.json({ 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ 
      error: 'Failed to update profile' 
    }, { status: 500 });
  }
}