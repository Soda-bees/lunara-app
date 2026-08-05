import { useMemo } from 'react';
import type { Sleep } from '../../services/api';
import type { SleepSummary } from './types';
import {
  addLocalCalendarDays,
  isSameLocalDate,
  toLocalDateKey,
} from './dateUtils';

type SleepLogsState = {
  data?: Sleep[] | null;
};

export function useSleepSummary(
  sleepLogsState: SleepLogsState,
  todayISO: string,
) {
  const sleepCompleted = useMemo(() => {
    const logs: Sleep[] = sleepLogsState.data || [];
    const yesterdayKey = addLocalCalendarDays(todayISO, -1);
    return logs.some(
      l =>
        isSameLocalDate(l.date, todayISO) ||
        isSameLocalDate(l.date, yesterdayKey),
    );
  }, [sleepLogsState.data, todayISO]);

  const sleepSummary = useMemo<SleepSummary>(() => {
    const logs: Sleep[] = sleepLogsState.data || [];
    if (logs.length === 0) {
      return {
        hasAnyLogged: false,
        lastNightDurationMinutes: null,
        lastNightQuality: null,
        bedTime: null,
        wakeTime: null,
        streakDays: 0,
        lastLogDate: null,
        statusText: 'No sleep logged yet',
      };
    }

    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const latest = sortedLogs[0];

    const parsedBed = latest?.bedTime ? new Date(latest.bedTime) : null;
    const parsedWake = latest?.wakeTime ? new Date(latest.wakeTime) : null;
    let durationMinutes: number | null = null;
    if (
      parsedBed &&
      parsedWake &&
      !Number.isNaN(parsedBed.getTime()) &&
      !Number.isNaN(parsedWake.getTime())
    ) {
      durationMinutes = Math.max(
        0,
        Math.round((parsedWake.getTime() - parsedBed.getTime()) / 60000),
      );
    } else if (typeof latest?.duration === 'number' && latest.duration > 0) {
      durationMinutes =
        latest.duration > 24
          ? Math.round(latest.duration)
          : Math.round(latest.duration * 60);
    }

    const uniqueDayKeys = Array.from(
      new Set(
        sortedLogs
          .map(log => toLocalDateKey(log.date))
          .filter((key): key is string => key.length > 0),
      ),
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streakDays = 0;
    let cursor = uniqueDayKeys[0];
    while (cursor && uniqueDayKeys.includes(cursor)) {
      streakDays += 1;
      cursor = addLocalCalendarDays(cursor, -1);
    }

    return {
      hasAnyLogged: true,
      lastNightDurationMinutes: durationMinutes,
      lastNightQuality:
        typeof latest?.quality === 'number' ? latest.quality : null,
      bedTime: latest?.bedTime || null,
      wakeTime: latest?.wakeTime || null,
      streakDays,
      lastLogDate: latest?.date || null,
      statusText:
        streakDays > 0
          ? `${streakDays}-day sleep logging streak`
          : 'No recent sleep streak',
    };
  }, [sleepLogsState.data]);

  return { sleepCompleted, sleepSummary };
}
