import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  getFastingCurrent,
  getFastingHistory,
  getFastingInsights,
  type FastingInsights,
  type FastingSession,
} from '../services/api';
import { FetchState, STALE_TIME_MS } from '../types/fetchState';

type FastingData = {
  current: FetchState<FastingSession>;
  insights: FetchState<FastingInsights>;
  history: FetchState<FastingSession[]>;
  refreshFasting: (options?: { force?: boolean }) => Promise<void>;
  applyCurrentSession: (session: FastingSession | null) => void;
  refreshInsightsAndHistory: () => Promise<void>;
};

const defaultFetchState = <T,>(): FetchState<T> => ({
  data: null,
  loading: false,
  loadingBackground: false,
  error: null,
  lastFetchedAt: null,
});

const FastingDataContext = createContext<FastingData | undefined>(undefined);

export const FastingDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [current, setCurrent] =
    useState<FetchState<FastingSession>>(defaultFetchState);
  const [insights, setInsights] =
    useState<FetchState<FastingInsights>>(defaultFetchState);
  const [history, setHistory] =
    useState<FetchState<FastingSession[]>>(defaultFetchState);
  const inflightRef = useRef<Promise<void> | null>(null);

  const refreshInsightsAndHistory = useCallback(async () => {
    try {
      const [insightsRes, historyRes] = await Promise.all([
        getFastingInsights(7),
        getFastingHistory({ limit: 5 }),
      ]);
      const fetchedAt = Date.now();
      if (insightsRes.success) {
        setInsights({
          data: insightsRes.data,
          loading: false,
          loadingBackground: false,
          error: null,
          lastFetchedAt: fetchedAt,
        });
      }
      if (historyRes.success) {
        setHistory({
          data: historyRes.data || [],
          loading: false,
          loadingBackground: false,
          error: null,
          lastFetchedAt: fetchedAt,
        });
      }
    } catch {
      // Keep last insights/history on failure (including 429).
    }
  }, []);

  const refreshFasting = useCallback(
    async (options?: { force?: boolean }) => {
      const now = Date.now();
      const isColdStart = !current.lastFetchedAt;

      if (!options?.force && current.lastFetchedAt) {
        const age = now - current.lastFetchedAt;
        if (age < STALE_TIME_MS) {
          return;
        }
      }

      if (!options?.force && inflightRef.current) {
        return inflightRef.current;
      }

      const run = (async () => {
        if (isColdStart) {
          setCurrent(prev => ({ ...prev, loading: true, error: null }));
          setInsights(prev => ({ ...prev, loading: true, error: null }));
          setHistory(prev => ({ ...prev, loading: true, error: null }));
        } else {
          setCurrent(prev => ({
            ...prev,
            loadingBackground: true,
            error: null,
          }));
          setInsights(prev => ({
            ...prev,
            loadingBackground: true,
            error: null,
          }));
          setHistory(prev => ({
            ...prev,
            loadingBackground: true,
            error: null,
          }));
        }

        try {
          const [currentRes, insightsRes, historyRes] = await Promise.all([
            getFastingCurrent(),
            getFastingInsights(7),
            getFastingHistory({ limit: 5 }),
          ]);
          const fetchedAt = Date.now();

          if (currentRes.success) {
            setCurrent({
              data: currentRes.data || null,
              loading: false,
              loadingBackground: false,
              error: null,
              lastFetchedAt: fetchedAt,
            });
          } else {
            setCurrent(prev => ({
              ...prev,
              loading: false,
              loadingBackground: false,
              error: 'Failed to load fasting session',
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
              error: 'Failed to load fasting insights',
            }));
          }

          if (historyRes.success) {
            setHistory({
              data: historyRes.data || [],
              loading: false,
              loadingBackground: false,
              error: null,
              lastFetchedAt: fetchedAt,
            });
          } else {
            setHistory(prev => ({
              ...prev,
              loading: false,
              loadingBackground: false,
              error: 'Failed to load fasting history',
            }));
          }
        } catch (error: unknown) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to refresh fasting data.';
          setCurrent(prev => ({
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
          setHistory(prev => ({
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
    [current.lastFetchedAt],
  );

  const applyCurrentSession = useCallback((session: FastingSession | null) => {
    setCurrent({
      data: session,
      loading: false,
      loadingBackground: false,
      error: null,
      lastFetchedAt: Date.now(),
    });
  }, []);

  const value = useMemo<FastingData>(
    () => ({
      current,
      insights,
      history,
      refreshFasting,
      applyCurrentSession,
      refreshInsightsAndHistory,
    }),
    [
      current,
      insights,
      history,
      refreshFasting,
      applyCurrentSession,
      refreshInsightsAndHistory,
    ],
  );

  return (
    <FastingDataContext.Provider value={value}>
      {children}
    </FastingDataContext.Provider>
  );
};

export const useFastingData = (): FastingData => {
  const ctx = useContext(FastingDataContext);
  if (!ctx) {
    throw new Error('useFastingData must be used within a FastingDataProvider');
  }
  return ctx;
};
