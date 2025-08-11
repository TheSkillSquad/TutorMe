// Netlify Function for capturing PayPal orders
const AuthHelper = require('../utils/auth');
const ResponseHelper = require('../utils/response');
const DatabaseHelper = require('../utils/database');
const ValidationHelper = require('../utils/validation');
const PayPalService = require('./paypal-service');

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return ResponseHelper.success({}, 200);
  }

  if (event.httpMethod !== 'POST') {
    return ResponseHelper.error('Method not allowed', 405);
  }

  try {
    const decodedToken = await AuthHelper.authenticateRequest(event);
    const body = JSON.parse(event.body);
    
    const { orderId } = body;

    if (!orderId) {
      return ResponseHelper.validationError('Order ID is required');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Initialize PayPal service
    const paypalService = new PayPalService();

    // Capture PayPal order
    const capture = await paypalService.captureOrder(orderId);

    // Update payment record in database
    await DatabaseHelper.updatePayment(orderId, {
      status: 'completed',
      capturedAt: new Date().toISOString(),
      paypalCaptureId: capture.purchase_units[0].payments.captures[0].id,
      paypalPayerId: capture.payer.payer_id,
      paypalEmail: capture.payer.email_address,
    });

    // Update user subscription if this is a subscription payment
    if (body.isSubscription) {
      await DatabaseHelper.updateSubscription(user.id, {
        status: 'active',
        plan: body.plan || 'premium',
        activatedAt: new Date().toISOString(),
        paypalOrderId: orderId,
        lastPaymentAt: new Date().toISOString(),
        nextPaymentAt: calculateNextPaymentDate(body.billingCycle || 'monthly'),
      });
    }

    return ResponseHelper.success({
      capture: {
        id: capture.purchase_units[0].payments.captures[0].id,
        status: capture.purchase_units[0].payments.captures[0].status,
        amount: capture.purchase_units[0].payments.captures[0].amount,
        create_time: capture.purchase_units[0].payments.captures[0].create_time,
        update_time: capture.purchase_units[0].payments.captures[0].update_time,
      },
      message: 'Payment captured successfully',
    });

  } catch (error) {
    console.error('Capture PayPal order error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to capture PayPal order');
  }
};

// Helper function to calculate next payment date
function calculateNextPaymentDate(billingCycle) {
  const now = new Date();
  const nextDate = new Date(now);

  switch (billingCycle) {
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return nextDate.toISOString();
}