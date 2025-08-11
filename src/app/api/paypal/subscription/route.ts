import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';
import { payPalService } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
const token = request.headers.get('authorization')?.split('Bearer ')[1];
    const { planType, userEmail } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!['trader', 'creator', 'organization'].includes(planType)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // Create PayPal subscription
    const subscription = await payPalService.createSubscription(
      planType as 'trader' | 'creator' | 'organization',
      userEmail || decodedToken.email || ''
    );

    // Update user profile with subscription info
    await firebaseAdmin.updateUserProfile(uid, {
      subscription: {
        plan: planType,
        status: 'pending',
        paypalOrderId: subscription.id,
        createdAt: new Date().toISOString()
      }
    });

    return NextResponse.json({ 
      success: true,
      subscription,
      approvalUrl: subscription.approvalUrl
    });
  } catch (error) {
    console.error('PayPal subscription creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create subscription' 
    }, { status: 500 });
  }
}