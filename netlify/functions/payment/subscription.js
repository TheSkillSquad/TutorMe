// Netlify Function for PayPal subscription management
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

  try {
    const method = event.httpMethod;
    const decodedToken = await AuthHelper.authenticateRequest(event);

    if (method === 'POST') {
      return await createSubscription(decodedToken.uid, event);
    } else if (method === 'GET') {
      return await getSubscription(decodedToken.uid, event);
    } else if (method === 'DELETE') {
      return await cancelSubscription(decodedToken.uid, event);
    } else if (method === 'PATCH') {
      return await updateSubscription(decodedToken.uid, event);
    } else {
      return ResponseHelper.error('Method not allowed', 405);
    }
  } catch (error) {
    console.error('Subscription error:', error);
    
    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to process subscription request');
  }
};

async function createSubscription(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const validatedData = ValidationHelper.validate(ValidationHelper.subscriptionSchema, body);

    // Get user information
    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Check if user already has an active subscription
    const currentSubscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (currentSubscription && currentSubscription.status === 'active') {
      return ResponseHelper.validationError('User already has an active subscription');
    }

    // Initialize PayPal service
    const paypalService = new PayPalService();

    // Create PayPal subscription
    const subscription = await paypalService.createSubscription({
      plan_id: getPayPalPlanId(validatedData.plan),
    });

    // Create subscription record in database
    await DatabaseHelper.createSubscription({
      userId: user.id,
      paypalSubscriptionId: subscription.id,
      plan: validatedData.plan,
      billingCycle: validatedData.billingCycle,
      status: 'pending',
      paymentMethod: validatedData.paymentMethod,
      createdAt: new Date().toISOString(),
      activatedAt: null,
      cancelledAt: null,
      nextPaymentAt: null,
    });

    return ResponseHelper.success({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        plan: validatedData.plan,
        billingCycle: validatedData.billingCycle,
        approveUrl: subscription.links.find(link => link.rel === 'approve')?.href,
      },
      message: 'Subscription created successfully',
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    return ResponseHelper.serverError('Failed to create subscription');
  }
}

async function getSubscription(uid, event) {
  try {
    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    
    if (!subscription) {
      return ResponseHelper.success({
        subscription: null,
        message: 'No subscription found',
      });
    }

    // Get latest subscription details from PayPal
    const paypalService = new PayPalService();
    let paypalSubscription = null;
    
    try {
      paypalSubscription = await paypalService.getSubscriptionDetails(subscription.paypalSubscriptionId);
    } catch (error) {
      console.error('Failed to get PayPal subscription details:', error);
    }

    return ResponseHelper.success({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        billingCycle: subscription.billingCycle,
        status: subscription.status,
        createdAt: subscription.createdAt,
        activatedAt: subscription.activatedAt,
        cancelledAt: subscription.cancelledAt,
        nextPaymentAt: subscription.nextPaymentAt,
        paypalStatus: paypalSubscription?.status,
        paypalSubscriptionId: subscription.paypalSubscriptionId,
      },
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    return ResponseHelper.serverError('Failed to get subscription');
  }
}

async function cancelSubscription(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { reason } = body;

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription) {
      return ResponseHelper.notFound('No subscription found');
    }

    if (subscription.status !== 'active') {
      return ResponseHelper.validationError('Subscription is not active');
    }

    // Initialize PayPal service
    const paypalService = new PayPalService();

    // Cancel PayPal subscription
    await paypalService.cancelSubscription(subscription.paypalSubscriptionId, reason);

    // Update subscription record
    await DatabaseHelper.updateSubscription(user.id, {
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      message: 'Subscription cancelled successfully',
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return ResponseHelper.serverError('Failed to cancel subscription');
  }
}

async function updateSubscription(uid, event) {
  try {
    const body = JSON.parse(event.body);
    const { action } = body;

    const user = await DatabaseHelper.findUserByUid(uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    const subscription = await DatabaseHelper.findSubscriptionByUserId(user.id);
    if (!subscription) {
      return ResponseHelper.notFound('No subscription found');
    }

    // Initialize PayPal service
    const paypalService = new PayPalService();

    let result;
    switch (action) {
      case 'activate':
        result = await paypalService.activateSubscription(subscription.paypalSubscriptionId);
        await DatabaseHelper.updateSubscription(user.id, {
          status: 'active',
          activatedAt: new Date().toISOString(),
        });
        break;
      
      case 'suspend':
        result = await paypalService.suspendSubscription(subscription.paypalSubscriptionId);
        await DatabaseHelper.updateSubscription(user.id, {
          status: 'suspended',
        });
        break;
      
      default:
        return ResponseHelper.validationError('Invalid action');
    }

    return ResponseHelper.success({
      message: `Subscription ${action}d successfully`,
    });

  } catch (error) {
    console.error('Update subscription error:', error);
    return ResponseHelper.serverError('Failed to update subscription');
  }
}

// Helper function to get PayPal plan ID
function getPayPalPlanId(plan) {
  const planIds = {
    basic: process.env.PAYPAL_BASIC_PLAN_ID || 'P-XXX',
    premium: process.env.PAYPAL_PREMIUM_PLAN_ID || 'P-XXX',
    enterprise: process.env.PAYPAL_ENTERPRISE_PLAN_ID || 'P-XXX',
  };

  return planIds[plan] || planIds.basic;
}