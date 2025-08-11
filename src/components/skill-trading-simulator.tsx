'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Calendar, 
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function SkillTradingSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState('');
  const [selectedWant, setSelectedWant] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [tradeStatus, setTradeStatus] = useState<'pending' | 'accepted' | 'completed'>('pending');

  const skills = [
    'JavaScript', 'Python', 'React', 'Spanish', 'Guitar', 'Photography',
    'Digital Marketing', 'Yoga', 'Mathematics', 'Cooking', 'Graphic Design',
    'Public Speaking', 'Data Analysis', 'Machine Learning', 'Creative Writing'
  ];

  const mockMatches = [
    {
      id: 1,
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "/placeholder.svg",
      rating: 4.9,
      skills: ["JavaScript", "React", "Node.js"],
      location: "San Francisco, CA",
      responseTime: "Usually replies in 2 hours",
      trades: 127,
      successRate: 98,
      matchScore: 95,
      availability: "Weekdays after 6 PM",
      about: "Senior frontend developer with 8+ years experience. Love teaching and helping others grow!"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      username: "@marcusdev", 
      avatar: "/placeholder.svg",
      rating: 4.8,
      skills: ["Python", "Data Science", "Machine Learning"],
      location: "Austin, TX",
      responseTime: "Available now",
      trades: 89,
      successRate: 96,
      matchScore: 88,
      availability: "Flexible schedule",
      about: "Data scientist passionate about making complex concepts simple to understand."
    },
    {
      id: 3,
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      username: "@emmadesigns",
      rating: 4.7,
      skills: ["Graphic Design", "UI/UX", "Adobe Creative Suite"],
      location: "Seattle, WA",
      responseTime: "Usually replies in 1 hour",
      trades: 156,
      successRate: 99,
      matchScore: 82,
      availability: "Weekends and evenings",
      about: "Creative designer with 10+ years experience. Specialized in branding and digital design."
    }
  ];

  const handleFindMatches = () => {
    if (!selectedOffer || !selectedWant) return;
    
    // Simulate finding matches
    setMatches(mockMatches);
    setCurrentStep(1);
  };

  const handleSelectMatch = (match: any) => {
    setSelectedMatch(match);
    setCurrentStep(2);
  };

  const handleSendRequest = () => {
    setTradeStatus('pending');
    // Simulate trade request acceptance
    setTimeout(() => {
      setTradeStatus('accepted');
      setTimeout(() => {
        setTradeStatus('completed');
        setCurrentStep(3);
      }, 2000);
    }, 1500);
  };

  const resetSimulator = () => {
    setCurrentStep(0);
    setSelectedOffer('');
    setSelectedWant('');
    setMatches([]);
    setSelectedMatch(null);
    setTradeStatus('pending');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>What skills do you want to trade?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">I can teach:</label>
                <div className="grid grid-cols-3 gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedOffer(skill)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        selectedOffer === skill
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">I want to learn:</label>
                <div className="grid grid-cols-3 gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedWant(skill)}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        selectedWant === skill
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleFindMatches}
                disabled={!selectedOffer || !selectedWant}
                className="w-full"
                size="lg"
              >
                Find Perfect Matches
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Found {matches.length} Perfect Matches!</h3>
              <p className="text-muted-foreground">Choose who you'd like to trade with</p>
            </div>

            <div className="grid gap-4">
              {matches.map((match) => (
                <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={match.avatar} />
                          <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-lg font-semibold">{match.name}</h4>
                          <p className="text-sm text-muted-foreground">{match.username}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{match.rating}</span>
                            </div>
                            <Badge variant="secondary">{match.matchScore}% match</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{match.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
                          <Clock className="h-4 w-4" />
                          <span>{match.responseTime}</span>
                        </div>
                        <Button onClick={() => handleSelectMatch(match)}>
                          Select
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {match.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{match.about}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{match.trades}</div>
                        <div className="text-sm text-muted-foreground">Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{match.successRate}%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{match.availability}</div>
                        <div className="text-sm text-muted-foreground">Availability</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" onClick={() => setCurrentStep(0)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>
        );

      case 2:
        if (!selectedMatch) return null;
        
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Trade with {selectedMatch.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedMatch.avatar} />
                  <AvatarFallback>{selectedMatch.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedMatch.name}</h3>
                  <p className="text-muted-foreground">{selectedMatch.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{selectedMatch.rating}</span>
                    <span className="text-muted-foreground">({selectedMatch.trades} trades)</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">You Teach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">{selectedOffer}</div>
                      <p className="text-sm text-muted-foreground">Your expertise</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">You Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">{selectedWant}</div>
                      <p className="text-sm text-muted-foreground">From {selectedMatch.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {tradeStatus === 'pending' && (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">Send a trade request to {selectedMatch.name}</p>
                  <Button onClick={handleSendRequest} size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Trade Request
                  </Button>
                </div>
              )}

              {tradeStatus === 'accepted' && (
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Trade Request Accepted!</h3>
                  <p className="text-muted-foreground">{selectedMatch.name} has accepted your trade request.</p>
                </div>
              )}

              {tradeStatus === 'completed' && (
                <div className="text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-600 mb-2">Trade Completed Successfully!</h3>
                  <p className="text-muted-foreground mb-4">
                    Congratulations! You've successfully completed your first skill trade.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-primary">+1</div>
                      <div className="text-sm text-muted-foreground">Trade Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">+25</div>
                      <div className="text-sm text-muted-foreground">Credits Earned</div>
                    </div>
                  </div>
                  <Button onClick={resetSimulator} size="lg">
                    Start Another Trade
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">🎉 Trade Journey Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg mb-6">
                  You've just experienced the complete TutorMe trading process. Here's what you accomplished:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span>Found the perfect skill match</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span>Connected with a qualified teacher</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span>Completed a successful trade</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <span>Earned credits and achievements</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-semibold mb-4">Ready to start your real trading journey?</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">50,000+</div>
                      <div className="text-sm text-muted-foreground">Active learners</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-muted-foreground">Success rate</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button size="lg" className="w-full">
                      Join TutorMe Now - It's Free!
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" className="w-full" onClick={resetSimulator}>
                      Try Simulator Again
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Skill Trading Simulator</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the complete TutorMe trading journey in this interactive demo. 
            Find matches, connect with learners, and complete trades - all in real-time!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {['Select Skills', 'Choose Match', 'Complete Trade', 'Success!'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}