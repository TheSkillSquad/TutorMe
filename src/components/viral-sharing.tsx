'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Share2, 
  Copy, 
  MessageCircle, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail,
  QrCode,
  Gift,
  Star,
  Users,
  TrendingUp,
  Award,
  Link2,
  CheckCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ShareableContent {
  id: string;
  type: 'course' | 'achievement' | 'challenge' | 'profile';
  title: string;
  description: string;
  url?: string;
  thumbnail?: string;
  stats?: {
    views: number;
    likes: number;
    shares: number;
  };
}

interface ViralCampaign {
  id: string;
  title: string;
  description: string;
  type: 'referral' | 'contest' | 'milestone';
  reward: {
    points: number;
    badge?: string;
    exclusive?: boolean;
  };
  requirements: {
    shares: number;
    timeframe: string;
  };
  isActive: boolean;
  endDate: string;
}

export default function ViralSharing({ content }: { content?: ShareableContent }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [activeCampaign, setActiveCampaign] = useState<ViralCampaign | null>(null);

  // Mock viral campaigns
  const mockCampaigns: ViralCampaign[] = [
    {
      id: '1',
      title: 'New Year Referral Blast',
      description: 'Invite 10 friends and get exclusive mentor status!',
      type: 'referral',
      reward: {
        points: 500,
        badge: 'Super Ambassador',
        exclusive: true
      },
      requirements: {
        shares: 10,
        timeframe: 'January 2024'
      },
      isActive: true,
      endDate: '2024-01-31'
    },
    {
      id: '2',
      title: 'Viral Course Contest',
      description: 'Get 1000 shares on your course and win a feature spot!',
      type: 'contest',
      reward: {
        points: 1000,
        badge: 'Viral Creator',
        exclusive: true
      },
      requirements: {
        shares: 1000,
        timeframe: 'Ongoing'
      },
      isActive: true,
      endDate: '2024-02-29'
    },
    {
      id: '3',
      title: 'Community Milestone',
      description: 'Help us reach 10K users and get special rewards!',
      type: 'milestone',
      reward: {
        points: 200,
        badge: 'Founding Member'
      },
      requirements: {
        shares: 5,
        timeframe: 'Until milestone reached'
      },
      isActive: true,
      endDate: '2024-03-31'
    }
  ];

  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      color: 'text-blue-400',
      getUrl: (text: string, url: string) => 
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5" />,
      color: 'text-blue-600',
      getUrl: (text: string, url: string) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-5 w-5" />,
      color: 'text-blue-700',
      getUrl: (text: string, url: string) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    },
    {
      name: 'Email',
      icon: <Mail className="h-5 w-5" />,
      color: 'text-gray-600',
      getUrl: (text: string, url: string) => 
        `mailto:?subject=${encodeURIComponent('Check this out!')}&body=${encodeURIComponent(text + '\n\n' + url)}`
    }
  ];

  const generateShareText = () => {
    if (content) {
      switch (content.type) {
        case 'course':
          return `Just completed an amazing course on "${content.title}" at TutorMe! 🎓 ${content.description}`;
        case 'achievement':
          return `Just unlocked the "${content.title}" achievement on TutorMe! 🏆 ${content.description}`;
        case 'challenge':
          return `Join me in the "${content.title}" challenge on TutorMe! 🚀 ${content.description}`;
        case 'profile':
          return `Check out my learning profile on TutorMe! 🌟 ${content.description}`;
        default:
          return 'Join me on TutorMe - the ultimate skill exchange and learning platform!';
      }
    }
    return 'Join me on TutorMe - the ultimate skill exchange and learning platform! 🚀';
  };

  const generateShareUrl = () => {
    if (content?.url) {
      return content.url;
    }
    // Create a safe username from the user's name or use their ID
    const userIdentifier = session?.user?.name?.toLowerCase().replace(/\s+/g, '') || session?.user?.id || 'friend';
    return `https://tutorme.com/ref/${userIdentifier}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleShare = (platform: string) => {
    const shareText = shareMessage || generateShareText();
    const shareUrl = generateShareUrl();
    
    const platformLink = shareLinks.find(link => link.name === platform);
    if (platformLink) {
      window.open(platformLink.getUrl(shareText, shareUrl), '_blank', 'width=600,height=400');
    }
  };

  const generateReferralLink = () => {
    // Create a safe username from the user's name or use their ID
    const userIdentifier = session?.user?.name?.toLowerCase().replace(/\s+/g, '') || session?.user?.id || 'friend';
    return `https://tutorme.com/join?ref=${userIdentifier}&reward=50`;
  };

  return (
    <div className="space-y-4">
      {/* Main Share Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share & Earn Rewards</span>
            </DialogTitle>
            <DialogDescription>
              Share with friends and earn points when they join!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Active Campaigns */}
            <div>
              <h4 className="font-medium mb-3">Active Campaigns</h4>
              <div className="grid grid-cols-1 gap-3">
                {mockCampaigns.map((campaign) => (
                  <Card 
                    key={campaign.id} 
                    className={`cursor-pointer transition-all ${
                      activeCampaign?.id === campaign.id 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setActiveCampaign(campaign)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{campaign.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {campaign.description}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs">
                            <div className="flex items-center space-x-1">
                              <Gift className="h-3 w-3" />
                              <span>{campaign.reward.points} points</span>
                            </div>
                            {campaign.reward.badge && (
                              <Badge variant="outline" className="text-xs">
                                {campaign.reward.badge}
                              </Badge>
                            )}
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{campaign.requirements.shares} shares</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            Ends {new Date(campaign.endDate).toLocaleDateString()}
                          </div>
                          {campaign.isActive && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Share Message */}
            <div>
              <Label htmlFor="share-message">Custom Message (Optional)</Label>
              <Textarea
                id="share-message"
                placeholder={generateShareText()}
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Share Links */}
            <div>
              <Label>Share on Social Media</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {shareLinks.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => handleShare(platform.name)}
                  >
                    <span className={platform.color}>{platform.icon}</span>
                    <span>{platform.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Referral Link */}
            <div>
              <Label>Your Referral Link</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  value={generateReferralLink()}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateReferralLink())}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Friends who join using this link get 50 bonus points!
              </p>
            </div>

            {/* Share Stats */}
            {content?.stats && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Share Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {content.stats.views}
                      </div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {content.stats.likes}
                      </div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {content.stats.shares}
                      </div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rewards Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Potential Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">Points</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Earn points for every friend who joins and completes their first activity
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Achievements</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Unlock exclusive badges and titles for top referrers
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Share Options */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('Twitter')}
          className="text-blue-400 hover:text-blue-500"
        >
          <Twitter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare('Facebook')}
          className="text-blue-600 hover:text-blue-700"
        >
          <Facebook className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(generateShareUrl())}
          className="text-gray-600 hover:text-gray-700"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}