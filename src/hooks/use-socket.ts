import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import io, { Socket } from 'socket.io-client';

interface UseSocketOptions {
  namespace?: string;
  autoConnect?: boolean;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { data: session, status } = useSession();
  const { namespace = '', autoConnect = true } = options;
  
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current || !session?.user) return;

    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      socketRef.current = io(`${socketUrl}${namespace}`, {
        auth: {
          userId: session.user.id,
          // Use user email or id as authentication instead of accessToken
          userEmail: session.user.email,
          userName: session.user.name,
        },
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('Socket connected');
      });

      socketRef.current.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('Socket disconnected:', reason);
      });

      socketRef.current.on('connect_error', (error) => {
        setConnectionError(error.message);
        console.error('Socket connection error:', error);
      });

      // Authentication event - simplified without accessToken
      socketRef.current.on('connect', () => {
        if (socketRef.current && session?.user) {
          socketRef.current.emit('authenticate', {
            userId: session.user.id,
            userEmail: session.user.email,
            userName: session.user.name,
          });
        }
      });

    } catch (error) {
      console.error('Failed to create socket connection:', error);
      setConnectionError('Failed to connect to server');
    }
  }, [session, namespace]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }, [isConnected]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  // Auto connect when session is available
  useEffect(() => {
    if (autoConnect && status === 'authenticated' && session?.user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session, status, autoConnect, connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Specific hook for real-time messaging
export function useMessaging() {
  const socket = useSocket({ namespace: '/messaging' });
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket.socket) return;

    socket.on('message', (message: any) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('user_online', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('user_offline', (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('user_online');
      socket.off('user_offline');
    };
  }, [socket]);

  const sendMessage = useCallback((message: any) => {
    socket.emit('send_message', message);
  }, [socket]);

  const joinRoom = useCallback((roomId: string) => {
    socket.emit('join_room', { roomId });
  }, [socket]);

  const leaveRoom = useCallback((roomId: string) => {
    socket.emit('leave_room', { roomId });
  }, [socket]);

  return {
    ...socket,
    messages,
    onlineUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
  };
}

// Hook for real-time notifications
export function useNotifications() {
  const socket = useSocket({ namespace: '/notifications' });
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.socket) return;

    socket.on('notification', (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('notification_read', (notificationId: string) => {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    });

    return () => {
      socket.off('notification');
      socket.off('notification_read');
    };
  }, [socket]);

  const markAsRead = useCallback((notificationId: string) => {
    socket.emit('mark_notification_read', { notificationId });
  }, [socket]);

  return {
    ...socket,
    notifications,
    markAsRead,
  };
}

// Hook for real-time trade updates
export function useTradeUpdates() {
  const socket = useSocket({ namespace: '/trades' });
  const [tradeUpdates, setTradeUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!socket.socket) return;

    socket.on('trade_updated', (trade: any) => {
      setTradeUpdates(prev => [trade, ...prev]);
    });

    socket.on('trade_request', (trade: any) => {
      setTradeUpdates(prev => [trade, ...prev]);
    });

    socket.on('trade_accepted', (trade: any) => {
      setTradeUpdates(prev => [trade, ...prev]);
    });

    socket.on('trade_declined', (trade: any) => {
      setTradeUpdates(prev => [trade, ...prev]);
    });

    return () => {
      socket.off('trade_updated');
      socket.off('trade_request');
      socket.off('trade_accepted');
      socket.off('trade_declined');
    };
  }, [socket]);

  return {
    ...socket,
    tradeUpdates,
  };
}