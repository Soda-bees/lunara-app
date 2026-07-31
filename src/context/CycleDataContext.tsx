import React, { createContext, useCallback, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  CycleStatusResponse,
  Period,
  PeriodAnalyticsResponse,
  getCurrentCycleStatus,
  getPeriods,
  getPeriodAnalytics,
} from '../services/api';
import { FetchState, STALE_TIME_MS } from '../types/fetchState';

type CycleData = {
  cycleStatus: FetchState<CycleStatusResponse['data']>;
  periods: FetchState<Period[]>;
  analytics: FetchState<PeriodAnalyticsResponse['data']>;
  refreshCycleData: (options?: { force?: boolean }) => Promise<void>;
  applyCycleMutation: (updater: (draft: Period[]) => Period[]) => void;
};

const defaultFetchState = <T,>(): FetchState<T> => ({
  data: null,
  loading: false,
  loadingBackground: false,
  error: null,
  lastFetchedAt: null,
});

const CycleDataContext = createContext<CycleData | undefined>(undefined);

/**
 * Bootstrap (MOB-016): Provider may start an initial refresh when empty.
 * Splash also calls refreshCycleData() without force — STALE_TIME_MS and
 * in-flight dedupe prevent a second full analytics pack. Use { force: true }
 * only for pull-to-refresh / explicit user refresh.
 */
export const CycleDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cycleStatus, setCycleStatus] =
    useState<FetchState<CycleStatusResponse['data']>>(defaultFetchState);
  const [periods, setPeriods] = useState<FetchState<Period[]>>(
    defaultFetchState,
  );
  const [analytics, setAnalytics] =
    useState<FetchState<PeriodAnalyticsResponse['data']>>(defaultFetchState);
  const inflightRef = useRef<Promise<void> | null>(null);

  const refreshCycleData = useCallback(
    async (options?: { force?: boolean }) => {
      const now = Date.now();
      const isColdStart =
        !cycleStatus.data && !periods.data && !analytics.data;

      if (!options?.force && cycleStatus.lastFetchedAt) {
        const age = now - cycleStatus.lastFetchedAt;
        if (age < STALE_TIME_MS) {
          return;
        }
      }

      // Join in-flight refresh instead of starting a duplicate pack (MOB-016).
      if (!options?.force && inflightRef.current) {
        return inflightRef.current;
      }

      const run = (async () => {
      // Set loading flags
      if (isColdStart) {
        setCycleStatus(prev => ({ ...prev, loading: true, error: null }));
        setPeriods(prev => ({ ...prev, loading: true, error: null }));
        setAnalytics(prev => ({ ...prev, loading: true, error: null }));
      } else {
        setCycleStatus(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
        setPeriods(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
        setAnalytics(prev => ({
          ...prev,
          loadingBackground: true,
          error: null,
        }));
      }

      try {
        const [statusRes, periodsRes, analyticsRes] = await Promise.all([
          getCurrentCycleStatus(),
          getPeriods(1, 50),
          getPeriodAnalytics(),
        ]);

        const fetchedAt = Date.now();

        if (statusRes.success) {
          setCycleStatus({
            data: statusRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setCycleStatus(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load cycle status',
          }));
        }

        if (periodsRes.success) {
          setPeriods({
            data: periodsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setPeriods(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load periods',
          }));
        }

        if (analyticsRes.success && analyticsRes.data) {
          setAnalytics({
            data: analyticsRes.data,
            loading: false,
            loadingBackground: false,
            error: null,
            lastFetchedAt: fetchedAt,
          });
        } else {
          setAnalytics(prev => ({
            ...prev,
            loading: false,
            loadingBackground: false,
            error: 'Failed to load analytics',
          }));
        }
      } catch (error: any) {
        const message =
          error?.message || 'Failed to refresh cycle data. Please try again.';
        setCycleStatus(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
        setPeriods(prev => ({
          ...prev,
          loading: false,
          loadingBackground: false,
          error: message,
        }));
        setAnalytics(prev => ({
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
    [cycleStatus.data, cycleStatus.lastFetchedAt, periods.data, analytics.data],
  );

  const applyCycleMutation = useCallback(
    (updater: (draft: Period[]) => Period[]) => {
      setPeriods(prev => {
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

  // Initial load when empty — no force so splash can join via inflight/stale (MOB-016).
  useEffect(() => {
    const hasNoData =
      !cycleStatus.data && !periods.data && !analytics.data;
    if (hasNoData && !cycleStatus.loading) {
      refreshCycleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const value = useMemo<CycleData>(
    () => ({
      cycleStatus,
      periods,
      analytics,
      refreshCycleData,
      applyCycleMutation,
    }),
    [cycleStatus, periods, analytics, refreshCycleData, applyCycleMutation],
  );

  return (
    <CycleDataContext.Provider value={value}>
      {children}
    </CycleDataContext.Provider>
  );
};

export const useCycleData = (): CycleData => {
  const ctx = useContext(CycleDataContext);
  if (!ctx) {
    throw new Error('useCycleData must be used within a CycleDataProvider');
  }
  return ctx;
};

