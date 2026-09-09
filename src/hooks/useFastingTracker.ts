import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFastingData } from '../context/FastingDataContext';
import {
  endFastingSession,
  startFastingSession,
  type FastingSession,
} from '../services/api';

const getElapsedSeconds = (session: FastingSession | null): number => {
  if (!session) return 0;
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / 1000);
};

export const formatFastingTimer = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export function useFastingTracker() {
  const {
    current,
    refreshFasting,
    applyCurrentSession,
    refreshInsightsAndHistory,
  } = useFastingData();
  const currentSession = current.data;
  const [loading, setLoading] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(
    async (options?: { force?: boolean }) => {
      await refreshFasting(options);
    },
    [refreshFasting],
  );

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (currentSession?.status === 'active') {
      interval = setInterval(() => {
        setTick(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession?._id, currentSession?.status]);

  const isFasting =
    !!currentSession && currentSession.status === 'active';

  const elapsedSeconds = useMemo(
    () => getElapsedSeconds(currentSession),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentSession?._id,
      currentSession?.startTime,
      currentSession?.endTime,
      currentSession?.status,
      tick,
    ],
  );

  const targetMinutes = currentSession?.targetDurationMinutes;

  const progress = useMemo(() => {
    if (!targetMinutes || !isFasting) return 0;
    const p = elapsedSeconds / (targetMinutes * 60);
    return Math.min(Math.max(p, 0), 1);
  }, [elapsedSeconds, targetMinutes, isFasting]);

  const openStartFlow = useCallback(() => {
    setShowGoalEditor(true);
  }, []);

  const closeGoalEditor = useCallback(() => {
    setShowGoalEditor(false);
  }, []);

  const startWithGoal = useCallback(
    async (targetDurationMinutes: number) => {
      try {
        setLoading(true);
        const res = await startFastingSession({
          customDurationMinutes: targetDurationMinutes,
        });
        if (res.success && res.data) {
          applyCurrentSession(res.data);
          setShowGoalEditor(false);
          await refreshInsightsAndHistory();
        }
      } finally {
        setLoading(false);
      }
    },
    [applyCurrentSession, refreshInsightsAndHistory],
  );

  const endFast = useCallback(async () => {
    try {
      setLoading(true);
      const res = await endFastingSession({});
      if (res.success && res.data) {
        applyCurrentSession(res.data);
        await refreshInsightsAndHistory();
      }
    } finally {
      setLoading(false);
    }
  }, [applyCurrentSession, refreshInsightsAndHistory]);

  return {
    currentSession,
    isFasting,
    elapsedSeconds,
    elapsedLabel: formatFastingTimer(elapsedSeconds),
    targetMinutes,
    progress,
    loading,
    showGoalEditor,
    openStartFlow,
    closeGoalEditor,
    startWithGoal,
    endFast,
    refresh,
  };
}
