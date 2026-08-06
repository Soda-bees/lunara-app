import React, { createContext, useCallback, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  Sleep,
  SleepStatisticsResponse,
  SleepPatternsResponse,
  SleepInsightsResponse,
  getSleepLogs,
  getSleepStatistics,
  getSleepPatternsByPhase,
  getSleepInsights,
  getDefaultAnalyticsDateRange,
} from '../services/api';
import { FetchState, STALE_TIME_MS } from '../types/fetchState';
import {
  loadSleepStatisticsSnapshot,
  saveSleepStatisticsSnapshot,
} from '../utils/contextSnapshotStorage';

type SleepData = {
  statistics: FetchState<SleepStatisticsResponse['data']>;
  patterns: FetchState<SleepPatternsResponse['data']>;
  logs: FetchState<Sleep[]>;
  insights: FetchState<string[]>;
  refreshSleepData: (options?: { force?: boolean }) => Promise<void>;
  applySleepLogMutation: (updater: (draft: Sleep[]) => Sleep[]) => void;
};

const defaultFetchState = <T,>(): FetchState<T> => ({
  data: null,
  loading: false,
  loadingBackground: false,
  error: null,
  lastFetchedAt: null,
});

const SleepDataContext = createContext<SleepData | undefined>(undefined);

/**
 * Bootstrap (MOB-016): Provider may start an initial refresh when empty.
 * Splash also calls refreshSleepData() without force — STALE_TIME_MS and
 * in-flight dedupe prevent a second full analytics pack. Use { force: true }
 * only for pull-to-refresh / explicit user refresh.
 *
 * MOB-031: hydrate sleep statistics snapshot before revalidate (stats only).
 */
export const SleepDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [statistics, setStatistics] =
    useState<FetchState<SleepStatisticsResponse['data']>>(defaultFetchState);
  const [patterns, setPatterns] =
    useState<FetchState<SleepPatternsResponse['data']>>(defaultFetchState);
  const [logs, setLogs] = useState<FetchState<Sleep[]>>(defaultFetchState);
  const [insights, setInsights] =
    useState<FetchState<string[]>>(defaultFetchState);
  const inflightRef = useRef<Promise<void> | null>(null);
  /** True after a disk snapshot was applied — first refresh should be background. */
  const hasStatsSnapshotRef = useRef(false);

  const refreshSleepData = useCallback(
    async (options?: { force?: boolean }) => {
      const now = Date.now();
      const isColdStart =
        !hasStatsSnapshotRef.current &&
        !statistics.data &&
        !logs.data &&
        !patterns.data &&
        !insights.data;

      if (!options?.force && statistics.lastFetchedAt) {
        const age = now - statistics.lastFetchedAt;
        if (age < STALE_TIME_MS) {
          return;
        }
      }

      // Join in-flight refresh instead of starting a duplicate pack (MOB-016).
      if (!options?.force && inflightRef.current) {
        return inflightRef.current;
      }

      const run = (async () => {
      if (isColdStart) {
        setStatistics(prev => ({ ...prev, loading: true, error: null }));
        setLogs(prev => ({ ...prev, loading: true, error: null }));
        setPatterns(prev => ({ ...prev, loading: true, error: null }));
        setInsights(prev => ({ ...prev, loading: true, error: null }));
      } else {
        setStatistics(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
        setLogs(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
        setPatterns(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
        setInsights(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
      }

      try {
        // Explicit 90-day window matches backend PERF-002 default (MOB-015).
        const analyticsRange = getDefaultAnalyticsDateRange();
        const [statsRes, logsRes, patternsRes, insightsRes] = await Promise.all(
          [
            getSleepStatistics(analyticsRange),
            getSleepLogs(),
            getSleepPatternsByPhase(analyticsRange),
            getSleepInsights(analyticsRange),
          ],
        );

        const fetchedAt = Date.now();

        if (statsRes.success) {
          setStatistics({
            data: statsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
          if (statsRes.data) {
            void saveSleepStatisticsSnapshot(statsRes.data, fetchedAt);
          }
        } else {
          setStatistics(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load sleep statistics',
          }));
        }

        if (logsRes.success) {
          setLogs({
            data: logsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setLogs(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load sleep logs',
          }));
        }

        if (patternsRes.success) {
          setPatterns({
            data: patternsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setPatterns(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load sleep patterns',
          }));
        }

        if (insightsRes.success) {
          setInsights({
            data: insightsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setInsights(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load sleep insights',
          }));
        }
      } catch (error: any) {
        const message =
          error?.message || 'Failed to refresh sleep data. Please try again.';
        setStatistics(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
        setLogs(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
        setPatterns(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
        setInsights(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
      }
      })();

      inflightRef.current = run;
      try {
        await run;
      } finally {
        if (inflightRef.current === run) {
          inflightRef.current = null;
        }
      }
    },
    [statistics.data, statistics.lastFetchedAt, logs.data, patterns.data, insights.data],
  );

  const applySleepLogMutation = useCallback(
    (updater: (draft: Sleep[]) => Sleep[]) => {
      setLogs(prev => {
        const current = prev.data || [];
        const updated = updater(current);
        return {
          ...prev,
          data: updated,
        };
      });
    },
    [],
  );

  // MOB-031: hydrate statistics snapshot, then revalidate (SWR).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const snap = await loadSleepStatisticsSnapshot<
        SleepStatisticsResponse['data']
      >();
      if (cancelled) return;
      if (snap?.data) {
        hasStatsSnapshotRef.current = true;
        setStatistics({
          data: snap.data,
          loading: false,
          loadingBackground: false,
          error: null,
          lastFetchedAt: snap.savedAt,
        });
      }
      if (!cancelled) {
        await refreshSleepData({ force: true });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const value = useMemo<SleepData>(
    () => ({
      statistics,
      patterns,
      logs,
      insights,
      refreshSleepData,
      applySleepLogMutation,
    }),
    [
      statistics,
      patterns,
      logs,
      insights,
      refreshSleepData,
      applySleepLogMutation,
    ],
  );

  return (
    <SleepDataContext.Provider value={value}>
      {children}
    </SleepDataContext.Provider>
  );
};

export const useSleepData = (): SleepData => {
  const ctx = useContext(SleepDataContext);
  if (!ctx) {
    throw new Error('useSleepData must be used within a SleepDataProvider');
  }
  return ctx;
};
