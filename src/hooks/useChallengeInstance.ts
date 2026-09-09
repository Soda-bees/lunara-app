import { useCallback, useEffect, useState } from 'react';
import {
  ChallengeListItem,
  Challenge,
  GetAllChallengesResponse,
  getAllChallenges,
  getChallengeDetail,
  getChallengeProgress,
  GetChallengeProgressResponse,
  startChallenge,
  StartChallengeResponse,
} from '../services/api';
import {
  CacheKeys,
  CacheTTL,
  getCachedData,
  removeCachedData,
  setCachedData,
} from '../services/cache';

export interface ChallengeInstanceState {
  challenge: Challenge | null;
  instanceId: string | null;
  progress: GetChallengeProgressResponse['data'] | null;
}

interface UseChallengeInstanceReturn {
  state: ChallengeInstanceState;
  loading: boolean;
  error: string | null;
  startOrResume: (challengeId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useChallengeInstance(
  challengeId: string | null,
  initialInstanceId?: string | null,
): UseChallengeInstanceReturn {
  const [state, setState] = useState<ChallengeInstanceState>({
    challenge: null,
    instanceId: initialInstanceId || null,
    progress: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!challengeId && !state.instanceId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // If we only have challengeId, fetch challenge detail
      if (challengeId && !state.instanceId) {
        const cachedChallenge = await getCachedData<Challenge>(
          CacheKeys.challengeDetail(challengeId),
          CacheTTL.dynamicContent,
        );

        if (cachedChallenge) {
          setState(prev => ({
            ...prev,
            challenge: cachedChallenge,
          }));
        } else {
          const res = await getChallengeDetail(challengeId);
          if (res.success && res.data) {
            setState(prev => ({
              ...prev,
              challenge: res.data,
            }));
            await setCachedData(
              CacheKeys.challengeDetail(challengeId),
              res.data,
              CacheTTL.dynamicContent,
            );
          }
        }
      }

      // If we have an instance, fetch progress
      if (state.instanceId) {
        const progressRes = await getChallengeProgress(state.instanceId);
        if (progressRes.success && progressRes.data) {
          setState(prev => ({
            ...prev,
            progress: progressRes.data,
          }));
        }
      }

      setLoading(false);
    } catch (e: any) {
      setError(e?.message || 'Unable to load challenge.');
      setLoading(false);
    }
  }, [challengeId, state.instanceId]);

  const startOrResume = useCallback(
    async (targetChallengeId: string) => {
      try {
        setLoading(true);
        setError(null);

        const res: StartChallengeResponse = await startChallenge(
          targetChallengeId,
        );

        if (!res.success || !res.data) {
          throw new Error('Unable to start challenge');
        }

        const { instanceId, challenge, startDate } = res.data;

        setState({
          challenge,
          instanceId,
          progress: {
            currentDay: 1,
            totalDays: challenge.duration,
            streak: 0,
            completionPercentage: 0,
            status: 'active',
          },
        });

        await setCachedData(
          CacheKeys.challengeDetail(targetChallengeId),
          challenge,
          CacheTTL.dynamicContent,
        );

        await setCachedData(
          CacheKeys.challengeInstance(instanceId),
          { challengeId: targetChallengeId, startDate },
          CacheTTL.plans,
        );

        const listKey = CacheKeys.challengeList();
        const cachedList = await getCachedData<ChallengeListItem[]>(
          listKey,
          CacheTTL.dynamicContent,
        );
        if (cachedList && cachedList.length > 0) {
          const updatedList = cachedList.map(item =>
            item.id === targetChallengeId
              ? {
                  ...item,
                  userInstance: {
                    id: instanceId,
                    status: 'active' as const,
                    currentDay: 1,
                    streak: 0,
                    progress: 0,
                  },
                }
              : item,
          );
          await setCachedData(listKey, updatedList, CacheTTL.dynamicContent);
        } else {
          await removeCachedData(listKey);
        }

        setLoading(false);
      } catch (e: any) {
        setError(e?.message || 'Unable to start challenge.');
        setLoading(false);
        throw e;
      }
    },
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    state,
    loading,
    error,
    startOrResume,
    refetch: load,
  };
}

export async function getChallengesWithStatus(
  options?: { force?: boolean },
): Promise<ChallengeListItem[]> {
  if (!options?.force) {
    const cached = await getCachedData<ChallengeListItem[]>(
      CacheKeys.challengeList(),
      CacheTTL.dynamicContent,
    );

    if (cached && cached.length > 0) {
      return cached;
    }
  }

  const res: GetAllChallengesResponse = await getAllChallenges();
  if (res.success && Array.isArray(res.data)) {
    await setCachedData(
      CacheKeys.challengeList(),
      res.data,
      CacheTTL.dynamicContent,
    );
    return res.data;
  }

  const fallback = await getCachedData<ChallengeListItem[]>(
    CacheKeys.challengeList(),
    CacheTTL.dynamicContent,
  );
  return fallback && fallback.length > 0 ? fallback : [];
}

