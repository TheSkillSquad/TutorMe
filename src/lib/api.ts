// src/lib/api.ts

import { TradeRequestPayload } from '@/types';

/**
 * Standard API envelope used across the app.
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Send a trade request to the backend.
 * NOTE: This file intentionally DOES NOT export `apiService` to avoid circular imports.
 */
export async function sendTradeRequest(
  data: TradeRequestPayload
): Promise<APIResponse<any>> {
  const res = await fetch('/api/trades', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  // Assuming your API returns the APIResponse<T> envelope
  return res.json();
}