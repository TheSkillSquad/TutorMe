// src/hooks/use-api.ts

import { useEffect, useState, useCallback } from 'react';
import { apiService } from '@/lib/services';
import type { APIResponse } from '@/lib/api';

/**
 * Generic hook to fetch API data from an endpoint and return loading, error, data, and a refetch function.
 * Usage:
 *   const { data, error, loading, refetch } = useApi<User[]>('/api/users');
 */
export function useApi<T = unknown>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: APIResponse<T> = await apiService.get(endpoint);

      if (response.success) {
        setData(response.data ?? null);
      } else {
        setData(null);
        setError(response.error?.message || 'Unknown error');
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unexpected error';
      setData(null);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      await fetchData();
    })();

    return () => {
      // prevent state updates after unmount
      isMounted = false;
    };
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}