// src/lib/services.ts

// Core API Integrations Implementation

import type { APIResponse } from './api';

/**
 * Internal helper to perform a fetch and parse the JSON response.
 * It assumes your API returns the standard { success, data, error, metadata } envelope.
 */
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const res = await fetch(url, {
      // include credentials or headers here if your app needs them
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    // Attempt to parse JSON. If it fails, throw to the catch block.
    const json = (await res.json()) as APIResponse<T>;

    // If your backend sometimes returns non-envelope shapes,
    // you can normalize them here before returning.
    return json;
  } catch (err) {
    // Network/parse error fallback in standard envelope
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message:
          err instanceof Error ? err.message : 'Network or parsing error',
        details: err,
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: `req_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 10)}`,
        version: '1.0.0',
      },
    };
  }
}

/**
 * A simple API client with typed helpers.
 * Usage:
 *   const users = await apiService.get<User[]>('/api/users');
 */
export const apiService = {
  get<T = unknown>(url: string): Promise<APIResponse<T>> {
    return request<T>(url, { method: 'GET' });
  },

  post<T = unknown, B = unknown>(
    url: string,
    body?: B
  ): Promise<APIResponse<T>> {
    return request<T>(url, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T = unknown, B = unknown>(
    url: string,
    body?: B
  ): Promise<APIResponse<T>> {
    return request<T>(url, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T = unknown, B = unknown>(
    url: string,
    body?: B
  ): Promise<APIResponse<T>> {
    return request<T>(url, {
      method: 'DELETE',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
};