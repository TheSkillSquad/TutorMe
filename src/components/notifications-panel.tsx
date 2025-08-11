import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  BellRing,
  Check,
  Gift,
  MessageSquare,
  Star,
  Users,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  X,
  Trash2,
} from 'lucide-react';
import { useNotifications } from '@/hooks/use-socket'; // ✅ Use useNotifications instead of useSocket

interface Notification {
  id: string;
  type: 'trade_request' | 'trade_accepted' | 'trade_declined' | 'message' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationsPanelProps {
  trigger?: React.ReactNode;
}

export default function NotificationsPanel({
  trigger
}: NotificationsPanelProps) {
  const { data: session } = useSession();
  const { notifications, markAsRead, isConnected } = useNotifications(); // ✅ Use useNotifications hook
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sync real-time notifications with local state
  useEffect(() => {
    if (notifications.length > 0) {
      setLocalNotifications(prev => {
        const newNotifications = notifications.filter(newNotif => 
          !prev.some(existing => existing.id === newNotif.id)
        );
        return [...newNotifications, ...prev];
      });
    }
  }, [notifications]);

  // Update unread count
  useEffect(() => {
    const unread = localNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [localNotifications]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'trade_request':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'trade_accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'trade_declined':
        return <X className="h-4 w-4 text-red-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'achievement':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Info className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    setLocalNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    const unreadNotifications = localNotifications.filter(n => !n.read);
    unreadNotifications.forEach(notif => {
      markAsRead(notif.id);
    });
    setLocalNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setLocalNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Mock notifications for demo (remove this in production)
  useEffect(() => {
    if (localNotifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'trade_request',
          title: 'New Trade Request',
          message: 'Sarah wants to trade "React Development" for your "Python Programming" skill.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          priority: 'high',
          data: { tradeId: 'trade_1', userId: 'user_2' }
        },
        {
          id: '2',
          type: 'trade_accepted',
          title: 'Trade Accepted!',
          message: 'Mike accepted your trade request for "UI/UX Design".',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: false,
          priority: 'medium',
          data: { tradeId: 'trade_2', userId: 'user_3' }
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Achievement Unlocked!',
          message: 'You earned the "First Trade" badge!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'low',
          data: { achievementId: 'first_trade' }
        },
        {
          id: '4',
          type: 'message',
          title: 'New Message',
          message: 'Alex sent you a message about the upcoming session.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'medium',
          data: { messageId: 'msg_1', userId: 'user_4' }
        },
        {
          id: '5',
          type: 'reminder',
          title: 'Session Reminder',
          message: 'Your JavaScript learning session starts in 1 hour.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'high',
          data: { sessionId: 'session_1' }
        }
      ];
      setLocalNotifications(mockNotifications);
    }
  }, [localNotifications.length]);

  const DefaultTrigger = () => (
    <Button variant="ghost" size="sm" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || <DefaultTrigger />}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BellRing className="h-5 w-5" />
              <span>Notifications</span>
              {!isConnected && (
                <Badge variant="outline" className="text-xs">
                  Offline
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your latest activities and messages
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {localNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">No notifications yet</h3>
              <p className="text-sm text-muted-foreground">
                We'll notify you when something interesting happens!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {localNotifications.map((notification, index) => (
                  <Card 
                    key={notification.id}
                    className={`transition-all hover:shadow-sm border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-muted/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Check className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="flex items-center mt-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}