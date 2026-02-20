import { useState, useEffect, useCallback } from 'react';
import {
  getDailyWorkoutPlan,
  logWorkoutApi,
  DailyWorkoutPlan,
  DailyWorkoutPlanResponse,
  LogWorkoutResponse,
} from '../services/api';
import {
  getCachedData,
  setCachedData,
  CacheKeys,
  CacheTTL,
} from '../services/cache';

interface UseWorkoutPlanReturn {
  plan: DailyWorkoutPlan | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  logWorkout: (workoutId: string, action?: 'add' | 'remove') => Promise<void>;
}

export function useWorkoutPlan(date?: string): UseWorkoutPlanReturn {
  const [plan, setPlan] = useState<DailyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = useCallback(async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const today = date || new Date().toISOString().split('T')[0];

      // Check cache first
      let cachedData: DailyWorkoutPlan | null = null;
      if (useCache) {
        cachedData = await getCachedData<DailyWorkoutPlan>(
          CacheKeys.workoutPlan(today),
          CacheTTL.plans,
        );
      }

      // If we have cached data, use it immediately
      if (cachedData) {
        setPlan(cachedData);
        setLoading(false);

        // Fetch fresh data in background
        fetchFreshData(today);
        return;
      }

      // No cache or cache expired, fetch from API
      await fetchFreshData(today);
    } catch (e: any) {
      setError(e?.message || 'Unable to load workout plan.');
      setLoading(false);
    }
  }, [date]);

  const fetchFreshData = async (targetDate: string) => {
    try {
      const res = await getDailyWorkoutPlan(targetDate);

      if (!res.success || !res.data) {
        throw new Error('Invalid response from server');
      }

      // Cache the response
      await setCachedData(
        CacheKeys.workoutPlan(targetDate),
        res.data,
        CacheTTL.plans,
      );

      setPlan(res.data);
      setLoading(false);
    } catch (e: any) {
      // Only set error if we don't have cached data
      if (!plan) {
        setError(e?.message || 'Unable to load workout plan.');
      }
      setLoading(false);
    }
  };

  const logWorkout = useCallback(async (
    workoutId: string,
    action: 'add' | 'remove' = 'add',
  ) => {
    try {
      const today = date || new Date().toISOString().split('T')[0];
      const res = await logWorkoutApi(today, workoutId, action);

      if (res.success && res.data) {
        // Invalidate cache and refetch
        await loadPlan(false);
      } else {
        throw new Error('Failed to log workout');
      }
    } catch (e: any) {
      setError(e?.message || 'Unable to log workout.');
      throw e; // Re-throw so caller can handle
    }
  }, [date, loadPlan]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  return {
    plan,
    loading,
    error,
    refetch: () => loadPlan(false),
    logWorkout,
  };
}
