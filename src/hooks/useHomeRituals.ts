import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCycleSymptomHistory,
  getCycleSymptomPatterns,
  getCycleSymptoms,
  setMealCompletedApi,
  type CycleSymptomHistoryItem,
  type CycleSymptomPattern,
  type Sleep,
} from '../services/api';
import { useSleepData } from '../context/SleepDataContext';
import { useCycleData } from '../context/CycleDataContext';
import { useNutritionPlan } from './useNutritionPlan';
import { useWorkoutPlan } from './useWorkoutPlan';

type HomeRitualType = 'sleep' | 'periods' | 'symptoms' | 'movement' | 'nutrition';

export type HomeRitual = {
  id: string;
  type: HomeRitualType;
  section: 'morning' | 'midday' | 'evening';
  title: string;
  tag: string;
  description: string;
  completed: boolean;
};

export type SymptomSummary = {
  loggedTodayCount: number;
  statusText: string;
  todaySymptoms: Array<{
    symptom: string;
    severity: string;
  }>;
  lastLoggedDate: string | null;
  topSymptoms: string[];
  trend: 'increasing' | 'decreasing' | 'stable' | null;
  loading: boolean;
};

export type SleepSummary = {
  lastNightDurationMinutes: number | null;
  lastNightQuality: number | null;
  bedTime: string | null;
  wakeTime: string | null;
  streakDays: number;
  lastLogDate: string | null;
  statusText: string;
};

