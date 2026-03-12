import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeDay,
  completeChallengeTask,
  getChallengeToday,
  GetChallengeTodayResponse,
} from '../services/api';
import {
  CacheKeys,
  CacheTTL,
  getCachedData,
  setCachedData,
} from '../services/cache';

interface UseChallengeTodayReturn {
  day: ChallengeDay | null;
  loading: boolean;
  error: string | null;
  toggleTask: (taskId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useChallengeToday(
  instanceId: string | null,
): UseChallengeTodayReturn {
  const [day, setDay] = useState<ChallengeDay | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (useCache: boolean = true) => {
      if (!instanceId) return;

      try {
        setLoading(true);
        setError(null);

        let cached: ChallengeDay | null = null;
        if (useCache) {
          cached = await getCachedData<ChallengeDay>(
            CacheKeys.challengeToday(instanceId),
            CacheTTL.dynamicContent,
          );
        }

        if (cached) {
          setDay(cached);
          setLoading(false);
          // Refresh in background
          fetchFresh(instanceId);
          return;
        }

        await fetchFresh(instanceId);
      } catch (e: any) {
        setError(e?.message || 'Unable to load challenge day.');
        setLoading(false);
      }
    },
    [instanceId],
  );

  const fetchFresh = async (id: string) => {
    const res: GetChallengeTodayResponse = await getChallengeToday(id);
    if (!res.success || !res.data) {
      throw new Error('Invalid response from server');
    }

    setDay(res.data);
    await setCachedData(
      CacheKeys.challengeToday(id),
      res.data,
      CacheTTL.dynamicContent,
    );
    setLoading(false);
  };

  const toggleTask = useCallback(
    async (taskId: string) => {
      if (!instanceId || !day) return;

      // Optimistic update
      const prev = day;
      const updatedTasks = prev.tasks.map(task =>
        task._id === taskId ? { ...task, completed: !task.completed } : task,
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const optimistic: ChallengeDay = {
        ...prev,
        tasks: updatedTasks,
        progress: {
          completed: completedCount,
          total: prev.progress.total,
        },
      };
      setDay(optimistic);

      try {
        setLoading(true);
        const res = await completeChallengeTask(instanceId, taskId);
        if (!res.success || !res.data) {
          throw new Error('Failed to update task');
        }

        // Refetch latest day state from server
        await load(false);
      } catch (e: any) {
        setError(e?.message || 'Unable to update task.');
        // Revert on error
        setDay(prev);
        setLoading(false);
      }
    },
    [instanceId, day, load],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    day,
    loading,
    error,
    toggleTask,
    refetch: () => load(false),
  };
}

