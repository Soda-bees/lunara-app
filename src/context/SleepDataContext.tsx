import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
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

  const refreshSleepData = useCallback(
    async (options?: { force?: boolean }) => {
      const now = Date.now();
      const isColdStart =
        !statistics.data && !logs.data && !patterns.data && !insights.data;

      if (!options?.force && statistics.lastFetchedAt) {
        const age = now - statistics.lastFetchedAt;
        if (age < STALE_TIME_MS) {
          return;
        }
      }

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

  // Auto-initialize data on mount if it doesn't exist
  useEffect(() => {
    const hasNoData =
      !statistics.data && !logs.data && !patterns.data && !insights.data;
    if (hasNoData && !statistics.loading) {
      refreshSleepData({ force: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <SleepDataContext.Provider
      value={{
        statistics,
        patterns,
        logs,
        insights,
        refreshSleepData,
        applySleepLogMutation,
      }}
    >
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

