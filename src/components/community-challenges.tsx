'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Target, 
  Trophy, 
  Clock, 
  Share2, 
  Gift,
  Zap,
  Star,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle,
  Flame,
  Rocket,
  Heart,
  MessageCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'skill_swap' | 'course_creation' | 'learning_streak' | 'community_growth' | 'viral_share';
  requirements: {
    type: string;
    target: number;
    unit: string;
  };
  reward: {
    points: number;
    badge?: string;
    exclusive?: boolean;
  };
  startDate: string;
  endDate: string;
  isActive: boolean;
  participantCount: number;
  userProgress?: {
    progress: number;
    completed: boolean;
    joinedAt: string;
  };
}

interface CommunityPost {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  type: 'achievement' | 'challenge_join' | 'course_complete' | 'trade_complete';
  challenge?: Challenge;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

export default function CommunityChallenges() {
  const { data: session } = useSession();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('challenges');

  // Mock challenges data
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Skill Swap Marathon',
      description: 'Complete 5 skill trades with different community members',
      type: 'skill_swap',
      requirements: {
        type: 'trades_completed',
        target: 5,
        unit: 'trades'
      },
      reward: {
        points: 100,
        badge: 'Trade Master',
        exclusive: true
      },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isActive: true,
      participantCount: 234,
      userProgress: {
        progress: 2,
        completed: false,
        joinedAt: '2024-01-15'
      }
    },
    {
      id: '2',
      title: 'Course Creation Sprint',
      description: 'Create and publish 3 micro-courses this month',
      type: 'course_creation',
      requirements: {
        type: 'courses_created',
        target: 3,
        unit: 'courses'
      },
      reward: {
        points: 150,
        badge: 'Prolific Creator'
      },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isActive: true,
      participantCount: 89,
      userProgress: {
        progress: 1,
        completed: false,
        joinedAt: '2024-01-10'
      }
    },
    {
      id: '3',
      title: '7-Day Learning Streak',
      description: 'Maintain a 7-day consecutive learning streak',
      type: 'learning_streak',
      requirements: {
        type: 'consecutive_days',
        target: 7,
        unit: 'days'
      },
      reward: {
        points: 75,
        badge: 'Dedicated Learner'
      },
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isActive: true,
      participantCount: 456,
      userProgress: {
        progress: 3,
        completed: false,
        joinedAt: '2024-01-12'
      }
    },
    {
      id: '4',
      title: 'Community Growth Challenge',
      description: 'Invite 5 friends to join TutorMe',
      type: 'community_growth',
      requirements: {
        type: 'invites_sent',
        target: 5,
        unit: 'friends'
      },
      reward: {
        points: 200,
        badge: 'Community Ambassador',
        exclusive: true
      },
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      isActive: true,
      participantCount: 167,
      userProgress: {
        progress: 1,
        completed: false,
        joinedAt: '2024-01-14'
      }
    },
    {
      id: '5',
      title: 'Viral Share Champion',
      description: 'Share your courses and get 1000 total views',
      type: 'viral_share',
      requirements: {
        type: 'share_views',
        target: 1000,
        unit: 'views'
      },
      reward: {
        points: 300,
        badge: 'Viral Creator',
        exclusive: true
      },
      startDate: '2024-01-01',
      endDate: '2024-02-28',
      isActive: true,
      participantCount: 203,
      userProgress: {
        progress: 250,
        completed: false,
        joinedAt: '2024-01-13'
      }
    }
  ];

  // Mock community posts
  const mockPosts: CommunityPost[] = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'Alex Chen',
        username: 'alexchen',
        avatar: '/placeholder.svg'
      },
      content: 'Just completed the Skill Swap Marathon challenge! 🎉 Learned so much from trading with 5 different community members. Highly recommend everyone to join!',
      type: 'achievement',
      challenge: mockChallenges[0],
      timestamp: '2024-01-20T14:30:00Z',
      likes: 45,
      comments: 12,
      shares: 8,
      isLiked: false
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Maria Garcia',
        username: 'mariagarcia',
        avatar: '/placeholder.svg'
      },
      content: 'Just joined the Course Creation Sprint! Who else is participating? Let\'s motivate each other to create amazing content 🚀',
      type: 'challenge_join',
      challenge: mockChallenges[1],
      timestamp: '2024-01-20T12:15:00Z',
      likes: 23,
      comments: 8,
      shares: 3,
      isLiked: true
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'John Smith',
        username: 'johnsmith',
        avatar: '/placeholder.svg'
      },
      content: 'Day 5 of my 7-day learning streak! The consistency is really paying off. Thanks TutorMe for keeping me motivated 💪',
      type: 'achievement',
      challenge: mockChallenges[2],
      timestamp: '2024-01-20T10:45:00Z',
      likes: 67,
      comments: 15,
      shares: 12,
      isLiked: false
    },
    {
      id: '4',
      user: {
        id: 'user4',
        name: 'Sarah Wilson',
        username: 'sarahwilson',
        avatar: '/placeholder.svg'
      },
      content: 'Just completed my first Python course thanks to an amazing trade with @pythonmaster. The skill exchange system really works! 🐍✨',
      type: 'course_complete',
      timestamp: '2024-01-20T09:30:00Z',
      likes: 89,
      comments: 22,
      shares: 15,
      isLiked: true
    },
    {
      id: '5',
      user: {
        id: 'user5',
        name: 'David Lee',
        username: 'davidlee',
        avatar: '/placeholder.svg'
      },
      content: 'The Community Growth Challenge is amazing! Already invited 3 friends and they\'re loving the platform. Let\'s grow this community together! 🌱',
      type: 'challenge_join',
      challenge: mockChallenges[3],
      timestamp: '2024-01-20T08:20:00Z',
      likes: 34,
      comments: 11,
      shares: 6,
      isLiked: false
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setChallenges(mockChallenges);
      setPosts(mockPosts);
      setLoading(false);
    };

    loadData();
  }, []);

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId
          ? {
              ...challenge,
              userProgress: {
                progress: 0,
                completed: false,
                joinedAt: new Date().toISOString()
              },
              participantCount: challenge.participantCount + 1
            }
          : challenge
      )
    );
  };

  const likePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked
            }
          : post
      )
    );
  };

  const sharePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    );
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'skill_swap':
        return <Share2 className="h-5 w-5" />;
      case 'course_creation':
        return <Rocket className="h-5 w-5" />;
      case 'learning_streak':
        return <Flame className="h-5 w-5" />;
      case 'community_growth':
        return <Users className="h-5 w-5" />;
      case 'viral_share':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'skill_swap':
        return 'text-blue-500';
      case 'course_creation':
        return 'text-purple-500';
      case 'learning_streak':
        return 'text-orange-500';
      case 'community_growth':
        return 'text-green-500';
      case 'viral_share':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Ended';
    if (days === 0) return 'Ends today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading community challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Challenges</h2>
          <p className="text-muted-foreground">Join challenges, earn rewards, and grow with the community</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>{challenges.reduce((sum, c) => sum + c.participantCount, 0)} Participants</span>
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => {
              const progressPercentage = challenge.userProgress 
                ? (challenge.userProgress.progress / challenge.requirements.target) * 100
                : 0;
              const isJoined = !!challenge.userProgress;
              const isCompleted = challenge.userProgress?.completed || false;

              return (
                <Card 
                  key={challenge.id} 
                  className={`transition-all duration-200 ${
                    isCompleted 
                      ? 'border-green-200 bg-green-50' 
                      : isJoined 
                        ? 'border-primary/50 bg-primary/5' 
                        : 'hover:shadow-md'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getChallengeColor(challenge.type)} bg-opacity-10`}>
                          {getChallengeIcon(challenge.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {challenge.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {getTimeRemaining(challenge.endDate)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {challenge.requirements.target} {challenge.requirements.unit}
                      </span>
                      <span className="font-medium">
                        {challenge.participantCount} participants
                      </span>
                    </div>

                    {isJoined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Progress</span>
                          <span>
                            {challenge.userProgress?.progress}/{challenge.requirements.target}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          {challenge.reward.points} points
                        </span>
                        {challenge.reward.badge && (
                          <Badge variant="outline" className="text-xs">
                            {challenge.reward.badge}
                          </Badge>
                        )}
                      </div>
                      
                      {isCompleted ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : isJoined ? (
                        <Badge variant="secondary">Joined</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => joinChallenge(challenge.id)}
                        >
                          Join Challenge
                        </Button>
                      )}
                    </div>

                    {challenge.reward.exclusive && (
                      <div className="flex items-center space-x-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        <Star className="h-3 w-3" />
                        <span>Exclusive reward for early participants</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Community Activity</span>
              </CardTitle>
              <CardDescription>
                See what your fellow learners are up to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.user.avatar} />
                          <AvatarFallback>
                            {post.user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{post.user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                @{post.user.username} • {formatTimeAgo(post.timestamp)}
                              </div>
                            </div>
                            {post.challenge && (
  <Badge variant="outline" className="text-xs">
    Challenge
  </Badge>
)}
                          </div>
                          
                          <p className="mt-2 text-sm">{post.content}</p>
                          
                          {post.challenge && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <div className="font-medium">{post.challenge.title}</div>
                              <div className="text-muted-foreground">
                                {post.challenge.description}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                            <button
                              onClick={() => likePost(post.id)}
                              className={`flex items-center space-x-1 hover:text-primary transition-colors ${
                                post.isLiked ? 'text-red-500' : ''
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button
                              onClick={() => sharePost(post.id)}
                              className="flex items-center space-x-1 hover:text-primary transition-colors"
                            >
                              <Share2 className="h-4 w-4" />
                              <span>{post.shares}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Challenge Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {challenges.filter(c => c.userProgress?.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Challenges Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {challenges.reduce((sum, c) => sum + (c.userProgress ? 1 : 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Participations</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {challenges.reduce((sum, c) => sum + c.reward.points, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Potential Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}