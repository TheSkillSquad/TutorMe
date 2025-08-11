// src/lib/gamification.ts

import { apiService } from './services';
import type { APIResponse } from './api';

/**
 * Domain types
 */
export interface GamificationContext {
  userId: string;
  // Add whatever you evaluate achievements against:
  completedTrades?: number;
  completedCourses?: number;
  streakDays?: number;
  referrals?: number;
  creditsEarned?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  color: string | null;
  points: number;
  /**
   * A predicate used to check if this achievement should unlock
   * for the given user context.
   */
  condition: (ctx: GamificationContext) => boolean;
}

export interface UserStats {
  userId: string;
  totalPoints: number;
  badges: string[];
  achievements: string[]; // store achievement ids
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  points: number;
}

/**
 * Example in-memory achievement catalog.
 * In a real app this could come from your API or DB.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Complete your first trade.',
    icon: '🏁',
    color: '#3b82f6',
    points: 50,
    condition: (ctx) => (ctx.completedTrades ?? 0) >= 1,
  },
  {
    id: 'trade_10',
    name: 'Trader Level 1',
    description: 'Complete 10 trades.',
    icon: '📈',
    color: '#10b981',
    points: 150,
    condition: (ctx) => (ctx.completedTrades ?? 0) >= 10,
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Log activity 7 days in a row.',
    icon: '🔥',
    color: '#f59e0b',
    points: 100,
    condition: (ctx) => (ctx.streakDays ?? 0) >= 7,
  },
  {
    id: 'referral_3',
    name: 'Community Builder',
    description: 'Refer 3 friends.',
    icon: '🫶',
    color: '#8b5cf6',
    points: 120,
    condition: (ctx) => (ctx.referrals ?? 0) >= 3,
  },
];

/**
 * Gamification service that talks to your backend through apiService.
 * Adjust endpoints to match your API routes.
 */
export class GamificationService {
  /**
   * Get a user’s current stats (points, badges, unlocked achievements).
   */
  static async getUserStats(userId: string): Promise<APIResponse<UserStats>> {
    return apiService.get(`/api/gamification/stats?userId=${encodeURIComponent(userId)}`);
  }

  /**
   * Award points to a user with an optional reason.
   */
  static async awardPoints(
    userId: string,
    points: number,
    reason?: string
  ): Promise<APIResponse<{ userId: string; totalPoints: number }>> {
    return apiService.post('/api/gamification/points/award', {
      userId,
      points,
      reason,
    });
  }

  /**
   * Mark an achievement unlocked for a user.
   */
  static async unlockAchievement(
    userId: string,
    achievementId: string
  ): Promise<APIResponse<{ unlocked: boolean }>> {
    return apiService.post('/api/gamification/achievements/unlock', {
      userId,
      achievementId,
    });
  }

  /**
   * (Optional) Award a badge to a user.
   */
  static async awardBadge(
    userId: string,
    badgeId: string
  ): Promise<APIResponse<{ badges: string[] }>> {
    return apiService.post('/api/gamification/badges/award', {
      userId,
      badgeId,
    });
  }

  /**
   * Fetch the leaderboard.
   */
  static async getLeaderboard(
    limit = 20
  ): Promise<APIResponse<LeaderboardEntry[]>> {
    return apiService.get(`/api/gamification/leaderboard?limit=${limit}`);
  }

  /**
   * Evaluate the current context for a given user and unlock any new achievements.
   * Also awards the achievement’s points.
   *
   * Returns the list of newly unlocked achievements.
   */
  static async checkAndUnlockAchievements(
    ctx: GamificationContext
  ): Promise<APIResponse<{ unlocked: Achievement[] }>> {
    // ✅ IMPORTANT: Explicitly type the array so it’s not inferred as never[]
    const unlockedAchievements: Achievement[] = [];

    // Get what’s already unlocked so we don’t duplicate
    const currentStats = await this.getUserStats(ctx.userId);
    const alreadyUnlockedIds = new Set(currentStats.data?.achievements ?? []);

    for (const achievement of ACHIEVEMENTS) {
      const isUnlockedAlready = alreadyUnlockedIds.has(achievement.id);
      const shouldUnlock = achievement.condition(ctx);

      if (!isUnlockedAlready && shouldUnlock) {
        // Persist unlock + award points
        await this.unlockAchievement(ctx.userId, achievement.id);
        await this.awardPoints(
          ctx.userId,
          achievement.points,
          `Achievement: ${achievement.name}`
        );

        // ✅ This push is now type-safe because unlockedAchievements is Achievement[]
        unlockedAchievements.push(achievement);
      }
    }

    return {
      success: true,
      data: { unlocked: unlockedAchievements },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        version: '1.0.0',
      },
    };
  }
}