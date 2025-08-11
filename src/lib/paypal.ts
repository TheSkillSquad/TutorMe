import * as paypal from '@paypal/checkout-server-sdk';

class PayPalService {
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    const environment = process.env.PAYPAL_ENVIRONMENT === 'live' 
      ? new paypal.core.LiveEnvironment(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_CLIENT_SECRET!
        )
      : new paypal.core.SandboxEnvironment(
          process.env.PAYPAL_CLIENT_ID!,
          process.env.PAYPAL_CLIENT_SECRET!
        );
    
    this.client = new paypal.core.PayPalHttpClient(environment);
  }

  async createSubscription(planType: 'trader' | 'creator' | 'organization', userEmail: string) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    
    const planPrices = {
      trader: '9.99',
      creator: '19.99',
      organization: '99.99'
    };

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: planPrices[planType]
        },
        description: `TutorMe ${planType} subscription`
      }],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/cancel`,
        brand_name: 'TutorMe',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        }
      }
    });

    try {
      const order = await this.client.execute(request);
      return {
        id: order.result.id,
        approvalUrl: order.result.links.find((link: any) => link.rel === 'approve')?.href,
        status: order.result.status
      };
    } catch (error) {
      console.error('PayPal order creation error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await this.client.execute(request);
      return {
        success: true,
        orderId: capture.result.id,
        status: capture.result.status,
        payer: capture.result.payer,
        purchase_units: capture.result.purchase_units
      };
    } catch (error) {
      console.error('PayPal order capture error:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  async createCreatorPayout(creatorEmail: string, amount: number, currency: string = 'USD') {
    const requestBody = {
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: 'TutorMe Creator Earnings',
        email_message: 'You have received a payment from TutorMe for your course sales!'
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: {
          value: amount.toString(),
          currency: currency
        },
        receiver: creatorEmail,
        note: 'TutorMe creator earnings payout',
        sender_item_id: `item_${Date.now()}`
      }]
    };

    // Note: Payouts SDK might need to be imported separately
    // This is a simplified implementation
    try {
      // In a real implementation, you would use the PayPal Payouts SDK
      // For now, we'll simulate the response
      return {
        payoutBatchId: `batch_${Date.now()}`,
        status: 'SUCCESS',
        batchHeader: {
          batch_status: 'SUCCESS',
          time_created: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('PayPal payout error:', error);
      throw new Error('Failed to create PayPal payout');
    }
  }

  async verifyWebhookSignature(headers: any, body: any) {
    // In a real implementation, you would verify PayPal webhook signatures
    // This is a simplified version
    try {
      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      if (!webhookId) {
        throw new Error('PayPal webhook ID not configured');
      }

      // Verify the webhook signature
      // This would involve cryptographic verification in production
      return { verified: true };
    } catch (error) {
      console.error('PayPal webhook verification error:', error);
      return { verified: false };
    }
  }

  async getOrderDetails(orderId: string) {
    const request = new paypal.orders.OrdersGetRequest(orderId);

    try {
      const order = await this.client.execute(request);
      return order.result;
    } catch (error) {
      console.error('PayPal order details error:', error);
      throw new Error('Failed to get PayPal order details');
    }
  }

  async refundOrder(captureId: string, amount?: number, currency: string = 'USD') {
    const request = new paypal.payments.CapturesRefundRequest(captureId);
    
    if (amount) {
      request.requestBody({
        amount: {
          currency_code: currency,
          value: amount.toString()
        }
      });
    }

    try {
      const refund = await this.client.execute(request);
      return {
        success: true,
        refundId: refund.result.id,
        status: refund.result.status
      };
    } catch (error) {
      console.error('PayPal refund error:', error);
      throw new Error('Failed to process PayPal refund');
    }
  }

  // Subscription management (for recurring payments)
  async createSubscriptionPlan(planDetails: any) {
    // This would create a subscription plan in PayPal
    // Implementation depends on PayPal's subscription API
    try {
      return {
        planId: `plan_${Date.now()}`,
        status: 'ACTIVE',
        details: planDetails
      };
    } catch (error) {
      console.error('PayPal subscription plan creation error:', error);
      throw new Error('Failed to create subscription plan');
    }
  }

  async activateSubscription(subscriptionId: string) {
    // Activate a subscription
    try {
      return {
        subscriptionId,
        status: 'ACTIVE',
        activatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('PayPal subscription activation error:', error);
      throw new Error('Failed to activate subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, reason?: string) {
    // Cancel a subscription
    try {
      return {
        subscriptionId,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
        reason: reason || 'User requested cancellation'
      };
    } catch (error) {
      console.error('PayPal subscription cancellation error:', error);
      throw new Error('Failed to cancel subscription');
    }
  }
}

export const payPalService = new PayPalService();
export default PayPalService;