import { useState, useEffect, useCallback } from 'react';
import {
  getDailyWorkoutPlan,
  regenerateWorkoutPlan,
  logWorkoutApi,
  DailyWorkoutPlan,
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
  /** Force-rebuild plan via POST /workouts/plan/regenerate (MOB-021). */
  regenerate: () => Promise<void>;
  logWorkout: (
    workoutId?: string,
    action?: 'add' | 'remove',
    durationMinutes?: number,
    loggedEntryId?: string,
  ) => Promise<void>;
}

export function useWorkoutPlan(date?: string): UseWorkoutPlanReturn {
  const [plan, setPlan] = useState<DailyWorkoutPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date().toISOString().split('T')[0];

  const loadPlan = useCallback(async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      let cachedData: DailyWorkoutPlan | null = null;
      if (useCache) {
        cachedData = await getCachedData<DailyWorkoutPlan>(
          CacheKeys.workoutPlan(targetDate),
          CacheTTL.plans,
        );
      }

      // If we have cached data, use it immediately
      if (cachedData) {
        setPlan(cachedData);
        setLoading(false);
        return;
      }

      // No cache or cache expired, fetch from API
      await fetchFreshData(targetDate);
    } catch (e: any) {
      setError(e?.message || 'Unable to load workout plan.');
      setLoading(false);
    }
  }, [targetDate]);

  const fetchFreshData = async (day: string) => {
    try {
      const res = await getDailyWorkoutPlan(day);

      if (!res.success || !res.data) {
        throw new Error('Invalid response from server');
      }

      // Cache the response
      await setCachedData(
        CacheKeys.workoutPlan(day),
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

  const regenerate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // MOB-021: force rebuild via POST (not GET forceRegenerate).
      const res = await regenerateWorkoutPlan({ date: targetDate });
      if (!res.success || !res.data) {
        throw new Error('Invalid response from server');
      }
      await setCachedData(
        CacheKeys.workoutPlan(targetDate),
        res.data,
        CacheTTL.plans,
      );
      setPlan(res.data);
      setLoading(false);
    } catch (e: any) {
      setError(e?.message || 'Unable to regenerate workout plan.');
      setLoading(false);
      throw e;
    }
  }, [targetDate]);

  const logWorkout = useCallback(async (
    workoutId?: string,
    action: 'add' | 'remove' = 'add',
    durationMinutes?: number,
    loggedEntryId?: string,
  ) => {
    try {
      const res = await logWorkoutApi(
        targetDate,
        workoutId,
        action,
        durationMinutes,
        loggedEntryId,
      );

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
  }, [targetDate, loadPlan]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  return {
    plan,
    loading,
    error,
    refetch: () => loadPlan(false),
    regenerate,
    logWorkout,
  };
}
