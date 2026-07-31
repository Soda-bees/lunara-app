import { useState, useEffect, useCallback } from 'react';
import { DailyMealPlan, regenerateNutritionPlan } from '../services/api';
import {
  fetchWeeklyNutritionPlansForWeek,
  getMondayOfWeek,
  toLocalYyyyMmDd,
  weeklyPlanRowsForNutritionUi,
  type WeeklyPlanningStatus,
} from '../utils/weeklyNutritionDisplay';
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

type CachedNutritionWeek = {
  data: DailyMealPlan[];
  planningStatus: WeeklyPlanningStatus;
  weekKey: string;
};

interface UseNutritionPlanReturn {
  weeklyPlans: WeeklyPlan[];
  planningStatus: WeeklyPlanningStatus;
  hasWeeklyPlan: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refreshPlan: (date: string) => Promise<void>;
}

export function useNutritionPlan(): UseNutritionPlanReturn {
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [planningStatus, setPlanningStatus] =
    useState<WeeklyPlanningStatus>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback(
    (data: DailyMealPlan[], status: WeeklyPlanningStatus, weekKey: string) => {
      setPlanningStatus(status);
      const week = weeklyPlanRowsForNutritionUi(data, weekKey);
      setWeeklyPlans(week);
    },
    [],
  );

  const fetchFreshData = useCallback(
    async (startDate: string) => {
      const result = await fetchWeeklyNutritionPlansForWeek(startDate);

      await setCachedData(
        CacheKeys.weeklyNutritionPlan(startDate),
        {
          data: result.data,
          planningStatus: result.planningStatus,
          weekKey: result.weekKey,
        } satisfies CachedNutritionWeek,
        CacheTTL.weeklyPlans,
      );

      applyResult(result.data, result.planningStatus, result.weekKey);
      setLoading(false);
    },
    [applyResult],
  );

  const loadWeek = useCallback(
    async (useCache: boolean = true) => {
      try {
        setLoading(true);
        setError(null);

        const monday = getMondayOfWeek();
        const startDate = toLocalYyyyMmDd(monday);

        if (useCache) {
          const cached = await getCachedData<CachedNutritionWeek>(
            CacheKeys.weeklyNutritionPlan(startDate),
            CacheTTL.weeklyPlans,
          );

          if (cached) {
            applyResult(
              cached.data,
              cached.planningStatus,
              cached.weekKey || startDate,
            );
            setLoading(false);
            fetchFreshData(startDate).catch(() => {});
            return;
          }
        }

        await fetchFreshData(startDate);
      } catch (e: any) {
        setError(e?.message || 'Unable to load nutrition plan.');
        setLoading(false);
      }
    },
    [applyResult, fetchFreshData],
  );

  const refreshPlan = useCallback(
    async (date: string) => {
      try {
        // MOB-021: force rebuild via POST regenerate (not GET forceRegenerate).
        await regenerateNutritionPlan({ date });
        await loadWeek(false);
      } catch (e: any) {
        console.error('[useNutritionPlan] Error refreshing plan:', e);
      }
    },
    [loadWeek],
  );

  useEffect(() => {
    loadWeek();
  }, [loadWeek]);

  return {
    weeklyPlans,
    planningStatus,
    hasWeeklyPlan: planningStatus === 'generated',
    loading,
    error,
    refetch: () => loadWeek(false),
    refreshPlan,
  };
}
