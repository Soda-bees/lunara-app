import { formatDaysUntilPeriodStat } from './cycleUtils';

export type ProfileStats = {
  cycleLabel: string;
  cycleDetail: string;
  fastingLabel: string;
  fastingDetail: string;
  challengeLabel: string;
  challengeDetail: string;
  sleepLabel: string;
  sleepDetail: string;
  nextPeriodLabel: string;
  nextPeriodDetail: string;
  avgFastLabel: string;
  avgFastDetail: string;
};

export type ProfileStatEmptyFlags = {
  sleep: boolean;
  avgFast: boolean;
};

export const EMPTY_PROFILE_STATS: ProfileStats = {
  cycleLabel: '—',
  cycleDetail: 'Not available',
  fastingLabel: '—',
  fastingDetail: 'Not available',
  challengeLabel: '—',
  challengeDetail: 'Not available',
  sleepLabel: 'No logs',
  sleepDetail: 'Sleep tracker',
  nextPeriodLabel: '—',
  nextPeriodDetail: 'Not tracking',
  avgFastLabel: 'No fasts',
  avgFastDetail: 'Last 7 days',
};

export const EMPTY_STAT_FLAGS: ProfileStatEmptyFlags = {
  sleep: true,
  avgFast: true,
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMinutesAsHours(
  minutes: number | null | undefined,
): string | null {
  if (minutes == null || Number.isNaN(minutes)) {
    return null;
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours}h`;
}

type CycleLike = {
  isTracking?: boolean;
  phase?: string | null;
  cycleDay?: number | null;
  message?: string;
  daysUntilNextPeriod?: number | null;
};

type SleepLike = {
  averages: { duration?: number | null };
  totalLogs: number;
};

type FastingLike = {
  currentStreakDays?: number | null;
  averageDurationMinutes?: number | null;
};

type ChallengeLike = {
  title: string;
  duration: number;
  userInstance?: { status?: string; currentDay?: number } | null;
};

export function mapProfileStats(
  input: {
    cycle?: CycleLike | null;
    sleep?: SleepLike | null;
    fasting?: FastingLike | null;
    challenges?: ChallengeLike[] | null;
  },
  base: ProfileStats = EMPTY_PROFILE_STATS,
  baseFlags: ProfileStatEmptyFlags = EMPTY_STAT_FLAGS,
): { stats: ProfileStats; flags: ProfileStatEmptyFlags } {
  const nextStats: ProfileStats = { ...base };
  let hasSleepData = !baseFlags.sleep;
  let hasAvgFastData = !baseFlags.avgFast;

  const cycle = input.cycle;
  if (cycle) {
    if (cycle.isTracking && cycle.phase) {
      nextStats.cycleLabel = capitalize(cycle.phase);
      nextStats.cycleDetail =
        cycle.cycleDay != null ? `Day ${cycle.cycleDay}` : 'Tracking active';
    } else {
      nextStats.cycleLabel = 'Off';
      nextStats.cycleDetail = cycle.message || 'Not tracking';
    }

    if (cycle.isTracking && cycle.daysUntilNextPeriod != null) {
      const periodStat = formatDaysUntilPeriodStat(cycle.daysUntilNextPeriod);
      nextStats.nextPeriodLabel = periodStat.label;
      nextStats.nextPeriodDetail = periodStat.detail;
    }
  }

  const sleep = input.sleep;
  if (sleep?.averages.duration != null && sleep.totalLogs > 0) {
    hasSleepData = true;
    nextStats.sleepLabel = `${Math.round(sleep.averages.duration * 10) / 10}h`;
    nextStats.sleepDetail = '7-day avg';
  }

  const fasting = input.fasting;
  if (fasting) {
    nextStats.fastingLabel = String(fasting.currentStreakDays ?? 0);
    nextStats.fastingDetail = 'Day streak';

    const avgFast = formatMinutesAsHours(fasting.averageDurationMinutes);
    if (avgFast) {
      hasAvgFastData = true;
      nextStats.avgFastLabel = avgFast;
      nextStats.avgFastDetail = 'Avg fast (7d)';
    }
  }

  const challenges = input.challenges;
  if (challenges) {
    const active = challenges.find(
      item => item.userInstance?.status === 'active',
    );
    if (active?.userInstance) {
      nextStats.challengeLabel = active.title;
      nextStats.challengeDetail = `Day ${active.userInstance.currentDay}/${active.duration}`;
    } else {
      nextStats.challengeLabel = 'None';
      nextStats.challengeDetail = 'No active challenge';
    }
  }

  return {
    stats: nextStats,
    flags: { sleep: !hasSleepData, avgFast: !hasAvgFastData },
  };
}
