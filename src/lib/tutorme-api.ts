// src/lib/tutorme-api.ts

import { openRouterService } from './openrouter';
import { payPalService } from './paypal';
import { twilioVideoService } from './twilio-video';
import { firebaseAdmin } from './firebase-admin';
import {
  // APIError is an interface; the constructible error class is APIErrorImpl
  APIErrorImpl,
  createSuccessResponse,
} from './api-utils';

export interface ServiceConfig {
  openRouter?: {
    apiKey?: string;
    baseUrl?: string;
  };
  paypal?: {
    clientId?: string;
    clientSecret?: string;
    mode?: 'sandbox' | 'live';
  };
  twilio?: {
    accountSid?: string;
    apiKey?: string;
    apiSecret?: string;
  };
  firebase?: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
  };
}

class TutorMeAPIService {
  private static instance: TutorMeAPIService;
  private config: ServiceConfig;

  private constructor(config: ServiceConfig = {}) {
    this.config = {
      openRouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: 'https://openrouter.ai/api/v1',
        ...config.openRouter,
      },
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        mode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
        ...config.paypal,
      },
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        apiKey: process.env.TWILIO_API_KEY,
        apiSecret: process.env.TWILIO_API_SECRET,
        ...config.twilio,
      },
      firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        ...config.firebase,
      },
      ...config,
    };
  }

  public static getInstance(config?: ServiceConfig): TutorMeAPIService {
    if (!TutorMeAPIService.instance) {
      TutorMeAPIService.instance = new TutorMeAPIService(config);
    }
    return TutorMeAPIService.instance;
  }

  // AI Services
  get ai() {
    return {
      generateCourse: async (skillTopic: string, userLevel?: string, duration?: number) => {
        try {
          const course = await openRouterService.generateSkillCourse(
            skillTopic,
            userLevel,
            duration
          );
          return createSuccessResponse(course);
        } catch (error) {
          throw new APIErrorImpl('AI_SERVICE_ERROR', 'Failed to generate course', error);
        }
      },

      findMatches: async (userProfile: any, availableTraders: any[]) => {
        try {
          const matches = await openRouterService.findOptimalSkillMatches(
            userProfile,
            availableTraders
          );
          return createSuccessResponse(matches);
        } catch (error) {
          throw new APIErrorImpl('AI_SERVICE_ERROR', 'Failed to find matches', error);
        }
      },

      generateLearningPath: async (userHistory: any, goals: string[]) => {
        try {
          const path = await openRouterService.generatePersonalizedLearningPath(
            userHistory,
            goals
          );
          return createSuccessResponse(path);
        } catch (error) {
          throw new APIErrorImpl('AI_SERVICE_ERROR', 'Failed to generate learning path', error);
        }
      },

      analyzeProgress: async (userProgress: any, targetSkill: string) => {
        try {
          const analysis = await openRouterService.analyzeSkillProgress(
            userProgress,
            targetSkill
          );
        return createSuccessResponse(analysis);
        } catch (error) {
          throw new APIErrorImpl('AI_SERVICE_ERROR', 'Failed to analyze progress', error);
        }
      },
    };
  }

  // Payment Services
  get payments() {
    return {
      createSubscription: async (
        planType: 'trader' | 'creator' | 'organization',
        userEmail: string
      ) => {
        try {
          const subscription = await payPalService.createSubscription(planType, userEmail);
          return createSuccessResponse(subscription);
        } catch (error) {
          throw new APIErrorImpl('PAYMENT_ERROR', 'Failed to create subscription', error);
        }
      },

      captureOrder: async (orderId: string) => {
        try {
          const capture = await payPalService.captureOrder(orderId);
          return createSuccessResponse(capture);
        } catch (error) {
          throw new APIErrorImpl('PAYMENT_ERROR', 'Failed to capture order', error);
        }
      },

      createPayout: async (creatorEmail: string, amount: number, currency?: string) => {
        try {
          const payout = await payPalService.createCreatorPayout(creatorEmail, amount, currency);
          return createSuccessResponse(payout);
        } catch (error) {
          throw new APIErrorImpl('PAYMENT_ERROR', 'Failed to create payout', error);
        }
      },

      refundOrder: async (captureId: string, amount?: number, currency?: string) => {
        try {
          const refund = await payPalService.refundOrder(captureId, amount, currency);
          return createSuccessResponse(refund);
        } catch (error) {
          throw new APIErrorImpl('PAYMENT_ERROR', 'Failed to refund order', error);
        }
      },

      getOrderDetails: async (orderId: string) => {
        try {
          const details = await payPalService.getOrderDetails(orderId);
          return createSuccessResponse(details);
        } catch (error) {
          throw new APIErrorImpl('PAYMENT_ERROR', 'Failed to get order details', error);
        }
      },
    };
  }

  // Video Services
  get video() {
    return {
      generateToken: async (identity: string, roomName?: string) => {
        try {
          const token = await twilioVideoService.generateVideoToken(identity, roomName);
          return createSuccessResponse(token);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to generate video token', error);
        }
      },

      createRoom: async (roomName: string, options?: any) => {
        try {
          const room = await twilioVideoService.createVideoRoom(roomName, options);
          return createSuccessResponse(room);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to create video room', error);
        }
      },

      getRoom: async (roomSid: string) => {
        try {
          const room = await twilioVideoService.getVideoRoom(roomSid);
          return createSuccessResponse(room);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to get video room', error);
        }
      },

      completeRoom: async (roomSid: string) => {
        try {
          const result = await twilioVideoService.completeVideoRoom(roomSid);
          return createSuccessResponse(result);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to complete video room', error);
        }
      },

      getParticipants: async (roomSid: string) => {
        try {
          const participants = await twilioVideoService.getRoomParticipants(roomSid);
          return createSuccessResponse(participants);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to get room participants', error);
        }
      },

      startRecording: async (roomSid: string) => {
        try {
          const result = await twilioVideoService.startRecording(roomSid);
          return createSuccessResponse(result);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to start recording', error);
        }
      },

      stopRecording: async (roomSid: string) => {
        try {
          const result = await twilioVideoService.stopRecording(roomSid);
          return createSuccessResponse(result);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to stop recording', error);
        }
      },

      getRecordings: async (roomSid: string) => {
        try {
          const recordings = await twilioVideoService.getRecordings(roomSid);
          return createSuccessResponse(recordings);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to get recordings', error);
        }
      },

      getAnalytics: async (roomSid: string) => {
        try {
          const analytics = await twilioVideoService.getRoomAnalytics(roomSid);
          return createSuccessResponse(analytics);
        } catch (error) {
          throw new APIErrorImpl('VIDEO_SERVICE_ERROR', 'Failed to get room analytics', error);
        }
      },
    };
  }

  // User Services
  get user() {
    return {
      createProfile: async (token: string, profileData: any) => {
        try {
          const decodedToken = await firebaseAdmin.verifyToken(token);
          const uid = decodedToken.uid;

          const profile = await firebaseAdmin.createUserProfile(uid, profileData);
          return createSuccessResponse(profile);
        } catch (error) {
          throw new APIErrorImpl('USER_SERVICE_ERROR', 'Failed to create user profile', error);
        }
      },

      getProfile: async (token: string) => {
        try {
          const decodedToken = await firebaseAdmin.verifyToken(token);
          const uid = decodedToken.uid;

          const profile = await firebaseAdmin.getUserProfile(uid);
          return createSuccessResponse(profile);
        } catch (error) {
          throw new APIErrorImpl('USER_SERVICE_ERROR', 'Failed to get user profile', error);
        }
      },

      updateProfile: async (token: string, updateData: any) => {
        try {
          const decodedToken = await firebaseAdmin.verifyToken(token);
          const uid = decodedToken.uid;

          await firebaseAdmin.updateUserProfile(uid, updateData);
          return createSuccessResponse({ message: 'Profile updated successfully' });
        } catch (error) {
          throw new APIErrorImpl('USER_SERVICE_ERROR', 'Failed to update user profile', error);
        }
      },

      verifyToken: async (token: string) => {
        try {
          const decodedToken = await firebaseAdmin.verifyToken(token);
          return createSuccessResponse(decodedToken);
        } catch (error) {
          throw new APIErrorImpl('USER_SERVICE_ERROR', 'Failed to verify token', error);
        }
      },
    };
  }

  // Configuration
  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<ServiceConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      openRouter: { ...this.config.openRouter, ...newConfig.openRouter },
      paypal: { ...this.config.paypal, ...newConfig.paypal },
      twilio: { ...this.config.twilio, ...newConfig.twilio },
      firebase: { ...this.config.firebase, ...newConfig.firebase },
    };
  }

  // Health check
  async healthCheck(): Promise<any> {
    const health = {
      status: 'healthy',
      services: {
        openRouter: 'unknown',
        paypal: 'unknown',
        twilio: 'unknown',
        firebase: 'unknown',
      },
      timestamp: new Date().toISOString(),
    };

    // Check OpenRouter
    try {
      await openRouterService.routeAIRequest('health-check', 'low', 'ping', { maxTokens: 10 });
      health.services.openRouter = 'healthy';
    } catch {
      health.services.openRouter = 'unhealthy';
      health.status = 'degraded';
    }

    // Check PayPal
    try {
      await payPalService.getOrderDetails('test'); // Expected to 404 for fake ID, still shows reachability
      health.services.paypal = 'healthy';
    } catch (error: any) {
      if (typeof error?.message === 'string' && error.message.includes('Not Found')) {
        health.services.paypal = 'healthy';
      } else {
        health.services.paypal = 'unhealthy';
        health.status = 'degraded';
      }
    }

    // Check Twilio
    try {
      await twilioVideoService.generateVideoToken('test-user');
      health.services.twilio = 'healthy';
    } catch {
      health.services.twilio = 'unhealthy';
      health.status = 'degraded';
    }

    // Check Firebase
    try {
      await firebaseAdmin.getUser('test-uid'); // Will fail for non-existent user but confirms reachability
      health.services.firebase = 'healthy';
    } catch (error: any) {
      if (typeof error?.message === 'string' && error.message.includes('No user record found')) {
        health.services.firebase = 'healthy';
      } else {
        health.services.firebase = 'unhealthy';
        health.status = 'degraded';
      }
    }

    return health;
  }
}

// Export singleton instance
export const tutorMeAPI = TutorMeAPIService.getInstance();
export default TutorMeAPIService;