'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Play, Users, TrendingUp, Star, MessageSquare, BookOpen, Target, Mic } from 'lucide-react';

export default function InteractiveHero() {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [tradesCount, setTradesCount] = useState(1247);
  const [activeUsers, setActiveUsers] = useState(50234);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  const phrases = [
    "Trade Python for Spanish",
    "Exchange Design for Guitar", 
    "Swap Marketing for Cooking",
    "Learn Photography in Exchange for Math",
    "Teach Coding, Get Music Lessons"
  ];

  const popularSkills = [
    "JavaScript", "Spanish", "Graphic Design", "Guitar", "Photography",
    "Digital Marketing", "Yoga", "Mathematics", "Cooking", "Public Speaking"
  ];

  // Typing effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentPhrase.length) {
        setTypedText(currentPhrase.substring(0, charIndex));
        charIndex++;
      } else {
        setTimeout(() => {
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypedText('');
        }, 2000);
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentPhraseIndex]);

  // Live counters
  useEffect(() => {
    const tradesInterval = setInterval(() => {
      setTradesCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    const usersInterval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);

    return () => {
      clearInterval(tradesInterval);
      clearInterval(usersInterval);
    };
  }, []);

  const handleFindMatches = () => {
    if (!selectedSkill || !wantedSkill) return;
    
    setIsMatching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockMatches = [
        {
          id: 1,
          name: "Sarah Chen",
          avatar: "/placeholder.svg",
          rating: 4.9,
          skills: [selectedSkill],
          location: "San Francisco, CA",
          responseTime: "Usually replies in 2 hours",
          trades: 127,
          matchScore: 95
        },
        {
          id: 2,
          name: "Marcus Rodriguez",
          avatar: "/placeholder.svg", 
          rating: 4.8,
          skills: [selectedSkill],
          location: "Austin, TX",
          responseTime: "Available now",
          trades: 89,
          matchScore: 88
        },
        {
          id: 3,
          name: "Emma Thompson",
          avatar: "/placeholder.svg",
          rating: 4.7,
          skills: [selectedSkill],
          location: "Seattle, WA",
          responseTime: "Usually replies in 1 hour",
          trades: 156,
          matchScore: 82
        }
      ];
      
      setMatches(mockMatches);
      setIsMatching(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          {/* Logo and Branding */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <img 
                src="/tutorme-logo.png" 
                alt="TutorMe Logo" 
                className="w-16 h-16 object-contain"
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TutorMe
            </h1>
          </div>

          {/* Main Heading with Typing Effect */}
          <div className="mb-6">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Trade Skills, Not Money
            </h2>
            <div className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 font-semibold h-12">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>
          </div>

          {/* Live Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-lg font-semibold">{activeUsers.toLocaleString()}+ active learners</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-semibold">{tradesCount.toLocaleString()} skills traded this week</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-semibold">98% match satisfaction</span>
            </div>
          </div>

          {/* Interactive Skill Matching Preview */}
          <Card className="max-w-4xl mx-auto mb-8 shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Find Your Perfect Skill Match</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">I can teach:</label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">I want to learn:</label>
                  <Select value={wantedSkill} onValueChange={setWantedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select desired skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleFindMatches}
                    disabled={!selectedSkill || !wantedSkill || isMatching}
                    className="w-full"
                  >
                    {isMatching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Finding Matches...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Find Matches
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Match Results */}
              {matches.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Found {matches.length} perfect matches!</h4>
                  {matches.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {match.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{match.name}</div>
                          <div className="text-sm text-muted-foreground">{match.location} • {match.responseTime}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{match.rating}</span>
                        </div>
                        <Badge variant="secondary">{match.matchScore}% match</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Trading Skills
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              <Play className="h-5 w-5 mr-2" />
              Try AI Course Generator
            </Button>
          </div>

          {/* Social Proof - Floating Testimonials */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Alex Kumar",
                role: "Web Developer",
                text: "Traded React mentoring for Spanish lessons. Best learning experience ever!",
                avatar: "/placeholder.svg"
              },
              {
                name: "Maria Santos", 
                role: "Graphic Designer",
                text: "Found amazing guitar students while learning photography. Win-win!",
                avatar: "/placeholder.svg"
              },
              {
                name: "David Chen",
                role: "Marketing Manager", 
                text: "The AI course generator helped me create content in minutes. Incredible!",
                avatar: "/placeholder.svg"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="transform hover:scale-105 transition-all duration-300 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <MessageSquare className="h-4 w-4 text-blue-500 mb-2" />
                  <p className="text-sm italic">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity Feed */}
          <Card className="max-w-2xl mx-auto mt-8">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Live Activity
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span>Sarah just traded web design for French lessons</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>Marcus completed Python mentoring session</span>
                  <span className="text-muted-foreground">5 min ago</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <span>Emma generated AI course on Digital Photography</span>
                  <span className="text-muted-foreground">8 min ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}