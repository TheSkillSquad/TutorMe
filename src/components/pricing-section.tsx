'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Crown, 
  Building2, 
  CheckCircle, 
  ArrowRight,
  Zap
} from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  savings?: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: '$0',
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      '2 skill trades per month',
      'Basic AI course generation (5/month)',
      'Standard matching algorithm',
      'Community access',
      'Mobile app access'
    ],
    popular: false,
    cta: 'Get Started Free'
  },
  {
    id: 'trader',
    name: 'Trader',
    price: '$9.99',
    period: 'month',
    yearlyPrice: '$99',
    description: 'Most popular for active traders',
    features: [
      'Unlimited skill trades',
      'Unlimited AI course generation',
      'Priority matching algorithm',
      'Group skill swaps (up to 5 people)',
      'Advanced analytics dashboard',
      'Skill verification badges'
    ],
    popular: true,
    cta: 'Start Trading',
    savings: 'Save 2 months'
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$19.99',
    period: 'month',
    yearlyPrice: '$199',
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
    popular: false,
    cta: 'Start Creating',
    savings: 'Save 2 months'
  },
  {
    id: 'enterprise',
    name: 'Organization',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations',
    features: [
      'Custom team skill exchange programs',
      'Advanced admin dashboard',
      'Bulk user management',
      'Custom integrations (Slack, Teams)',
      'Dedicated account manager',
      'Custom branding options'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
];

export default function PricingSection() {
  return (
    <div className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Learning Journey</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your skill trading and AI learning needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  {tier.id === 'enterprise' ? <Building2 className="h-5 w-5" /> : tier.id === 'creator' ? <Crown className="h-5 w-5" /> : <Star className="h-5 w-5" />}
                  <span>{tier.name}</span>
                </CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {tier.price}
                    <span className="text-sm font-normal text-muted-foreground">/{tier.period}</span>
                  </div>
                  {tier.yearlyPrice && (
                    <div className="text-sm text-green-600">
                      {tier.yearlyPrice}/year • {tier.savings}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Compare All Features</span>
            </CardTitle>
            <CardDescription>
              See exactly what's included in each plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Explorer</th>
                    <th className="text-center py-3 px-4">Trader</th>
                    <th className="text-center py-3 px-4">Creator</th>
                    <th className="text-center py-3 px-4">Organization</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-3 px-4">Skill Trades</td>
                    <td className="text-center py-3 px-4">2/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">AI Course Generation</td>
                    <td className="text-center py-3 px-4">5/month</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Priority Matching</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Group Skill Swaps</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">Up to 5</td>
                    <td className="text-center py-3 px-4">Up to 10</td>
                    <td className="text-center py-3 px-4">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Creator Revenue</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">70% share</td>
                    <td className="text-center py-3 px-4">80% share</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Team Management</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                <p className="text-sm text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
                <p className="text-sm text-muted-foreground">We offer a 30-day money-back guarantee for all paid plans. No questions asked.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">The Explorer plan is always free. You can try paid features with our 14-day trial.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enterprise Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Custom Integrations</h4>
                <p className="text-sm text-muted-foreground">Connect with your existing tools like Slack, Microsoft Teams, and custom APIs.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dedicated Support</h4>
                <p className="text-sm text-muted-foreground">Get priority support with a dedicated account manager and 24/7 phone support.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Custom Branding</h4>
                <p className="text-sm text-muted-foreground">White-label options with your company branding and custom domain.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}