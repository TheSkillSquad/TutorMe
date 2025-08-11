'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Home, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Users, 
  User, 
  Settings, 
  Target, 
  LogOut, 
  Bell, 
  Award, 
  Coins, 
  CreditCard, 
  Clock,
  TrendingUp,
  Plus,
  MessageSquare,
  Video,
  Trophy,
  Play,
  Star,
  Globe,
  Zap,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  MapPin,
  Gift,
  Crown,
  Building2
} from 'lucide-react';

export default function MainNavigation() {
  const [activeTab, setActiveTab] = useState('home');
  const [liveStats, setLiveStats] = useState({
    activeTrades: 1247,
    skillsAvailable: 523,
    averageSatisfaction: 4.8,
    countriesRepresented: 85
  });

  // Mock data for different sections
  const pricingTiers = [
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

  const blogCategories = [
    {
      name: 'Skill Development',
      articles: [
        '10 Most In-Demand Skills to Trade in 2025',
        'How to Master Any Skill in 30 Days Using Microlearning',
        'The Psychology of Skill Exchange: Why Trading Works Better Than Paying'
      ]
    },
    {
      name: 'Success Stories',
      articles: [
        'From Barista to Developer: Maria\'s 6-Month Journey',
        'How I Learned 5 Languages Through TutorMe Exchanges',
        'Building a Side Business Through Skill Trading'
      ]
    },
    {
      name: 'Platform Updates',
      articles: [
        'Introducing Multi-Party Skill Trades',
        'New AI Features: Voice-to-Course Generation Now Live',
        'Community Spotlight: This Month\'s Top Traders'
      ]
    }
  ];

  const communities = [
    {
      name: 'Tech Skills Hub',
      members: 12450,
      icon: '💻',
      description: 'Programming, web development, data science'
    },
    {
      name: 'Language Learners',
      members: 18200,
      icon: '🌍',
      description: 'Language exchange, cultural learning'
    },
    {
      name: 'Creative Arts Exchange',
      members: 8900,
      icon: '🎨',
      description: 'Design, music, photography, writing'
    },
    {
      name: 'Business & Marketing',
      members: 15600,
      icon: '💼',
      description: 'Entrepreneurship, marketing, finance'
    },
    {
      name: 'Fitness & Wellness',
      members: 6750,
      icon: '💪',
      description: 'Exercise, nutrition, mental health'
    }
  ];

  const activeChallenges = [
    {
      name: '30 Skills in 30 Days Challenge',
      participants: 2341,
      icon: '🎯',
      description: 'Learn a new skill every day this month'
    },
    {
      name: 'Multilingual March',
      participants: 1856,
      icon: '🗣️',
      description: 'Learn 3 languages this month'
    },
    {
      name: 'Code & Cook',
      participants: 967,
      icon: '👨‍🍳',
      description: 'Trade programming for culinary skills'
    }
  ];

  const renderHomeDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Trade skills, learn from AI-powered micro-courses, and join a community of learners and teachers.
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Exchange skills without money - teach what you know, learn what you need
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" variant="secondary" className="text-blue-600">
                Start Trading Skills
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Live Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{liveStats.activeTrades}</div>
              <div className="text-sm text-blue-100">Active Trades This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{liveStats.skillsAvailable}+</div>
              <div className="text-sm text-blue-100">Skills Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{liveStats.averageSatisfaction}/5</div>
              <div className="text-sm text-blue-100">Average Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{liveStats.countriesRepresented}+</div>
              <div className="text-sm text-blue-100">Countries Represented</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Find Skill Matches</span>
            </CardTitle>
            <CardDescription>
              Get matched with perfect skill exchange partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Start Matching
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span>Create AI Course</span>
            </CardTitle>
            <CardDescription>
              Generate a 3-minute micro-course instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Generate Course
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span>Join Community</span>
            </CardTitle>
            <CardDescription>
              Connect with learners worldwide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Explore Groups
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Community Activity</CardTitle>
          <CardDescription>See what's happening in the TutorMe community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">John Doe</span> completed a Python programming course</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Sarah Miller</span> started a skill trade for Spanish conversation</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Mike Johnson</span> earned the "Polyglot" achievement</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHowItWorks = () => (
    <div className="space-y-8">
      {/* Skill Trading Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-500" />
            <span>Skill Trading Process</span>
          </CardTitle>
          <CardDescription>Learn how to exchange skills with our community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: 1, title: 'Create Your Profile', desc: 'Add skills you can teach and want to learn', icon: '👤' },
              { step: 2, title: 'Smart Matching', desc: 'AI finds perfect skill exchange partners', icon: '🤖' },
              { step: 3, title: 'Connect & Schedule', desc: 'Chat and arrange your skill sessions', icon: '💬' },
              { step: 4, title: 'Learn & Teach', desc: 'Exchange knowledge via video calls or in-person', icon: '🎥' },
              { step: 5, title: 'Rate & Repeat', desc: 'Build your reputation and earn skill credits', icon: '⭐' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-semibold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Microlearning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-purple-500" />
            <span>AI Microlearning</span>
          </CardTitle>
          <CardDescription>Get instant courses with our AI-powered system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Voice Your Topic', desc: 'Tell our AI what you want to learn', icon: '🎤' },
              { step: 2, title: 'Instant Course Creation', desc: 'Get a complete 3-minute course with slides', icon: '⚡' },
              { step: 3, title: 'Interactive Practice', desc: 'Use our chatbot for skill reinforcement', icon: '🤖' },
              { step: 4, title: 'Track Progress', desc: 'See your learning journey and achievements', icon: '📊' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 font-semibold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-green-500" />
            <span>Community Features</span>
          </CardTitle>
          <CardDescription>Join our vibrant learning community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Join skill-specific groups and challenges',
              'Share your transformation stories',
              'Participate in global skill competitions',
              'Access exclusive creator tools and analytics'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-8">
      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Additional Services */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Services</CardTitle>
          <CardDescription>Enhance your learning experience with these add-ons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Skill Verification', price: '$4.99', desc: 'per skill' },
              { name: 'Premium Course Creation', price: '$0.99', desc: 'per advanced course' },
              { name: 'Group Workshop Hosting', price: '$7.99', desc: 'per session' },
              { name: 'Express Matching', price: '$2.99', desc: 'for urgent requests' }
            ].map((service, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{service.name}</h4>
                  <span className="text-primary font-bold">{service.price}</span>
                </div>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBlog = () => (
    <div className="space-y-8">
      {/* Featured Article */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <Badge className="w-fit">Featured</Badge>
          <CardTitle className="text-2xl">The Future of Skill Exchange: How AI is Revolutionizing Learning</CardTitle>
          <CardDescription>Discover how artificial intelligence is transforming the way we learn and teach skills in 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>By Dr. Sarah Chen</span>
              <span>•</span>
              <span>5 min read</span>
              <span>•</span>
              <span>2,341 views</span>
            </div>
            <Button>
              Read Article
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blog Categories */}
      <div className="grid md:grid-cols-3 gap-6">
        {blogCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a href="#" className="text-sm hover:text-primary transition-colors">
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="sm" className="mt-4">
                View All {category.name}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: 'Building Confidence Through Skill Sharing',
                excerpt: 'How teaching others can boost your own confidence and mastery',
                author: 'Mike Rodriguez',
                category: 'Learning Science',
                readTime: '4 min'
              },
              {
                title: 'Global Skill Gaps: Where TutorMe Is Making a Difference',
                excerpt: 'Addressing critical skill shortages in emerging markets',
                author: 'Emma Thompson',
                category: 'Industry Insights',
                readTime: '6 min'
              },
              {
                title: 'TutorMe Mobile App 2.0: Enhanced Matching Algorithm',
                excerpt: 'New features and improvements in our latest mobile release',
                author: 'Tech Team',
                category: 'Platform Updates',
                readTime: '3 min'
              }
            ].map((article, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{article.excerpt}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime} read</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Read
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-8">
      {/* Featured Communities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-500" />
            <span>Featured Communities</span>
          </CardTitle>
          <CardDescription>Join vibrant communities of learners and teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communities.map((community, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{community.icon}</div>
                  <div>
                    <h3 className="font-semibold">{community.name}</h3>
                    <p className="text-sm text-muted-foreground">{community.members.toLocaleString()} members</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{community.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Join Community
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>Active Challenges</span>
          </CardTitle>
          <CardDescription>Participate in skill-building challenges with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {activeChallenges.map((challenge, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{challenge.icon}</div>
                  <div>
                    <h3 className="font-semibold">{challenge.name}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.participants.toLocaleString()} participants</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                <Button size="sm" className="w-full">
                  Join Challenge
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-green-500" />
            <span>Upcoming Events</span>
          </CardTitle>
          <CardDescription>Join virtual and in-person meetups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: 'Weekly Skill Swap Meetup - New York',
                date: 'Every Tuesday',
                time: '6:00 PM EST',
                type: 'In-person',
                attendees: 45
              },
              {
                title: 'Virtual Workshop: Advanced JavaScript Patterns',
                date: 'March 15, 2025',
                time: '2:00 PM EST',
                type: 'Virtual',
                attendees: 234
              },
              {
                title: 'Monthly Language Exchange Mixer',
                date: 'March 20, 2025',
                time: '7:00 PM EST',
                type: 'Virtual',
                attendees: 189
              }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">📅</div>
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={event.type === 'Virtual' ? 'default' : 'secondary'}>
                    {event.type}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{event.attendees} attending</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>@johndoe • Member since March 2024</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">Level 12 Trader</Badge>
                <Badge variant="outline">Verified Teacher</Badge>
                <Badge variant="outline">Polyglot</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* My Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>My Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Skills I Teach</h4>
                <div className="space-y-2">
                  {['JavaScript (Expert)', 'React (Advanced)', 'Node.js (Intermediate)', 'English (Native)'].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">{skill}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills I Want to Learn</h4>
                <div className="space-y-2">
                  {['Spanish (Beginner)', 'Photography (Beginner)', 'Public Speaking (Intermediate)'].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm">{skill}</span>
                      <Plus className="h-4 w-4 text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Learning Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Courses Completed</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Skill Trades</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Points</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Completed "Advanced React Hooks" course', time: '2 hours ago', icon: '✅' },
              { action: 'Started skill trade with Maria Garcia', time: '1 day ago', icon: '🤝' },
              { action: 'Joined "Tech Skills Hub" community', time: '2 days ago', icon: '👥' },
              { action: 'Earned "Quick Learner" achievement', time: '3 days ago', icon: '🏆' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-lg">{activity.icon}</div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">TutorMe</h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search skills, courses, or people..." 
                  className="pl-10 w-64"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">1,247 Credits</span>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="how-it-works" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">How It Works</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="home">
              {renderHomeDashboard()}
            </TabsContent>
            
            <TabsContent value="how-it-works">
              {renderHowItWorks()}
            </TabsContent>
            
            <TabsContent value="pricing">
              {renderPricing()}
            </TabsContent>
            
            <TabsContent value="blog">
              {renderBlog()}
            </TabsContent>
            
            <TabsContent value="community">
              {renderCommunity()}
            </TabsContent>
            
            <TabsContent value="profile">
              {renderProfile()}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}