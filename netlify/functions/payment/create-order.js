// Netlify Function for creating PayPal orders
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
    
    const validatedData = ValidationHelper.validate(ValidationHelper.paypalOrderSchema, body);

    // Validate amount
    const amount = parseFloat(validatedData.amount.value);
    if (!PayPalService.prototype.validateAmount(amount)) {
      return ResponseHelper.validationError('Invalid amount');
    }

    // Get user information
    const user = await DatabaseHelper.findUserByUid(decodedToken.uid);
    if (!user) {
      return ResponseHelper.notFound('User not found');
    }

    // Initialize PayPal service
    const paypalService = new PayPalService();

    // Create PayPal order
    const order = await paypalService.createOrder({
      currency_code: validatedData.currency_code,
      value: validatedData.amount.value,
      description: validatedData.description,
    });

    // Store order information in database
    await DatabaseHelper.createPayment({
      userId: user.id,
      orderId: order.id,
      amount: amount,
      currency: validatedData.currency_code,
      paymentMethod: 'paypal',
      description: validatedData.description,
      status: 'created',
      paypalOrderId: order.id,
      createdAt: new Date().toISOString(),
    });

    return ResponseHelper.success({
      order: {
        id: order.id,
        status: order.status,
        links: order.links,
      },
      message: 'PayPal order created successfully',
    });

  } catch (error) {
    console.error('Create PayPal order error:', error);
    
    if (error.message.includes('Validation error')) {
      return ResponseHelper.validationError(error.message);
    }

    if (error.message.includes('Unauthorized') || error.message.includes('No token provided')) {
      return ResponseHelper.unauthorized(error.message);
    }

    return ResponseHelper.serverError('Failed to create PayPal order');
  }
};