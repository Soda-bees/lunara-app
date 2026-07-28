import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  getAllChallenges,
  getCurrentCycleStatus,
  getFastingInsights,
  getMe,
  getSleepStatistics,
  type User,
} from '../../services/api';
import { formatDaysUntilPeriodStat } from '../../utils/cycleUtils';

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

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMinutesAsHours(minutes: number | null | undefined): string | null {
  if (minutes == null || Number.isNaN(minutes)) {
    return null;
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours}h`;
}

export function useProfileDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats>(EMPTY_PROFILE_STATS);
  const [statEmptyFlags, setStatEmptyFlags] = useState({
    sleep: true,
    avgFast: true,
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [meRes, cycleRes, fastingRes, challengesRes, sleepRes] =
        await Promise.allSettled([
          getMe(),
          getCurrentCycleStatus(),
          getFastingInsights(7),
          getAllChallenges(),
          getSleepStatistics(),
        ]);

      if (meRes.status === 'fulfilled' && meRes.value.success && meRes.value.user) {
        setUser(meRes.value.user);
      }

      const nextStats: ProfileStats = { ...EMPTY_PROFILE_STATS };

      if (
        cycleRes.status === 'fulfilled' &&
        cycleRes.value.success &&
        cycleRes.value.data
      ) {
        const cycle = cycleRes.value.data;
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

      let hasSleepData = false;
      if (
        sleepRes.status === 'fulfilled' &&
        sleepRes.value.success &&
        sleepRes.value.data
      ) {
        const sleep = sleepRes.value.data;
        if (sleep.averages.duration != null && sleep.totalLogs > 0) {
          hasSleepData = true;
          nextStats.sleepLabel = `${Math.round(sleep.averages.duration * 10) / 10}h`;
          nextStats.sleepDetail = '7-day avg';
        }
      }

      let hasAvgFastData = false;
      if (
        fastingRes.status === 'fulfilled' &&
        fastingRes.value.success &&
        fastingRes.value.data
      ) {
        const fasting = fastingRes.value.data;
        nextStats.fastingLabel = String(fasting.currentStreakDays ?? 0);
        nextStats.fastingDetail = 'Day streak';

        const avgFast = formatMinutesAsHours(fasting.averageDurationMinutes);
        if (avgFast) {
          hasAvgFastData = true;
          nextStats.avgFastLabel = avgFast;
          nextStats.avgFastDetail = 'Avg fast (7d)';
        }
      }

      if (
        challengesRes.status === 'fulfilled' &&
        challengesRes.value.success &&
        challengesRes.value.data
      ) {
        const active = challengesRes.value.data.find(
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

      setStats(nextStats);
      setStatEmptyFlags({
        sleep: !hasSleepData,
        avgFast: !hasAvgFastData,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  return {
    user,
    setUser,
    stats,
    statEmptyFlags,
    loading,
    loadProfile,
  };
}
