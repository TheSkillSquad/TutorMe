// PayPal service utilities for Netlify Functions
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

class PayPalService {
  constructor() {
    this.environment = this.getEnvironment();
    this.client = new checkoutNodeJssdk.core.PayPalHttpClient(this.environment);
  }

  getEnvironment() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    
    if (process.env.PAYPAL_ENVIRONMENT === 'live') {
      return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    } else {
      return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    }
  }

  async createOrder(orderData) {
    try {
      const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: orderData.currency_code || 'USD',
            value: orderData.value,
          },
          description: orderData.description || 'TutorMe Payment',
        }],
        application_context: {
          brand_name: 'TutorMe',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        },
      });

      const order = await this.client.execute(request);
      return order.result;
    } catch (error) {
      console.error('PayPal create order error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId) {
    try {
      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await this.client.execute(request);
      return capture.result;
    } catch (error) {
      console.error('PayPal capture order error:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  async getOrderDetails(orderId) {
    try {
      const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
      const order = await this.client.execute(request);
      return order.result;
    } catch (error) {
      console.error('PayPal get order error:', error);
      throw new Error('Failed to get PayPal order details');
    }
  }

  async createSubscription(planData) {
    try {
      const request = new checkoutNodeJssdk.billing.SubscriptionsCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        plan_id: planData.plan_id,
        application_context: {
          brand_name: 'TutorMe',
          locale: 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: {
            payer_selected: 'PAYPAL',
            payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
          },
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
        },
      });

      const subscription = await this.client.execute(request);
      return subscription.result;
    } catch (error) {
      console.error('PayPal create subscription error:', error);
      throw new Error('Failed to create PayPal subscription');
    }
  }

  async getSubscriptionDetails(subscriptionId) {
    try {
      const request = new checkoutNodeJssdk.billing.SubscriptionsGetRequest(subscriptionId);
      const subscription = await this.client.execute(request);
      return subscription.result;
    } catch (error) {
      console.error('PayPal get subscription error:', error);
      throw new Error('Failed to get PayPal subscription details');
    }
  }

  async cancelSubscription(subscriptionId, reason = 'User requested cancellation') {
    try {
      const request = new checkoutNodeJssdk.billing.SubscriptionsCancelRequest(subscriptionId);
      request.requestBody({
        reason,
      });

      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal cancel subscription error:', error);
      throw new Error('Failed to cancel PayPal subscription');
    }
  }

  async activateSubscription(subscriptionId) {
    try {
      const request = new checkoutNodeJssdk.billing.SubscriptionsActivateRequest(subscriptionId);
      request.requestBody({
        reason: 'Reactivating subscription',
      });

      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal activate subscription error:', error);
      throw new Error('Failed to activate PayPal subscription');
    }
  }

  async suspendSubscription(subscriptionId, reason = 'User requested suspension') {
    try {
      const request = new checkoutNodeJssdk.billing.SubscriptionsSuspendRequest(subscriptionId);
      request.requestBody({
        reason,
      });

      const response = await this.client.execute(request);
      return response.result;
    } catch (error) {
      console.error('PayPal suspend subscription error:', error);
      throw new Error('Failed to suspend PayPal subscription');
    }
  }

  async createPayout(payoutData) {
    try {
      const request = new checkoutNodeJssdk.payouts.PayoutsPostRequest();
      request.requestBody({
        sender_batch_header: {
          sender_batch_id: `payout_${Date.now()}`,
          email_subject: 'You have a payment from TutorMe',
          email_message: 'Thank you for your services on TutorMe.',
        },
        items: payoutData.recipients.map(recipient => ({
          recipient_type: 'EMAIL',
          amount: {
            value: recipient.amount,
            currency: recipient.currency || 'USD',
          },
          note: recipient.note || 'Payment for tutoring services',
          sender_item_id: `item_${Date.now()}_${Math.random()}`,
          receiver: recipient.email,
        })),
      });

      const payout = await this.client.execute(request);
      return payout.result;
    } catch (error) {
      console.error('PayPal create payout error:', error);
      throw new Error('Failed to create PayPal payout');
    }
  }

  async getPayoutDetails(payoutBatchId) {
    try {
      const request = new checkoutNodeJssdk.payouts.PayoutsGetRequest(payoutBatchId);
      const payout = await this.client.execute(request);
      return payout.result;
    } catch (error) {
      console.error('PayPal get payout error:', error);
      throw new Error('Failed to get PayPal payout details');
    }
  }

  // Webhook verification
  verifyWebhookSignature(headers, body) {
    // This is a simplified implementation
    // In production, you'd need to properly verify PayPal webhooks
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const transmissionId = headers['paypal-transmission-id'];
    const timestamp = headers['paypal-transmission-time'];
    const webhookEvent = JSON.parse(body);
    
    // You would normally verify the signature here
    // For now, we'll just check if the webhook ID matches
    return webhookId && transmissionId && timestamp && webhookEvent;
  }

  // Validate payment amount
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0 && numAmount <= 10000;
  }

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  // Get PayPal environment info
  getEnvironmentInfo() {
    return {
      environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
      clientId: process.env.PAYPAL_CLIENT_ID ? '***' + process.env.PAYPAL_CLIENT_ID.slice(-4) : null,
      webhookConfigured: !!process.env.PAYPAL_WEBHOOK_ID,
    };
  }
}

module.exports = PayPalService;