/** YYYY-MM-DD for the calendar day in the device local timezone (not UTC). */
const toLocalDateKey = (input: Date | string): string => {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    // Plain YYYY-MM-DD must be interpreted as a local calendar day (not UTC midnight).
    const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (plain) {
      const y = Number(plain[1]);
      const mo = Number(plain[2]) - 1;
      const day = Number(plain[3]);
      const local = new Date(y, mo, day);
      if (Number.isNaN(local.getTime())) return '';
      const yy = local.getFullYear();
      const mm = String(local.getMonth() + 1).padStart(2, '0');
      const dd = String(local.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    }
  }
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Shift a local calendar YYYY-MM-DD by delta whole days (same timezone rules as toLocalDateKey). */
const addLocalCalendarDays = (yyyyMmDd: string, deltaDays: number): string => {
  const parts = yyyyMmDd.split('-').map(Number);
  if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return '';
  const [y, mo, d] = parts;
  const dt = new Date(y, mo - 1, d);
  if (Number.isNaN(dt.getTime())) return '';
  dt.setDate(dt.getDate() + deltaDays);
  return toLocalDateKey(dt);
};

const isSameLocalDate = (isoOrDate?: string, localDayKey?: string): boolean => {
  if (!isoOrDate || !localDayKey) return false;
  const key = toLocalDateKey(isoOrDate);
  return key.length > 0 && key === localDayKey;
};

const normalizeWorkoutId = (workoutId: any): string | null => {
  if (!workoutId) return null;
  if (typeof workoutId === 'string') return workoutId;
  if (typeof workoutId === 'object') {
    if (workoutId._id) return String(workoutId._id);
  }
  return null;
};

export function useHomeRituals() {
  const { logs: sleepLogsState, refreshSleepData } = useSleepData();
  const { periods: periodsState, cycleStatus, refreshCycleData } = useCycleData();

  const { weeklyPlans, loading: nutritionLoading, refetch: refetchNutrition } =
    useNutritionPlan();

  // Workout plan hook expects an optional date; we pass today's local calendar day.
  // Using local YYYY-MM-DD (not UTC via toISOString) keeps rituals/symptoms aligned with the user's "today".
  const todayISO = useMemo(() => toLocalDateKey(new Date()), []);

  const {
    plan: workoutPlan,
    loading: workoutLoading,
    refetch: refetchWorkout,
    logWorkout,
  } = useWorkoutPlan(todayISO);

  const [symptomsLoading, setSymptomsLoading] = useState(false);
  const [symptomsCountToday, setSymptomsCountToday] = useState<number | null>(
    null,
  );
  const [todaySymptoms, setTodaySymptoms] = useState<
    Array<{ symptom: string; severity: string }>
  >([]);
  const [symptomHistory, setSymptomHistory] = useState<CycleSymptomHistoryItem[]>(
    [],
  );
  const [symptomPatterns, setSymptomPatterns] = useState<CycleSymptomPattern[]>(
    [],
  );

  const refreshSymptoms = useCallback(async () => {
    try {
      setSymptomsLoading(true);
      const [todayRes, historyRes, patternsRes] = await Promise.all([
        getCycleSymptoms(todayISO, todayISO),
        getCycleSymptomHistory(),
        getCycleSymptomPatterns(),
      ]);

      setSymptomsCountToday(
        todayRes.success && Array.isArray(todayRes.data) ? todayRes.data.length : 0,
      );
      setTodaySymptoms(
        todayRes.success && Array.isArray(todayRes.data)
          ? todayRes.data
              .slice(0, 3)
              .map(item => ({ symptom: item.symptom, severity: item.severity }))
          : [],
      );
      setSymptomHistory(
        historyRes.success && Array.isArray(historyRes.data) ? historyRes.data : [],
      );
      setSymptomPatterns(
        patternsRes.success && Array.isArray(patternsRes.data?.patterns)
          ? patternsRes.data.patterns
          : [],
      );
    } catch {
      // Never block the Home UI loader forever.
      // If this endpoint fails, we fall back to "0 symptoms" (so symptoms stay due).
      setSymptomsCountToday(0);
      setTodaySymptoms([]);
      setSymptomHistory([]);
      setSymptomPatterns([]);
    } finally {
      setSymptomsLoading(false);
    }
  }, [todayISO]);

  useEffect(() => {
    // Initial fetch for symptom count (so we can decide due/completed).
    // We avoid doing async work during render.
    refreshSymptoms();
  }, [refreshSymptoms]);

  const refreshSleepDataRef = useRef(refreshSleepData);
  const refreshCycleDataRef = useRef(refreshCycleData);
  const refetchNutritionRef = useRef(refetchNutrition);
  const refetchWorkoutRef = useRef(refetchWorkout);
  const refreshSymptomsRef = useRef(refreshSymptoms);

  useEffect(() => {
    refreshSleepDataRef.current = refreshSleepData;
  }, [refreshSleepData]);
  useEffect(() => {
    refreshCycleDataRef.current = refreshCycleData;
  }, [refreshCycleData]);
  useEffect(() => {
    refetchNutritionRef.current = refetchNutrition;
  }, [refetchNutrition]);
  useEffect(() => {
    refetchWorkoutRef.current = refetchWorkout;
  }, [refetchWorkout]);
  useEffect(() => {
    refreshSymptomsRef.current = refreshSymptoms;
  }, [refreshSymptoms]);

  const refreshAll = useCallback(async () => {
    // Force refresh for contexts + refetch for hooks.
    // Use refs so this callback stays stable and doesn't retrigger
    // `useFocusEffect` on every render.
    await Promise.all([
      refreshSleepDataRef.current({ force: true }),
      refreshCycleDataRef.current({ force: true }),
      refetchNutritionRef.current(),
      refetchWorkoutRef.current(),
      refreshSymptomsRef.current(),
    ]);
  }, []);

  const sleepCompleted = useMemo(() => {
    const logs: Sleep[] = sleepLogsState.data || [];
    // "Last night's sleep" is stored as the night you went to bed (often yesterday's calendar day)
    // or as today when the picker uses wake-up day — accept either local today or yesterday.
    const yesterdayKey = addLocalCalendarDays(todayISO, -1);
    return logs.some(
      l =>
        isSameLocalDate(l.date, todayISO) ||
        isSameLocalDate(l.date, yesterdayKey),
    );
  }, [sleepLogsState.data, todayISO]);

  const periodsTouchedToday = useMemo(() => {
    const periods = periodsState.data || [];
    return periods.some(p => {
      if (isSameLocalDate(p.startDate, todayISO)) return true;
      if (p.endDate && isSameLocalDate(p.endDate, todayISO)) return true;
      return false;
    });
  }, [periodsState.data, todayISO]);

  const symptomsCompleted = useMemo(() => {
    if (symptomsCountToday === null) return false;
    return symptomsCountToday > 0;
  }, [symptomsCountToday]);

  const sleepSummary = useMemo<SleepSummary>(() => {
    const logs: Sleep[] = sleepLogsState.data || [];
    if (logs.length === 0) {
      return {
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
      // Backend may return duration in hours (decimal) or minutes; normalize to minutes.
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

  const symptomSummary = useMemo<SymptomSummary>(() => {
    const normalizedHistory = [...symptomHistory].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const lastLoggedDate = normalizedHistory[0]?.date ?? null;
    const topSymptoms = symptomPatterns
      .slice()
      .sort((a, b) => b.count - a.count)
      .slice(0, 2)
      .map(p => p.symptom);
    const topPattern = symptomPatterns
      .slice()
      .sort((a, b) => b.count - a.count)[0];
    const trend = topPattern?.trend ?? null;
    const loggedTodayCount = symptomsCountToday ?? 0;

    return {
      loggedTodayCount,
      statusText:
        loggedTodayCount > 0
          ? `${loggedTodayCount} symptom${loggedTodayCount > 1 ? 's' : ''} logged today`
          : 'No symptoms logged yet today',
      todaySymptoms,
      lastLoggedDate,
      topSymptoms,
      trend,
      loading: symptomsLoading,
    };
  }, [
    symptomHistory,
    symptomPatterns,
    symptomsCountToday,
    symptomsLoading,
    todaySymptoms,
  ]);

  const nutritionRituals = useMemo(() => {
    const todayPlan = weeklyPlans.find(p => p.isToday)?.plan;
    const slots = todayPlan?.timeSlots || [];
    const mealRituals = slots.map((slot, idx) => {
      const activeOption =
        // Some slots may have options missing depending on backend response
        slot.options?.[slot.selectedOptionIndex] || slot.options?.[0];

      return {
        id: `nutrition_${slot.time}_${idx}`,
        type: 'nutrition' as const,
        section: 'midday' as const,
        title: slot.label || slot.time,
        tag: 'Nourish',
        description: activeOption
          ? `${activeOption.title}`
          : 'Complete this meal slot',
        completed: Boolean(slot.completed),
      };
    });

    return mealRituals;
  }, [weeklyPlans]);

  const morningRituals = useMemo<HomeRitual[]>(() => {
    return [
      {
        id: 'sleep',
        type: 'sleep',
        section: 'morning',
        title: "Log last night’s sleep",
        tag: 'Rest',
        description:
          '💡 Tracking sleep patterns helps identify what supports your best rest',
        completed: sleepCompleted,
      },
      {
        id: 'periods',
        type: 'periods',
        section: 'morning',
        title: 'Log your period',
        tag: 'Rest',
        description:
          '💡 Logging your period helps keep your cycle predictions accurate',
        completed: periodsTouchedToday,
      },
      {
        id: 'symptoms',
        type: 'symptoms',
        section: 'morning',
        title: 'Log today’s symptoms',
        tag: 'Mindful',
        description:
          '💡 Tracking symptoms helps identify patterns and support your hormonal health',
        completed: symptomsCompleted,
      },
    ];
  }, [sleepCompleted, periodsTouchedToday, symptomsCompleted]);

  const movementRituals = useMemo<HomeRitual[]>(() => {
    const planned = workoutPlan?.workouts || [];
    if (planned.length === 0) return [];

    const logged = workoutPlan?.loggedWorkouts || [];
    const loggedIds = logged
      .map(l => normalizeWorkoutId(l.workoutId))
      .filter(Boolean) as string[];
    const loggedSet = new Set(loggedIds);

    return planned
      .map((w, idx) => {
        const plannedId = normalizeWorkoutId(w.workout);
        const id = plannedId ? `movement_${plannedId}` : `movement_${idx}`;
        const completed = plannedId ? loggedSet.has(plannedId) : false;

        return {
          id,
          type: 'movement' as const,
          section: 'midday' as const,
          title: w.title,
          tag: 'Move',
          description: w.description,
          completed,
        };
      })
      // In case of duplicate IDs, keep stable order by idx
      .filter(Boolean);
  }, [workoutPlan?.workouts, workoutPlan?.loggedWorkouts]);

  const todayRituals = useMemo(() => {
    return [...morningRituals, ...movementRituals, ...nutritionRituals];
  }, [morningRituals, movementRituals, nutritionRituals]);

  const completedCount = useMemo(() => {
    return todayRituals.filter(r => r.completed).length;
  }, [todayRituals]);

  const totalCount = useMemo(() => {
    return todayRituals.length;
  }, [todayRituals]);

  const ritualsLoading = useMemo(() => {
    return (
      Boolean(sleepLogsState.loading || periodsState.loading) ||
      nutritionLoading ||
      workoutLoading ||
      symptomsLoading
    );
  }, [
    sleepLogsState.loading,
    periodsState.loading,
    nutritionLoading,
    workoutLoading,
    symptomsLoading,
  ]);

  const completeMovement = useCallback(async () => {
    if (!workoutPlan) return;

    // Only mark as done (due -> completed). For MVP we don't support undo from Home.
    const planned = workoutPlan.workouts || [];
    const plannedIds = planned
      .map(w => normalizeWorkoutId(w.workout))
      .filter(Boolean) as string[];
    if (plannedIds.length === 0) return;

    const logged = workoutPlan.loggedWorkouts || [];
    const loggedIds = logged
      .map(l => normalizeWorkoutId(l.workoutId))
      .filter(Boolean) as string[];
    const loggedSet = new Set(loggedIds);

    const missingIds = plannedIds.filter(id => !loggedSet.has(id));
    if (missingIds.length === 0) return;

    for (const workoutId of missingIds) {
      await logWorkout(workoutId, 'add');
    }

    await refetchWorkout();
  }, [workoutPlan, logWorkout, refetchWorkout]);

  const completeNutrition = useCallback(async () => {
    const todayPlan = weeklyPlans.find(p => p.isToday)?.plan;
    if (!todayPlan) return;

    const date = todayISO;
    const slots = todayPlan.timeSlots || [];
    const incompleteSlots = slots.filter(s => !s.completed);
    if (incompleteSlots.length === 0) return;

    // Mark all remaining slots complete.
    for (const slot of incompleteSlots) {
      // eslint-disable-next-line no-await-in-loop
      await setMealCompletedApi(date, { time: slot.time, completed: true });
    }

    await refetchNutrition();
  }, [weeklyPlans, todayISO, refetchNutrition]);

  return {
    ritualsLoading,
    progress: { completed: completedCount, total: totalCount },
    todayRituals,
    symptomSummary,
    sleepSummary,
    completeMovement,
    completeNutrition,
    refreshAll,
    cycleStatus,
  };
}

