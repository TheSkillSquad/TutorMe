'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveHero from './interactive-hero';
import SkillTradingSimulator from './skill-trading-simulator';
import AICourseGeneratorDemo from './ai-course-generator-demo';
import CommunityFeedPreview from './community-feed-preview';
import ROICalculator from './roi-calculator';
import PricingSection from './pricing-section';
import { 
  ArrowRight, 
  Play, 
  Users, 
  TrendingUp, 
  Star, 
  BookOpen, 
  Target,
  Sparkles,
  Award,
  MessageSquare,
  Gift,
  ArrowDown,
  ChevronDown,
  DollarSign
} from 'lucide-react';

export default function InteractiveLanding() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showStickyNav, setShowStickyNav] = useState(false);
  const sectionRefs = useRef<{[key: string]: HTMLElement | null}>({});

  const sections = [
    { id: 'hero', name: 'Home', icon: BookOpen },
    { id: 'simulator', name: 'Skill Trading', icon: Target },
    { id: 'ai-demo', name: 'AI Courses', icon: Sparkles },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'calculator', name: 'Value Calculator', icon: TrendingUp }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowStickyNav(scrollPosition > 300);

      // Update active section based on scroll position
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return <InteractiveHero />;
      case 'simulator':
        return <SkillTradingSimulator />;
      case 'ai-demo':
        return <AICourseGeneratorDemo />;
      case 'community':
        return <CommunityFeedPreview />;
      case 'pricing':
        return <PricingSection />;
      case 'calculator':
        return <ROICalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation */}
      {showStickyNav && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <img 
                  src="/tutorme-logo.png" 
                  alt="TutorMe Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold">TutorMe</span>
              </div>
              
              <nav className="hidden md:flex items-center space-x-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <section.icon className="h-4 w-4" />
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm">
                  Get Started Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        {sections.map((section) => (
          <section
            key={section.id}
            ref={(el) => {
  sectionRefs.current[section.id] = el;
}}
            id={section.id}
            className="scroll-mt-16"
          >
            {renderSection(section.id)}
          </section>
        ))}
      </div>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of learners already trading skills, creating AI courses, and achieving their goals with TutorMe.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50,000+</div>
              <div className="text-blue-100">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Trading Skills - It's Free!
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>24/7 community support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Free forever for basic features</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Indicator */}
      {activeSection === 'hero' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToSection('simulator')}
            className="rounded-full"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}