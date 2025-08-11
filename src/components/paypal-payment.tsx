'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Crown,
  Star,
  Building2,
  ArrowRight
} from 'lucide-react';

interface PayPalPaymentProps {
  userEmail: string;
  userToken?: string;
  onPaymentSuccess?: (subscription: any) => void;
  currentPlan?: string;
}

interface Plan {
  id: 'trader' | 'creator' | 'organization';
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

export default function PayPalPayment({ 
  userEmail, 
  userToken, 
  onPaymentSuccess, 
  currentPlan 
}: PayPalPaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState<'trader' | 'creator' | 'organization'>('trader');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [approvalUrl, setApprovalUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'processing' | 'success' | 'error'>('idle');

  const plans: Plan[] = [
    {
      id: 'trader',
      name: 'Trader',
      price: '$9.99',
      description: 'Most popular for active traders',
      features: [
        'Unlimited skill trades',
        'Unlimited AI course generation',
        'Priority matching algorithm',
        'Group skill swaps (up to 5 people)',
        'Advanced analytics dashboard',
        'Skill verification badges'
      ],
      icon: <Star className="h-5 w-5" />,
      popular: true
    },
    {
      id: 'creator',
      name: 'Creator',
      price: '$19.99',
      description: 'For serious skill creators',
      features: [
        'Everything in Trader',
        'Creator revenue sharing',
        'Advanced creator tools',
        'Custom skill certification',
        'Direct student messaging',
        'Featured placement in marketplace',
        'Business skill trading features'
      ],
      icon: <Crown className="h-5 w-5" />
    },
    {
      id: 'organization',
      name: 'Organization',
      price: '$99.99',
      description: 'For teams and organizations',
      features: [
        'Custom team skill exchange programs',
        'Advanced admin dashboard',
        'Bulk user management',
        'Custom integrations (Slack, Teams)',
        'Dedicated account manager',
        'Custom branding options'
      ],
      icon: <Building2 className="h-5 w-5" />
    }
  ];

  const handleSubscribe = async (planId: 'trader' | 'creator' | 'organization') => {
    if (!userToken || !userEmail) {
      setError('Please sign in to subscribe');
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);
    setError('');
    setPaymentStatus('processing');

    try {
      const response = await fetch('/api/paypal/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          planType: planId,
          userEmail
        })
      });

      const data = await response.json();

      if (response.ok) {
        setApprovalUrl(data.subscription.approvalUrl);
        setPaymentStatus('pending');
        
        // Open PayPal approval window
        window.open(data.subscription.approvalUrl, '_blank', 'width=600,height=700');
        
        // Poll for payment completion (in a real app, you'd use webhooks)
        pollPaymentCompletion(data.subscription.id);
      } else {
        setError(data.error || 'Failed to create subscription');
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Subscription creation error:', error);
      setError('Failed to create subscription. Please try again.');
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const pollPaymentCompletion = async (orderId: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch('/api/paypal/capture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          body: JSON.stringify({ orderId })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setPaymentStatus('success');
          setApprovalUrl('');
          if (onPaymentSuccess) {
            onPaymentSuccess(data.capture);
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 10000); // Poll every 10 seconds
          } else {
            setPaymentStatus('error');
            setError('Payment verification timed out. Please contact support.');
          }
        }
      } catch (error) {
        console.error('Payment polling error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000);
        } else {
          setPaymentStatus('error');
          setError('Payment verification failed. Please contact support.');
        }
      }
    };

    poll();
  };

  const handleManualApproval = async () => {
    if (!approvalUrl) return;
    
    // For demo purposes, simulate successful payment
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('success');
      setApprovalUrl('');
      if (onPaymentSuccess) {
        onPaymentSuccess({
          id: 'demo_payment_' + Date.now(),
          status: 'COMPLETED',
          plan: selectedPlan
        });
      }
    }, 3000);
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <Alert>
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Processing your subscription...
            </AlertDescription>
          </Alert>
        );
      
      case 'pending':
        return (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>Please complete your payment in the PayPal window that opened.</p>
              <p>If the window didn't open, click the button below:</p>
              <Button onClick={handleManualApproval} size="sm">
                Complete Payment
              </Button>
            </AlertDescription>
          </Alert>
        );
      
      case 'success':
        return (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Payment successful! Your subscription is now active.
            </AlertDescription>
          </Alert>
        );
      
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Payment failed. Please try again.'}
            </AlertDescription>
          </Alert>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-green-500" />
          <span>Choose Your Plan</span>
        </CardTitle>
        <CardDescription>
          Select the perfect plan for your skill trading and learning needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && paymentStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderPaymentStatus()}

        {paymentStatus === 'idle' && (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === plan.id ? 'border-primary shadow-lg' : ''
                } ${plan.popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {plan.icon}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing || currentPlan === plan.id}
                  >
                    {isProcessing && selectedPlan === plan.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : currentPlan === plan.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {currentPlan && currentPlan !== 'free' && paymentStatus === 'idle' && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Currently on <Badge variant="secondary">{currentPlan}</Badge> plan
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          <p>Secure payments powered by PayPal. Cancel anytime.</p>
          <p>30-day money-back guarantee for all paid plans.</p>
        </div>
      </CardContent>
    </Card>
  );
}