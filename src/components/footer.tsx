'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react';

interface FooterProps {
  session?: any;
}

export default function Footer({ session }: FooterProps) {

  const handlePricingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (session) {
      // For authenticated users, switch to pricing tab
      const pricingTab = document.querySelector('[value="pricing"]') as HTMLElement;
      if (pricingTab) {
        pricingTab.click();
        // Scroll to top of the tabs section
        const tabsContainer = pricingTab.closest('.container') as HTMLElement;
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For unauthenticated users, scroll to pricing section
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If pricing section doesn't exist (user is not on landing page), 
        // navigate to home and scroll to pricing
        window.location.href = '/#pricing';
      }
    }
  };

  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (session) {
      // For authenticated users, switch to how-it-works tab
      const howItWorksTab = document.querySelector('[value="how-it-works"]') as HTMLElement;
      if (howItWorksTab) {
        howItWorksTab.click();
        // Scroll to top of the tabs section
        const tabsContainer = howItWorksTab.closest('.container') as HTMLElement;
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For unauthenticated users, scroll to simulator section (closest to "how it works")
      const simulatorSection = document.getElementById('simulator');
      if (simulatorSection) {
        simulatorSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#simulator';
      }
    }
  };

  const handleBlogClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (session) {
      // For authenticated users, switch to blog tab
      const blogTab = document.querySelector('[value="blog"]') as HTMLElement;
      if (blogTab) {
        blogTab.click();
        // Scroll to top of the tabs section
        const tabsContainer = blogTab.closest('.container') as HTMLElement;
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For unauthenticated users, show a message or navigate to a blog section
      alert('Blog feature is available for registered users. Please sign in to access our blog.');
    }
  };

  const handleCommunityClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (session) {
      // For authenticated users, switch to community tab
      const communityTab = document.querySelector('[value="community"]') as HTMLElement;
      if (communityTab) {
        communityTab.click();
        // Scroll to top of the tabs section
        const tabsContainer = communityTab.closest('.container') as HTMLElement;
        if (tabsContainer) {
          tabsContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // For unauthenticated users, scroll to community section
      const communitySection = document.getElementById('community');
      if (communitySection) {
        communitySection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/#community';
      }
    }
  };

  return (
    <footer className="bg-muted/30 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About TutorMe</h3>
            <p className="text-sm text-muted-foreground">
              TutorMe is a revolutionary skill exchange and microlearning platform where you can trade skills with others and learn from AI-powered 3-minute courses.
            </p>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-sm">Making learning accessible to everyone</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={handleHowItWorksClick} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">How It Works</a></li>
              <li><a href="#" onClick={handlePricingClick} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" onClick={handleBlogClick} className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Report an Issue</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:tutor@theskillsquad.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  tutor@theskillsquad.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <a 
                  href="http://paypal.me/marquesmedical" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  PayPal Payments
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Support Available 24/7</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Global Community</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 TutorMe. All rights reserved. Made with ❤️ for learners worldwide.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                For inquiries: <a href="mailto:tutor@theskillsquad.com" className="hover:text-primary transition-colors">tutor@theskillsquad.com</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}