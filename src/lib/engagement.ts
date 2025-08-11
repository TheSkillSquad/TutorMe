// src/lib/engagement.ts

// Community & Engagement API Services

// ✅ Import from ./services (NOT ./api) to avoid circular imports
import { apiService } from './services';

// (Optional) If you want response typing, you can import the shared envelope:
import type { APIResponse } from './api';

// ==============================
// Push Notifications
// ==============================

export async function subscribeToPush(
  topic: string,
  token: string
): Promise<APIResponse<any>> {
  return apiService.post('/api/engagement/push/subscribe', { topic, token });
}

export async function unsubscribeFromPush(
  topic: string,
  token: string
): Promise<APIResponse<any>> {
  return apiService.post('/api/engagement/push/unsubscribe', { topic, token });
}

// ==============================
// In-App Notifications
// ==============================

export async function fetchNotifications(
  userId: string
): Promise<APIResponse<any>> {
  return apiService.get(
    `/api/engagement/notifications?userId=${encodeURIComponent(userId)}`
  );
}

export async function markNotificationRead(
  notificationId: string
): Promise<APIResponse<any>> {
  return apiService.post('/api/engagement/notifications/read', { notificationId });
}

// ==============================
// Messaging / Chat helpers (examples)
// ==============================

export async function sendMessage(
  threadId: string,
  text: string
): Promise<APIResponse<any>> {
  return apiService.post('/api/engagement/messages/send', { threadId, text });
}

export async function fetchThread(
  threadId: string
): Promise<APIResponse<any>> {
  return apiService.get(
    `/api/engagement/messages/thread?threadId=${encodeURIComponent(threadId)}`
  );
}