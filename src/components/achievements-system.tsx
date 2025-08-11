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
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Users, 
  Award,
  TrendingUp,
  Crown,
  Medal,
  Gift
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  points: number;
  unlockedAt?: string;
}

interface AchievementProgress {
  achievementId: string;
  progress: number;
  totalRequired: number;
  unlocked: boolean;
}

interface LeaderboardUser {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  credits?: number;
  _count?: {
    tradesInitiated: number;
    tradesReceived: number;
    coursesCreated: number;
  };
}

export default function AchievementsSystem() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<AchievementProgress[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');

  // Mock achievements data
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      name: 'First Trade',
      description: 'Complete your first skill trade',
      icon: '🌟',
      color: 'text-yellow-500',
      points: 10
    },
    {
      id: '2',
      name: 'Course Creator',
      description: 'Create and publish your first course',
      icon: '📚',
      color: 'text-blue-500',
      points: 25
    },
    {
      id: '3',
      name: 'Quick Learner',
      description: 'Complete your first course',
      icon: '🎯',
      color: 'text-green-500',
      points: 15
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Join 3 different communities',
      icon: '🦋',
      color: 'text-purple-500',
      points: 20
    },
    {
      id: '5',
      name: 'Trade Master',
      description: 'Complete 10 skill trades',
      icon: '🏆',
      color: 'text-orange-500',
      points: 50
    },
    {
      id: '6',
      name: '7-Day Streak',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      color: 'text-red-500',
      points: 30
    },
    {
      id: '7',
      name: '30-Day Streak',
      description: 'Maintain a 30-day learning streak',
      icon: '💎',
      color: 'text-cyan-500',
      points: 100
    },
    {
      id: '8',
      name: 'Skill Collector',
      description: 'Offer 5 different skills',
      icon: '🎨',
      color: 'text-pink-500',
      points: 25
    },
    {
      id: '9',
      name: 'Knowledge Seeker',
      description: 'Request to learn 5 different skills',
      icon: '🔍',
      color: 'text-indigo-500',
      points: 25
    },
    {
      id: '10',
      name: 'Community Leader',
      description: 'Create and lead a community',
      icon: '👑',
      color: 'text-yellow-600',
      points: 40
    }
  ];

  // Mock progress data
  const mockProgress: AchievementProgress[] = [
    { achievementId: '1', progress: 1, totalRequired: 1, unlocked: true },
    { achievementId: '2', progress: 1, totalRequired: 1, unlocked: true },
    { achievementId: '3', progress: 1, totalRequired: 1, unlocked: false },
    { achievementId: '4', progress: 2, totalRequired: 3, unlocked: false },
    { achievementId: '5', progress: 3, totalRequired: 10, unlocked: false },
    { achievementId: '6', progress: 3, totalRequired: 7, unlocked: false },
    { achievementId: '7', progress: 3, totalRequired: 30, unlocked: false },
    { achievementId: '8', progress: 3, totalRequired: 5, unlocked: false },
    { achievementId: '9', progress: 2, totalRequired: 5, unlocked: false },
    { achievementId: '10', progress: 0, totalRequired: 1, unlocked: false }
  ];

  // Mock leaderboard data
  const mockLeaderboard: LeaderboardUser[] = [
    { id: '1', username: 'alexchen', name: 'Alex Chen', avatar: '/placeholder.svg', credits: 1250 },
    { id: '2', username: 'mariagarcia', name: 'Maria Garcia', avatar: '/placeholder.svg', credits: 980 },
    { id: '3', username: 'johnsmith', name: 'John Smith', avatar: '/placeholder.svg', credits: 875 },
    { id: '4', username: 'sarahwilson', name: 'Sarah Wilson', avatar: '/placeholder.svg', credits: 720 },
    { id: '5', username: 'davidlee', name: 'David Lee', avatar: '/placeholder.svg', credits: 650 },
    { id: '6', username: 'emmabrown', name: 'Emma Brown', avatar: '/placeholder.svg', credits: 590 },
    { id: '7', username: 'mikejones', name: 'Mike Jones', avatar: '/placeholder.svg', credits: 520 },
    { id: '8', username: 'lisawang', name: 'Lisa Wang', avatar: '/placeholder.svg', credits: 480 },
    { id: '9', username: 'tomharris', name: 'Tom Harris', avatar: '/placeholder.svg', credits: 420 },
    { id: '10', username: 'annegarcia', name: 'Anne Garcia', avatar: '/placeholder.svg', credits: 380 }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAchievements(mockAchievements);
      setProgress(mockProgress);
      setLeaderboard(mockLeaderboard);
      setLoading(false);
    };

    loadData();
  }, []);

  const getAchievementIcon = (achievement: Achievement) => {
    if (achievement.unlockedAt) {
      return <span className="text-2xl">{achievement.icon}</span>;
    }
    return <span className="text-2xl opacity-30">{achievement.icon}</span>;
  };

  const getProgressForAchievement = (achievementId: string) => {
    return progress.find(p => p.achievementId === achievementId);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const unlockedCount = progress.filter(p => p.unlocked).length;
  const totalCount = progress.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievements & Leaderboard</h2>
          <p className="text-muted-foreground">Track your progress and compete with others</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Trophy className="h-4 w-4" />
          <span>{unlockedCount}/{totalCount} Unlocked</span>
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Your Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Achievement Completion</span>
                <span>{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{unlockedCount}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {progress.reduce((sum, p) => sum + (p.unlocked ? p.progress : 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {achievements.reduce((sum, a) => sum + (progress.find(p => p.achievementId === a.id)?.unlocked ? a.points : 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {leaderboard.findIndex(u => u.id === session?.user?.id) + 1 || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Your Rank</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const progressData = getProgressForAchievement(achievement.id);
              const isUnlocked = progressData?.unlocked || false;
              const progressPercentage = progressData ? (progressData.progress / progressData.totalRequired) * 100 : 0;

              return (
                <Card 
                  key={achievement.id} 
                  className={`transition-all duration-200 ${
                    isUnlocked 
                      ? 'border-primary/50 bg-primary/5 shadow-md' 
                      : 'border-border'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={isUnlocked ? '' : 'opacity-50'}>
                        {getAchievementIcon(achievement)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{achievement.points}</span>
                      </div>
                    </div>
                    <CardTitle className={`text-lg ${isUnlocked ? '' : 'text-muted-foreground'}`}>
                      {achievement.name}
                    </CardTitle>
                    <CardDescription className={isUnlocked ? '' : 'text-muted-foreground'}>
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isUnlocked && progressData && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{progressData.progress}/{progressData.totalRequired}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    )}
                    {isUnlocked && (
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <Award className="h-4 w-4" />
                        <span>Unlocked!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Top Learners</span>
              </CardTitle>
              <CardDescription>
                See who's leading the pack in points and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {leaderboard.map((user, index) => {
                    const isCurrentUser = user.id === session?.user?.id;
                    
                    return (
                      <div
                        key={user.id}
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                          isCurrentUser 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center justify-center w-8">
                            {getRankIcon(index + 1)}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold">{user.credits}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                          {isCurrentUser && (
                            <Badge variant="outline">You</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {achievements.reduce((sum, a) => sum + a.points, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Points Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{leaderboard.length}</div>
                    <div className="text-sm text-muted-foreground">Active Learners</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round(completionPercentage)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg. Completion</div>
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