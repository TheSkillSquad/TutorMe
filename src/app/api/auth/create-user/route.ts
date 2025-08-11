import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { token, profileData } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // Check if user profile already exists
    try {
      const existingProfile = await firebaseAdmin.getUserProfile(uid);
      return NextResponse.json({ 
        message: 'User already exists', 
        user: existingProfile 
      });
    } catch (error) {
      // User doesn't exist, create new profile
      const userProfile = {
        email: decodedToken.email,
        displayName: decodedToken.name || '',
        photoURL: decodedToken.picture || '',
        skillsOffered: [],
        skillsWanted: [],
        tradingHistory: [],
        subscription: 'free',
        stats: {
          totalTrades: 0,
          successfulTrades: 0,
          averageRating: 0,
          totalHours: 0
        },
        preferences: {
          notifications: true,
          emailUpdates: true,
          language: 'en',
          timezone: 'UTC'
        },
        ...profileData
      };

      await firebaseAdmin.createUserProfile(uid, userProfile);
      
      return NextResponse.json({ 
        message: 'User created successfully', 
        user: userProfile 
      });
    }
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ 
      error: 'Failed to create user' 
    }, { status: 500 });
  }
}