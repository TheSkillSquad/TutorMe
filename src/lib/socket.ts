import { Server } from 'socket.io';
import { db } from './db';

interface UserSocket {
  userId: string;
  socketId: string;
}

const connectedUsers = new Map<string, string>(); // userId -> socketId

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', async (data: { userId: string; token: string }) => {
      try {
        // Verify user exists (you should add proper JWT validation here)
        const user = await db.user.findUnique({
          where: { id: data.userId },
          select: { id: true, username: true, avatar: true }
        });

        if (user) {
          socket.data.userId = user.id;
          connectedUsers.set(user.id, socket.id);
          
          // Join user to their personal room
          socket.join(`user_${user.id}`);
          
          // Notify user of successful connection
          socket.emit('authenticated', {
            success: true,
            user: { id: user.id, username: user.username, avatar: user.avatar }
          });

          // Notify other users that this user is online
          socket.broadcast.emit('user_online', {
            userId: user.id,
            username: user.username,
            avatar: user.avatar
          });

          console.log(`User ${user.username} authenticated with socket ${socket.id}`);
        } else {
          socket.emit('authenticated', { success: false, error: 'User not found' });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('authenticated', { success: false, error: 'Authentication failed' });
      }
    });

    // Handle trade requests
    socket.on('trade_request', async (data: {
      receiverId: string;
      offeredSkills: string[];
      requestedSkills: string[];
      message: string;
      credits: number;
    }) => {
      try {
        const senderId = socket.data.userId;
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const receiverSocketId = connectedUsers.get(data.receiverId);
        if (receiverSocketId) {
          // Send trade request to receiver
          io.to(receiverSocketId).emit('trade_request_received', {
            senderId,
            receiverId: data.receiverId,
            offeredSkills: data.offeredSkills,
            requestedSkills: data.requestedSkills,
            message: data.message,
            credits: data.credits,
            timestamp: new Date().toISOString()
          });
        }

        // Confirm to sender that request was sent
        socket.emit('trade_request_sent', {
          receiverId: data.receiverId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Trade request error:', error);
        socket.emit('error', { message: 'Failed to send trade request' });
      }
    });

    // Handle trade responses
    socket.on('trade_response', async (data: {
      tradeId: string;
      response: 'accept' | 'decline' | 'counter';
      counterOffer?: {
        offeredSkills: string[];
        requestedSkills: string[];
        credits: number;
      };
      message?: string;
    }) => {
      try {
        const senderId = socket.data.userId;
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Find the other party in the trade
        const trade = await db.trade.findUnique({
          where: { id: data.tradeId },
          select: { initiatorId: true, receiverId: true }
        });

        if (!trade) {
          socket.emit('error', { message: 'Trade not found' });
          return;
        }

        const otherPartyId = trade.initiatorId === senderId ? trade.receiverId : trade.initiatorId;
        const otherPartySocketId = connectedUsers.get(otherPartyId);

        if (otherPartySocketId) {
          io.to(otherPartySocketId).emit('trade_response_received', {
            tradeId: data.tradeId,
            response: data.response,
            counterOffer: data.counterOffer,
            message: data.message,
            responderId: senderId,
            timestamp: new Date().toISOString()
          });
        }

        // Update trade status in database
        await db.trade.update({
          where: { id: data.tradeId },
          data: {
            status: data.response === 'accept' ? 'active' : 'cancelled',
            updatedAt: new Date()
          }
        });

        socket.emit('trade_response_sent', {
          tradeId: data.tradeId,
          response: data.response,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Trade response error:', error);
        socket.emit('error', { message: 'Failed to send trade response' });
      }
    });

    // Handle real-time messaging
    socket.on('send_message', async (data: {
      receiverId: string;
      tradeId?: string;
      content: string;
      type: 'text' | 'image' | 'file';
    }) => {
      try {
        const senderId = socket.data.userId;
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Save message to database
        const message = await db.message.create({
          data: {
            content: data.content,
            type: data.type,
            senderId,
            receiverId: data.receiverId,
            tradeId: data.tradeId,
            createdAt: new Date()
          },
          include: {
            sender: {
              select: { id: true, username: true, avatar: true }
            }
          }
        });

        // Send message to receiver
        const receiverSocketId = connectedUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', {
            id: message.id,
            content: message.content,
            type: message.type,
            sender: message.sender,
            createdAt: message.createdAt,
            tradeId: data.tradeId
          });
        }

        // Confirm to sender that message was sent
        socket.emit('message_sent', {
          id: message.id,
          timestamp: message.createdAt
        });
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { receiverId: string; tradeId?: string }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: socket.data.userId,
          tradeId: data.tradeId,
          isTyping: true
        });
      }
    });

    socket.on('typing_stop', (data: { receiverId: string; tradeId?: string }) => {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: socket.data.userId,
          tradeId: data.tradeId,
          isTyping: false
        });
      }
    });

    // Handle trade status updates
    socket.on('trade_status_update', async (data: {
      tradeId: string;
      status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
      message?: string;
    }) => {
      try {
        const senderId = socket.data.userId;
        if (!senderId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Update trade in database
        const trade = await db.trade.update({
          where: { id: data.tradeId },
          data: {
            status: data.status,
            updatedAt: new Date()
          },
          include: {
            initiator: { select: { id: true, username: true } },
            receiver: { select: { id: true, username: true } }
          }
        });

        // Notify both parties
        const initiatorSocketId = connectedUsers.get(trade.initiatorId);
        const receiverSocketId = connectedUsers.get(trade.receiverId);

        const updateData = {
          tradeId: data.tradeId,
          status: data.status,
          message: data.message,
          updatedBy: senderId,
          timestamp: new Date().toISOString()
        };

        if (initiatorSocketId) {
          io.to(initiatorSocketId).emit('trade_status_updated', updateData);
        }
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('trade_status_updated', updateData);
        }
      } catch (error) {
        console.error('Trade status update error:', error);
        socket.emit('error', { message: 'Failed to update trade status' });
      }
    });

    // Handle notifications
    socket.on('mark_notification_read', (data: { notificationId: string }) => {
      // In a real implementation, you would update the notification status in the database
      socket.emit('notification_marked_read', {
        notificationId: data.notificationId,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const userId = socket.data.userId;
      if (userId) {
        connectedUsers.delete(userId);
        
        // Notify other users that this user is offline
        socket.broadcast.emit('user_offline', {
          userId,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to TutorMe real-time server',
      timestamp: new Date().toISOString()
    });
  });
};

// Helper function to send notifications to specific users
export const sendNotification = (io: Server, userId: string, notification: {
  type: 'trade_request' | 'trade_response' | 'message' | 'trade_status' | 'achievement';
  title: string;
  message: string;
  data?: any;
}) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit('notification', {
      id: `notif_${Date.now()}_${Math.random()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    });
  }
};

// Helper function to get online users
export const getOnlineUsers = () => {
  return Array.from(connectedUsers.keys());
};