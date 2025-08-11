'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Coins, 
  Gift, 
  Star, 
  Trophy, 
  Target,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'features' | 'badges' | 'discounts' | 'exclusive';
  icon: string;
  color: string;
  claimed: boolean;
}

interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  timestamp: string;
  category: string;
}

export default function PointsRewards() {
  const { data: session } = useSession();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rewards');

  // Mock rewards data
  const mockRewards: Reward[] = [
    {
      id: '1',
      title: 'Premium Course Creator',
      description: 'Unlock advanced course creation features',
      cost: 500,
      category: 'features',
      icon: '🎓',
      color: 'text-blue-500',
      claimed: false
    },
    {
      id: '2',
      title: 'Verified Skill Badge',
      description: 'Get your skills verified by the community',
      cost: 300,
      category: 'badges',
      icon: '✅',
      color: 'text-green-500',
      claimed: false
    },
    {
      id: '3',
      title: 'Featured Course',
      description: 'Feature your course on the homepage for a week',
      cost: 1000,
      category: 'exclusive',
      icon: '⭐',
      color: 'text-yellow-500',
      claimed: false
    },
    {
      id: '4',
      title: 'Custom Profile Theme',
      description: 'Unlock custom themes for your profile',
      cost: 200,
      category: 'features',
      icon: '🎨',
      color: 'text-purple-500',
      claimed: true
    },
    {
      id: '5',
      title: 'Mentor Status',
      description: 'Get official mentor status and priority matching',
      cost: 750,
      category: 'badges',
      icon: '👨‍🏫',
      color: 'text-orange-500',
      claimed: false
    },
    {
      id: '6',
      title: 'Analytics Dashboard',
      description: 'Access detailed analytics for your courses and trades',
      cost: 400,
      category: 'features',
      icon: '📊',
      color: 'text-cyan-500',
      claimed: false
    },
    {
      id: '7',
      title: 'Community Spotlight',
      description: 'Be featured in the community spotlight section',
      cost: 600,
      category: 'exclusive',
      icon: '🌟',
      color: 'text-pink-500',
      claimed: false
    },
    {
      id: '8',
      title: 'Early Access',
      description: 'Get early access to new features and updates',
      cost: 350,
      category: 'features',
      icon: '🚀',
      color: 'text-indigo-500',
      claimed: false
    }
  ];

  // Mock transactions data
  const mockTransactions: PointsTransaction[] = [
    {
      id: '1',
      type: 'earned',
      amount: 25,
      description: 'Course Creator Achievement',
      timestamp: '2024-01-15T10:30:00Z',
      category: 'achievement'
    },
    {
      id: '2',
      type: 'earned',
      amount: 10,
      description: 'Completed trade with Maria Garcia',
      timestamp: '2024-01-14T15:45:00Z',
      category: 'trade'
    },
    {
      id: '3',
      type: 'spent',
      amount: 200,
      description: 'Custom Profile Theme',
      timestamp: '2024-01-13T09:20:00Z',
      category: 'reward'
    },
    {
      id: '4',
      type: 'earned',
      amount: 15,
      description: 'Completed Python Basics course',
      timestamp: '2024-01-12T14:15:00Z',
      category: 'learning'
    },
    {
      id: '5',
      type: 'earned',
      amount: 10,
      description: '7-Day Learning Streak',
      timestamp: '2024-01-11T08:00:00Z',
      category: 'streak'
    },
    {
      id: '6',
      type: 'earned',
      amount: 5,
      description: 'Joined Photography Community',
      timestamp: '2024-01-10T16:30:00Z',
      category: 'community'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRewards(mockRewards);
      setTransactions(mockTransactions);
      setLoading(false);
    };

    loadData();
  }, []);

  const currentPoints = 125;
  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.amount, 0);

  const claimReward = (rewardId: string) => {
    // In a real app, this would call an API to claim the reward
    setRewards(prev => 
      prev.map(reward => 
        reward.id === rewardId 
          ? { ...reward, claimed: true }
          : reward
      )
    );
    
    // Add a transaction for the spent points
    const reward = rewards.find(r => r.id === rewardId);
    if (reward) {
      setTransactions(prev => [
        {
          id: `txn_${Date.now()}`,
          type: 'spent',
          amount: reward.cost,
          description: `Claimed: ${reward.title}`,
          timestamp: new Date().toISOString(),
          category: 'reward'
        },
        ...prev
      ]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'features':
        return <Star className="h-4 w-4" />;
      case 'badges':
        return <Award className="h-4 w-4" />;
      case 'discounts':
        return <TrendingUp className="h-4 w-4" />;
      case 'exclusive':
        return <Crown className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Points & Rewards</h2>
          <p className="text-muted-foreground">Earn points and unlock exclusive rewards</p>
        </div>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Coins className="h-4 w-4" />
          <span>{currentPoints} Points</span>
        </Badge>
      </div>

      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Your Points Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{currentPoints}</div>
              <div className="text-sm text-muted-foreground">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+{totalEarned}</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">-{totalSpent}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Next Reward Progress</span>
              <span>200/500 points</span>
            </div>
            <Progress value={40} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">
              Earn 300 more points to unlock "Verified Skill Badge"
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
        </TabsList>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => {
              const canAfford = currentPoints >= reward.cost;
              const isClaimed = reward.claimed;

              return (
                <Card 
                  key={reward.id} 
                  className={`transition-all duration-200 ${
                    isClaimed 
                      ? 'border-green-200 bg-green-50' 
                      : canAfford 
                        ? 'hover:shadow-md cursor-pointer' 
                        : 'opacity-60'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`text-3xl ${reward.color}`}>
                        {reward.icon}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{reward.cost}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(reward.category)}
                        <span className="text-sm text-muted-foreground capitalize">
                          {reward.category}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canAfford || isClaimed}
                        onClick={() => claimReward(reward.id)}
                        variant={isClaimed ? "outline" : "default"}
                      >
                        {isClaimed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Claimed
                          </>
                        ) : canAfford ? (
                          'Claim Reward'
                        ) : (
                          'Insufficient Points'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Points History</CardTitle>
              <CardDescription>
                Track how you've earned and spent your points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'earned' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'earned' ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <Gift className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(transaction.timestamp)} • {transaction.category}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earning Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Earn More Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Daily Activities</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Complete a course</span>
                      <span className="text-green-600">+15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complete a trade</span>
                      <span className="text-green-600">+10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Join a community</span>
                      <span className="text-green-600">+5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>7-day streak</span>
                      <span className="text-green-600">+20</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Achievements</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>First Trade</span>
                      <span className="text-green-600">+10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Course Creator</span>
                      <span className="text-green-600">+25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trade Master</span>
                      <span className="text-green-600">+50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>30-Day Streak</span>
                      <span className="text-green-600">+100</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}