import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Users,
  Circle,
  MessageSquare,
  Phone,
  Video,
  MoreHorizontal,
  Smile,
  Paperclip,
  Mic,
  MicOff,
} from 'lucide-react';
import { useMessaging } from '@/hooks/use-socket'; // ✅ Use useMessaging instead of useSocket

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file' | 'system';
  edited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
}

interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'typing';
  lastSeen?: string;
}

interface RealTimeChatProps {
  roomId?: string;
  recipientId?: string;
  title?: string;
  className?: string;
}

export default function RealTimeChat({
  roomId,
  recipientId,
  title = 'Chat',
  className = '',
}: RealTimeChatProps) {
  const { data: session } = useSession();
  const {
    isConnected,
    messages,
    onlineUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
  } = useMessaging(); // ✅ Use useMessaging hook

  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Join room on component mount
  useEffect(() => {
    if (isConnected && (roomId || recipientId)) {
      const currentRoomId = roomId || `dm_${[session?.user?.id, recipientId].sort().join('_')}`;
      joinRoom(currentRoomId);

      return () => {
        leaveRoom(currentRoomId);
      };
    }
  }, [isConnected, roomId, recipientId, session?.user?.id, joinRoom, leaveRoom]);

  // Sync real-time messages with local state
  useEffect(() => {
    if (messages.length > 0) {
      setLocalMessages(prev => {
        const newMessages = messages.filter(newMsg => 
          !prev.some(existing => existing.id === newMsg.id)
        );
        return [...prev, ...newMessages];
      });
    }
  }, [messages]);

  // Update chat users based on online users
  useEffect(() => {
    setChatUsers(prev => 
      prev.map(user => ({
        ...user,
        status: onlineUsers.includes(user.id) ? 'online' : 'offline'
      }))
    );
  }, [onlineUsers]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !session?.user) return;

    const message: Omit<Message, 'id'> = {
      senderId: session.user.id!,
      senderName: session.user.name || 'Anonymous',
      senderAvatar: session.user.image || undefined,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
    };

    sendMessage(message);
    setNewMessage('');
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      // Emit typing start event
      // socket.emit('typing_start', { roomId: currentRoomId });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit typing stop event
      // socket.emit('typing_stop', { roomId: currentRoomId });
    }, 1000);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOwnMessage = (senderId: string) => {
    return senderId === session?.user?.id;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Mock messages for demo (remove this in production)
  useEffect(() => {
    if (localMessages.length === 0 && session?.user) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'other_user',
          senderName: 'Sarah Wilson',
          content: 'Hey! Ready for our React session?',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          type: 'text',
        },
        {
          id: '2',
          senderId: session.user.id!,
          senderName: session.user.name || 'You',
          senderAvatar: session.user.image || undefined,
          content: 'Yes! I\'ve been looking forward to this.',
          timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          type: 'text',
        },
        {
          id: '3',
          senderId: 'other_user',
          senderName: 'Sarah Wilson',
          content: 'Great! I\'ve prepared some examples we can work through.',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          type: 'text',
        },
      ];
      setLocalMessages(mockMessages);
    }
  }, [localMessages.length, session?.user]);

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      {/* Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <Circle 
                  className={`h-2 w-2 ${isConnected ? 'text-green-500 fill-current' : 'text-gray-400 fill-current'}`} 
                />
                <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
                {onlineUsers.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span>{onlineUsers.length} online</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col min-h-0 p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {localMessages.map((message, index) => {
              const isOwn = isOwnMessage(message.senderId);
              const showAvatar = index === 0 || localMessages[index - 1].senderId !== message.senderId;
              
              return (
                <div
                  key={message.id}
                  className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwn && showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(message.senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  {!isOwn && !showAvatar && <div className="w-8" />}
                  
                  <div className={`max-w-[70%] ${isOwn ? 'order-first' : ''}`}>
                    {showAvatar && !isOwn && (
                      <div className="text-xs text-muted-foreground mb-1 ml-1">
                        {message.senderName}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        isOwn
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                      {message.edited && (
                        <span className="text-xs opacity-70 ml-2">(edited)</span>
                      )}
                    </div>
                    
                    <div className={`text-xs text-muted-foreground mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">...</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                disabled={!isConnected}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={isRecording ? 'text-red-500' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}