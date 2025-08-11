import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebase-admin';
import { payPalService } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
const token = request.headers.get('authorization')?.split('Bearer ')[1];
    const { orderId } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Verify the Firebase token
    const decodedToken = await firebaseAdmin.verifyToken(token);
    const uid = decodedToken.uid;

    // Capture PayPal order
    const capture = await payPalService.captureOrder(orderId);

    // Update user profile with successful subscription
    await firebaseAdmin.updateUserProfile(uid, {
      subscription: {
        status: 'active',
        activatedAt: new Date().toISOString(),
        paypalOrderId: orderId,
        lastPaymentAt: new Date().toISOString()
      }
    });

    // Log the successful payment for analytics
    // In a real implementation, you'd store this transaction in your database

    return NextResponse.json({ 
      success: true,
      capture,
      message: 'Subscription activated successfully'
    });
  } catch (error) {
    console.error('PayPal order capture error:', error);
    return NextResponse.json({ 
      error: 'Failed to capture order' 
    }, { status: 500 });
  }
}