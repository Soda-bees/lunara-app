import { useState, useEffect, useCallback } from 'react';
import {
  getWeeklyNutritionPlan,
  DailyMealPlan,
  WeeklyMealPlanResponse,
} from '../services/api';
import {
  getCachedData,
  setCachedData,
  CacheKeys,
  CacheTTL,
} from '../services/cache';

type WeeklyPlan = {
  isoDate: string;
  label: string;
  isToday: boolean;
  plan: DailyMealPlan | null;
};

const formatDateLabel = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getDayName = (date: Date) => {
  return date.toLocaleDateString(undefined, { weekday: 'long' });
};

interface UseNutritionPlanReturn {
  weeklyPlans: WeeklyPlan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshPlan: (date: string) => Promise<void>;
}

export function useNutritionPlan(): UseNutritionPlanReturn {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeek = useCallback(async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = formatDateLabel(today);

      // Check cache first
      let cachedData: DailyMealPlan[] | null = null;
      if (useCache) {
        cachedData = await getCachedData<DailyMealPlan[]>(
          CacheKeys.weeklyNutritionPlan(startDate),
          CacheTTL.weeklyPlans,
        );
      }

      // If we have cached data, use it immediately
      if (cachedData && cachedData.length > 0) {
        const week: WeeklyPlan[] = cachedData.map((plan, index) => {
          const d = new Date(today);
          d.setDate(today.getDate() + index);
          const isoDate = formatDateLabel(d);

          return {
            isoDate,
            label: getDayName(d),
            isToday: d.getTime() === today.getTime(),
            plan: plan,
          };
        });
        setWeeklyPlans(week);
        setLoading(false);

        // Fetch fresh data in background
        fetchFreshData(startDate);
        return;
      }

      // No cache or cache expired, fetch from API
      await fetchFreshData(startDate);
    } catch (e: any) {
      setError(e?.message || 'Unable to load nutrition plan.');
      setLoading(false);
    }
  }, []);

  const fetchFreshData = async (startDate: string) => {
    try {
      const res = await getWeeklyNutritionPlan(startDate);

      if (!res.success || !res.data || !Array.isArray(res.data)) {
        throw new Error('Invalid response from server');
      }

      // Cache the response
      await setCachedData(
        CacheKeys.weeklyNutritionPlan(startDate),
        res.data,
        CacheTTL.weeklyPlans,
      );

      // Update state
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const week: WeeklyPlan[] = res.data.map((plan, index) => {
        const d = new Date(today);
        d.setDate(today.getDate() + index);
        const isoDate = formatDateLabel(d);

        return {
          isoDate,
          label: getDayName(d),
          isToday: d.getTime() === today.getTime(),
          plan: plan,
        };
      });

      setWeeklyPlans(week);
      setLoading(false);
    } catch (e: any) {
      // Only set error if we don't have cached data
      if (weeklyPlans.length === 0) {
        setError(e?.message || 'Unable to load nutrition plan.');
      }
      setLoading(false);
    }
  };

  const refreshPlan = useCallback(async (date: string) => {
    try {
      // Remove cache for specific date
      await getCachedData(CacheKeys.nutritionPlan(date), 0); // Force expire
      
      // Reload the week (will fetch fresh data)
      await loadWeek(false);
    } catch (e: any) {
      console.error('[useNutritionPlan] Error refreshing plan:', e);
    }
  }, [loadWeek]);

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  return {
    weeklyPlans,
    loading,
    error,
    refetch: () => loadWeek(false),
    refreshPlan,
  };
}
