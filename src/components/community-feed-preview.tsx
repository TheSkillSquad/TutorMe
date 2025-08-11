'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Award, 
  Users,
  Calendar,
  MapPin,
  Star,
  Play,
  BookOpen,
  Target,
  Trophy,
  Gift,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function CommunityFeedPreview() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [stories, setStories] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Mock data initialization
    setStories([
      {
        id: 1,
        user: {
          name: "Sarah Chen",
          avatar: "/placeholder.svg",
          location: "San Francisco, CA"
        },
        type: "transformation",
        beforeSkill: "Basic Python knowledge",
        afterSkill: "Full-stack Python developer",
        timeAgo: "2 hours ago",
        likes: 234,
        comments: 45,
        shares: 12,
        story: "Started with basic Python syntax and now I'm building full-stack applications! The skill trading community helped me find amazing mentors who guided me through frameworks like Django and Flask.",
        highlights: ["Learned Django", "Built 5 projects", "Mentored 3 others"],
        duration: "6 months",
        thumbnail: "/placeholder.svg"
      },
      {
        id: 2,
        user: {
          name: "Marcus Rodriguez",
          avatar: "/placeholder.svg", 
          location: "Austin, TX"
        },
        type: "achievement",
        skill: "Guitar Playing",
        achievement: "Performed first live concert",
        timeAgo: "5 hours ago",
        likes: 189,
        comments: 32,
        shares: 8,
        story: "From bedroom practice to stage performance! Thanks to my guitar teacher from TutorMe, I finally performed at a local venue. The confidence I gained is priceless!",
        highlights: ["Learned 50+ songs", "Music theory mastered", "First live gig"],
        duration: "4 months",
        thumbnail: "/placeholder.svg"
      },
      {
        id: 3,
        user: {
          name: "Emma Thompson",
          avatar: "/placeholder.svg",
          location: "Seattle, WA"
        },
        type: "milestone",
        skill: "Digital Photography",
        milestone: "100th photoshoot completed",
        timeAgo: "1 day ago",
        likes: 456,
        comments: 67,
        shares: 23,
        story: "Just completed my 100th professional photoshoot! Started as a hobbyist and now running a successful photography business. The AI courses on TutorMe helped me master editing techniques.",
        highlights: ["Started business", "10+ clients", "Featured in local gallery"],
        duration: "8 months",
        thumbnail: "/placeholder.svg"
      }
    ]);

    setChallenges([
      {
        id: 1,
        title: "30-Day Language Challenge",
        description: "Learn a new language for 15 minutes daily",
        participants: 1247,
        daysLeft: 12,
        prize: "Premium course access + 500 credits",
        difficulty: "Medium",
        category: "Languages",
        progress: 73
      },
      {
        id: 2,
        title: "Code Every Day",
        description: "Write code every day for a month",
        participants: 892,
        daysLeft: 8,
        prize: "GitHub Pro + mentorship session",
        difficulty: "Hard",
        category: "Programming",
        progress: 85
      },
      {
        id: 3,
        title: "Creative Art Marathon",
        description: "Create one piece of art daily for 30 days",
        participants: 654,
        daysLeft: 15,
        prize: "Art supplies bundle + featured gallery",
        difficulty: "Easy",
        category: "Creative Arts",
        progress: 56
      }
    ]);

    setLeaderboard([
      {
        rank: 1,
        name: "Alex Kumar",
        avatar: "/placeholder.svg",
        points: 2847,
        trades: 156,
        courses: 23,
        streak: 45
      },
      {
        rank: 2,
        name: "Maria Santos",
        avatar: "/placeholder.svg",
        points: 2634,
        trades: 142,
        courses: 19,
        streak: 38
      },
      {
        rank: 3,
        name: "David Chen",
        avatar: "/placeholder.svg",
        points: 2412,
        trades: 128,
        courses: 31,
        streak: 29
      },
      {
        rank: 4,
        name: "Lisa Wang",
        avatar: "/placeholder.svg",
        points: 2298,
        trades: 134,
        courses: 17,
        streak: 22
      },
      {
        rank: 5,
        name: "James Wilson",
        avatar: "/placeholder.svg",
        points: 2156,
        trades: 119,
        courses: 25,
        streak: 19
      }
    ]);
  }, []);

  const filters = [
    { id: 'all', label: 'All Stories', count: stories.length },
    { id: 'languages', label: 'Language Learning', count: 1 },
    { id: 'tech', label: 'Tech Skills', count: 1 },
    { id: 'creative', label: 'Creative Arts', count: 1 },
    { id: 'business', label: 'Business', count: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-green-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Community Success Stories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners transforming their skills and achieving their goals through the TutorMe community
          </p>
        </div>

        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="stories">Success Stories</TabsTrigger>
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter.label}
                  {filter.count > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filter.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Stories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={story.user.avatar} />
                          <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{story.user.name}</h4>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{story.user.location}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        story.type === 'transformation' ? 'default' :
                        story.type === 'achievement' ? 'secondary' : 'outline'
                      }>
                        {story.type === 'transformation' ? 'Transformation' :
                         story.type === 'achievement' ? 'Achievement' : 'Milestone'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-white/50" />
                    </div>

                    <div>
                      <h5 className="font-semibold mb-2">
                        {story.beforeSkill} → {story.afterSkill}
                      </h5>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {story.story}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {story.highlights.map((highlight: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{story.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{story.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                          <Heart className="h-4 w-4" />
                          <span>{story.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                          <span>{story.comments}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                          <Share2 className="h-4 w-4" />
                          <span>{story.shares}</span>
                        </button>
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">Share Your Success Story</h3>
                <p className="text-muted-foreground mb-6">
                  Inspire others by sharing your learning journey. Every story matters and helps build our amazing community!
                </p>
                <Button size="lg">
                  <Star className="h-4 w-4 mr-2" />
                  Share Your Story
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{challenge.category}</Badge>
                      <Badge variant={
                        challenge.difficulty === 'Easy' ? 'secondary' :
                        challenge.difficulty === 'Medium' ? 'default' : 'destructive'
                      }>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {challenge.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Gift className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-sm">Prize:</span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          {challenge.prize}
                        </p>
                      </div>
                    </div>

                    <Button className="w-full">
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Create Your Own Challenge</h3>
                <p className="text-muted-foreground mb-4">
                  Start a community challenge and motivate others to learn together. Set goals, track progress, and celebrate achievements!
                </p>
                <Button variant="outline" size="lg">
                  <Target className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Top Learners This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div key={user.rank} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-sm">
                          {user.rank}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Target className="h-3 w-3" />
                              <span>{user.trades} trades</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{user.courses} courses</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="h-3 w-3" />
                              <span>{user.streak} day streak</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{user.points.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">15,234</div>
                  <div className="text-sm text-muted-foreground">Active Learners</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">89%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8/5</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}