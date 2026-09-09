import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { DeviceEventEmitter } from 'react-native';
import {
  getAllChallenges,
  getCurrentCycleStatus,
  getFastingInsights,
  getMe,
  getSleepStatistics,
  type MeUser,
} from '../services/api';
import { STALE_TIME_MS } from '../types/fetchState';
import { useCycleData } from './CycleDataContext';
import { useSleepData } from './SleepDataContext';
import {
  EMPTY_PROFILE_STATS,
  EMPTY_STAT_FLAGS,
  mapProfileStats,
  type ProfileStatEmptyFlags,
  type ProfileStats,
} from '../utils/profileStats';

type ProfileContextValue = {
  user: MeUser | null;
  stats: ProfileStats;
  statEmptyFlags: ProfileStatEmptyFlags;
  loading: boolean;
  refreshing: boolean;
  refreshProfile: () => Promise<void>;
  applyUser: (user: MeUser) => void;
  clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { cycleStatus } = useCycleData();
  const { statistics: sleepStatistics } = useSleepData();
  const [user, setUser] = useState<MeUser | null>(null);
  const [stats, setStats] = useState<ProfileStats>(EMPTY_PROFILE_STATS);
  const [statEmptyFlags, setStatEmptyFlags] =
    useState<ProfileStatEmptyFlags>(EMPTY_STAT_FLAGS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const userRef = useRef<MeUser | null>(null);
  const statsRef = useRef<ProfileStats>(EMPTY_PROFILE_STATS);
  const flagsRef = useRef<ProfileStatEmptyFlags>(EMPTY_STAT_FLAGS);
  const inflightRef = useRef<Promise<void> | null>(null);
  const lastFetchedAtRef = useRef<number | null>(null);
  userRef.current = user;
  statsRef.current = stats;
  flagsRef.current = statEmptyFlags;

  const applyUser = useCallback((next: MeUser) => {
    userRef.current = next;
    setUser(next);
  }, []);

  const clearProfile = useCallback(() => {
    userRef.current = null;
    setUser(null);
    setStats(EMPTY_PROFILE_STATS);
    setStatEmptyFlags(EMPTY_STAT_FLAGS);
    setLoading(false);
    setRefreshing(false);
    lastFetchedAtRef.current = null;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (inflightRef.current) {
      return inflightRef.current;
    }

    const hasCache = userRef.current != null;
    const lastFetchedAt = lastFetchedAtRef.current;
    if (lastFetchedAt != null && Date.now() - lastFetchedAt < STALE_TIME_MS) {
      return;
    }

    if (hasCache) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const run = (async () => {
      try {
        const [meRes, cycleRes, fastingRes, challengesRes, sleepRes] =
          await Promise.allSettled([
            getMe(),
            getCurrentCycleStatus(),
            getFastingInsights(7),
            getAllChallenges(),
            getSleepStatistics(),
          ]);

        if (
          meRes.status === 'fulfilled' &&
          meRes.value.success &&
          meRes.value.user
        ) {
          applyUser(meRes.value.user);
        }

        const cycle =
          cycleRes.status === 'fulfilled' && cycleRes.value.success
            ? cycleRes.value.data
            : cycleStatus.data;
        const sleep =
          sleepRes.status === 'fulfilled' && sleepRes.value.success
            ? sleepRes.value.data
            : sleepStatistics.data;
        const fasting =
          fastingRes.status === 'fulfilled' && fastingRes.value.success
            ? fastingRes.value.data
            : null;
        const challenges =
          challengesRes.status === 'fulfilled' && challengesRes.value.success
            ? challengesRes.value.data
            : null;

        const mapped = mapProfileStats(
          { cycle, sleep, fasting, challenges },
          statsRef.current,
          flagsRef.current,
        );
        setStats(mapped.stats);
        setStatEmptyFlags(mapped.flags);
        lastFetchedAtRef.current = Date.now();
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();

    inflightRef.current = run;
    try {
      await run;
    } finally {
      inflightRef.current = null;
    }
  }, [applyUser, cycleStatus.data, sleepStatistics.data]);

  useEffect(() => {
    if (!cycleStatus.data && !sleepStatistics.data) {
      return;
    }
    const mapped = mapProfileStats(
      { cycle: cycleStatus.data, sleep: sleepStatistics.data },
      statsRef.current,
      flagsRef.current,
    );
    setStats(mapped.stats);
    setStatEmptyFlags(mapped.flags);
  }, [cycleStatus.data, sleepStatistics.data]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('session_expired', () => {
      clearProfile();
    });
    return () => sub.remove();
  }, [clearProfile]);

  const value = useMemo(
    () => ({
      user,
      stats,
      statEmptyFlags,
      loading,
      refreshing,
      refreshProfile,
      applyUser,
      clearProfile,
    }),
    [
      user,
      stats,
      statEmptyFlags,
      loading,
      refreshing,
      refreshProfile,
      applyUser,
      clearProfile,
    ],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return ctx;
}
