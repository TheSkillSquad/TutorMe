'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Gift } from 'lucide-react';

export default function PaymentOptions() {
  const paypalLink = "http://paypal.me/marquesmedical";

  const creditPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 50,
      price: 5,
      description: 'Perfect for trying out the platform',
      popular: false
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      credits: 150,
      price: 12,
      description: 'Best value for regular users',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 300,
      price: 20,
      description: 'For power users and tutors',
      popular: false
    }
  ];

  const handlePurchaseCredits = (packageId: string) => {
    // Open PayPal link in a new tab
    window.open(paypalLink, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Purchase Credits</h2>
        <p className="text-muted-foreground">
          Buy credits to unlock premium features and enhance your learning experience
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {creditPackages.map((pkg) => (
          <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>{pkg.name}</span>
              </CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {pkg.credits}
                </div>
                <div className="text-sm text-muted-foreground">Credits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${pkg.price}
                </div>
                <div className="text-sm text-muted-foreground">One-time payment</div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => handlePurchaseCredits(pkg.id)}
                variant={pkg.popular ? "default" : "outline"}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Purchase with PayPal
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5" />
            <span>How to Purchase</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Select your preferred credit package above</li>
            <li>Click "Purchase with PayPal" to open PayPal</li>
            <li>Complete your payment through PayPal</li>
            <li>Credits will be automatically added to your account</li>
          </ol>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              All payments are processed securely through PayPal. 
              For any payment-related issues, contact us at <strong>tutor@theskillsquad.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}