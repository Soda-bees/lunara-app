import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getCycleSymptomPatterns,
  getCycleSymptoms,
  setMealCompletedApi,
  getRitualDefinitions,
  getRitualPreferences,
  getRitualCompletions,
  postRitualDayToggle,
  type CycleSymptomPattern,
  type RitualDefinitionDto,
  type RitualSection,
  type UserRitualPreferenceDto,
  type Sleep,
} from '../services/api';
import { useSleepData } from '../context/SleepDataContext';
import { useCycleData } from '../context/CycleDataContext';
import { useNutritionPlan } from './useNutritionPlan';
import { useWorkoutPlan } from './useWorkoutPlan';
import { mealSlotSection } from '../utils/ritualSections';
import {
  pickGapFillMovementLogs,
  pickPlannedMovementWinners,
} from '../utils/movementRitualPick';

export type HomeRitualType =
  | 'sleep'
  | 'symptoms'
  | 'movement'
  | 'nutrition'
  | 'optional';

export type RitualInteraction = 'check' | 'action';

export type HomeRitual = {
  id: string;
  type: HomeRitualType;
  section: RitualSection;
  title: string;
  tag: string;
  description: string;
  completed: boolean;
  interaction: RitualInteraction;
  orderIndex: number;
  ritualKey?: string;
  navigationTarget?: string | null;
  actionParams?: Record<string, unknown>;
  mealSlotTime?: string;
  mealSlotIndex?: number;
};

export type SymptomSummary = {
  loggedTodayCount: number;
  statusText: string;
  hasAnyLogged: boolean;
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
  hasAnyLogged: boolean;
  lastNightDurationMinutes: number | null;
  lastNightQuality: number | null;
  bedTime: string | null;
  wakeTime: string | null;
  streakDays: number;
  lastLogDate: string | null;
  statusText: string;
};

const toLocalDateKey = (input: Date | string): string => {
  if (typeof input === 'string') {
    const trimmed = input.trim();
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

const sortByOrder = (a: HomeRitual, b: HomeRitual) => a.orderIndex - b.orderIndex;

export function useHomeRituals() {
  const { logs: sleepLogsState, refreshSleepData } = useSleepData();
  const { periods: periodsState, cycleStatus, refreshCycleData } =
    useCycleData();

  const {
    weeklyPlans,
    hasWeeklyPlan,
    planningStatus,
    loading: nutritionLoading,
    refetch: refetchNutrition,
  } = useNutritionPlan();

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
  const [symptomPatterns, setSymptomPatterns] = useState<CycleSymptomPattern[]>(
    [],
  );

  const [ritualDefinitions, setRitualDefinitions] = useState<RitualDefinitionDto[]>(
    [],
  );
  const [ritualPreferences, setRitualPreferences] = useState<
    UserRitualPreferenceDto[]
  >([]);
  const [ritualCompletions, setRitualCompletions] = useState<Record<string, boolean>>(
    {},
  );

  const refreshSymptoms = useCallback(async () => {
    try {
      setSymptomsLoading(true);
      // MOB-017: skip getCycleSymptomHistory on Home — History / Cycle Insight fetch on demand.
      const [todayRes, patternsRes] = await Promise.all([
        getCycleSymptoms(todayISO, todayISO),
        getCycleSymptomPatterns(),
      ]);

      const uniqueTodaySymptoms =
        todayRes.success && Array.isArray(todayRes.data)
          ? todayRes.data.reduce<Array<{ symptom: string; severity: string }>>(
              (acc, item) => {
                if (acc.some(existing => existing.symptom === item.symptom)) {
                  return acc;
                }
                acc.push({ symptom: item.symptom, severity: item.severity });
                return acc;
              },
              [],
            )
          : [];

      setSymptomsCountToday(uniqueTodaySymptoms.length);
      setTodaySymptoms(uniqueTodaySymptoms.slice(0, 3));
      setSymptomPatterns(
        patternsRes.success && Array.isArray(patternsRes.data?.patterns)
          ? patternsRes.data.patterns
          : [],
      );
    } catch {
      setSymptomsCountToday(0);
      setTodaySymptoms([]);
      setSymptomPatterns([]);
    } finally {
      setSymptomsLoading(false);
    }
  }, [todayISO]);

  const refreshRitualPack = useCallback(async () => {
    try {
      const [defsRes, prefsRes, compRes] = await Promise.all([
        getRitualDefinitions(),
        getRitualPreferences(),
        getRitualCompletions(todayISO),
      ]);
      if (defsRes.success && Array.isArray(defsRes.data)) {
        setRitualDefinitions(defsRes.data);
      }
      if (prefsRes.success && Array.isArray(prefsRes.data)) {
        setRitualPreferences(prefsRes.data);
      }
      if (compRes.success && compRes.data && typeof compRes.data === 'object') {
        setRitualCompletions(compRes.data);
      }
    } catch {
      // Offline / API missing: keep empty catalog; core still renders from fallbacks
    }
  }, [todayISO]);

  useEffect(() => {
    refreshSymptoms();
  }, [refreshSymptoms]);

  useEffect(() => {
    refreshRitualPack().catch(() => {});
  }, [refreshRitualPack]);

  const refreshSleepDataRef = useRef(refreshSleepData);
  const refreshCycleDataRef = useRef(refreshCycleData);
  const refetchNutritionRef = useRef(refetchNutrition);
  const refetchWorkoutRef = useRef(refetchWorkout);
  const refreshSymptomsRef = useRef(refreshSymptoms);
  const refreshRitualPackRef = useRef(refreshRitualPack);

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
  useEffect(() => {
    refreshRitualPackRef.current = refreshRitualPack;
  }, [refreshRitualPack]);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshSleepDataRef.current({ force: true }),
      refreshCycleDataRef.current({ force: true }),
      refetchNutritionRef.current(),
      refetchWorkoutRef.current(),
      refreshSymptomsRef.current(),
      refreshRitualPackRef.current(),
    ]);
  }, []);

  const sleepCompleted = useMemo(() => {
    const logs: Sleep[] = sleepLogsState.data || [];
    const yesterdayKey = addLocalCalendarDays(todayISO, -1);
    return logs.some(
      l =>
        isSameLocalDate(l.date, todayISO) ||
        isSameLocalDate(l.date, yesterdayKey),
    );
  }, [sleepLogsState.data, todayISO]);

  const symptomsCompleted = useMemo(() => {
    if (symptomsCountToday === null) return false;
    return symptomsCountToday > 0;
  }, [symptomsCountToday]);

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

  const symptomSummary = useMemo<SymptomSummary>(() => {
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
    // Patterns cover recent logs; full history is loaded on Symptom History / Cycle Insight.
    const hasAnyLogged = loggedTodayCount > 0 || symptomPatterns.length > 0;
    const lastLoggedDate = loggedTodayCount > 0 ? todayISO : null;

    return {
      loggedTodayCount,
      hasAnyLogged,
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
    symptomPatterns,
    symptomsCountToday,
    symptomsLoading,
    todaySymptoms,
    todayISO,
  ]);

  const defByKey = useMemo(() => {
    const m = new Map<string, RitualDefinitionDto>();
    ritualDefinitions.forEach(d => m.set(d.keyId, d));
    return m;
  }, [ritualDefinitions]);

  const ritualsBySection = useMemo(() => {
    const morning: HomeRitual[] = [];
    const midday: HomeRitual[] = [];
    const evening: HomeRitual[] = [];

    const push = (section: RitualSection, row: HomeRitual) => {
      if (section === 'morning') morning.push(row);
      else if (section === 'midday') midday.push(row);
      else evening.push(row);
    };

    const coreSleep = defByKey.get('core_sleep');
    const coreSymptoms = defByKey.get('core_symptoms');

    if (coreSleep) {
      push(coreSleep.defaultSection, {
        id: 'sleep',
        type: 'sleep',
        section: coreSleep.defaultSection,
        title: coreSleep.title,
        tag: coreSleep.tag,
        description: coreSleep.description,
        completed: sleepCompleted,
        interaction: coreSleep.interaction as RitualInteraction,
        orderIndex: coreSleep.defaultSortOrder ?? 1,
      });
    } else {
      push('morning', {
        id: 'sleep',
        type: 'sleep',
        section: 'morning',
        title: 'Log last night’s sleep',
        tag: 'Rest',
        description:
          'When you’re ready, logging sleep can help you notice patterns over time.',
        completed: sleepCompleted,
        interaction: 'action',
        orderIndex: 1,
      });
    }

    if (coreSymptoms) {
      push(coreSymptoms.defaultSection, {
        id: 'symptoms',
        type: 'symptoms',
        section: coreSymptoms.defaultSection,
        title: coreSymptoms.title,
        tag: coreSymptoms.tag,
        description: coreSymptoms.description,
        completed: symptomsCompleted,
        interaction: coreSymptoms.interaction as RitualInteraction,
        orderIndex: coreSymptoms.defaultSortOrder ?? 2,
      });
    } else {
      push('morning', {
        id: 'symptoms',
        type: 'symptoms',
        section: 'morning',
        title: 'Log today’s symptoms',
        tag: 'Mindful',
        description:
          'If it feels helpful, a quick symptom log can support pattern awareness.',
        completed: symptomsCompleted,
        interaction: 'action',
        orderIndex: 2,
      });
    }

    const enabledPrefs = ritualPreferences.filter(p => p.enabled !== false);
    enabledPrefs.forEach((pref, i) => {
      const def = defByKey.get(pref.ritualKey);
      if (!def || def.isCore) return;
      const desc =
        pref.userNote && pref.userNote.trim().length > 0
          ? pref.userNote.trim()
          : def.description;
      push(pref.section, {
        id: `optional_${pref.ritualKey}`,
        type: 'optional',
        section: pref.section,
        title: def.title,
        tag: def.tag,
        description: desc,
        completed:
          def.interaction === 'check'
            ? Boolean(ritualCompletions[pref.ritualKey])
            : false,
        interaction: def.interaction as RitualInteraction,
        orderIndex: 100 + i,
        ritualKey: pref.ritualKey,
        navigationTarget: def.navigationTarget || undefined,
        actionParams: def.actionParams || {},
      });
    });

    if (hasWeeklyPlan) {
      const todayPlan = weeklyPlans.find(p => p.isToday)?.plan;
      const slots = todayPlan?.timeSlots || [];
      slots.forEach((slot, idx) => {
        const activeOption =
          slot.options?.[slot.selectedOptionIndex] || slot.options?.[0];
        const section = mealSlotSection(slot);
        push(section, {
          id: `nutrition_${slot.time}_${idx}`,
          type: 'nutrition',
          section,
          title: slot.label || slot.time,
          tag: 'Nourish',
          description: activeOption
            ? activeOption.title
            : 'Meal slot from your plan',
          completed: Boolean(slot.completed),
          interaction: 'action',
          orderIndex: 200 + idx,
          mealSlotTime: slot.time,
          mealSlotIndex: idx,
        });
      });
    } else if (planningStatus !== 'skipped') {
      push('morning', {
        id: 'nutrition_plan_week',
        type: 'nutrition',
        section: 'morning',
        title: "Plan this week's meals",
        tag: 'Nourish',
        description:
          'Set up Mon–Sun meals and your grocery list for the week.',
        completed: false,
        interaction: 'action',
        orderIndex: 200,
        navigationTarget: 'WeeklyMealPlanning',
      });
    }

    const planned = workoutPlan?.workouts || [];
    const logged = workoutPlan?.loggedWorkouts || [];
    const loggedIds = logged
      .map(l => normalizeWorkoutId(l.workoutId))
      .filter(Boolean) as string[];
    const loggedSet = new Set(loggedIds);

    const plannedWinners = pickPlannedMovementWinners(planned);
    const sectionsWithPlanned = new Set(
      plannedWinners.map(w => w.section),
    );

    plannedWinners.forEach(({ section, planned: w, originalIndex: idx }) => {
      const plannedId = normalizeWorkoutId(w.workout);
      const id = plannedId ? `movement_${plannedId}` : `movement_${idx}`;
      const completed = plannedId ? loggedSet.has(plannedId) : false;
      push(section, {
        id,
        type: 'movement',
        section,
        title: w.title,
        tag: 'Move',
        description: w.description,
        completed,
        interaction: 'action',
        orderIndex: 300 + idx,
      });
    });

    pickGapFillMovementLogs(logged, sectionsWithPlanned, planned.length).forEach(
      ({ section, log: l }, gapIdx) => {
        push(section, {
          id: `movement_custom_${l._id ?? gapIdx}`,
          type: 'movement',
          section,
          title: l.workoutTitleSnapshot || 'Custom movement',
          tag: 'Move',
          description: `${l.durationMinutes || 30} min`,
          completed: true,
          interaction: 'action',
          orderIndex: 350 + gapIdx,
        });
      },
    );

    morning.sort(sortByOrder);
    midday.sort(sortByOrder);
    evening.sort(sortByOrder);

    return { morning, midday, evening };
  }, [
    defByKey,
    ritualPreferences,
    ritualCompletions,
    weeklyPlans,
    hasWeeklyPlan,
    planningStatus,
    workoutPlan,
    sleepCompleted,
    symptomsCompleted,
  ]);

  const todayRituals = useMemo(
    () => [
      ...ritualsBySection.morning,
      ...ritualsBySection.midday,
      ...ritualsBySection.evening,
    ],
    [ritualsBySection],
  );

  const completedCount = useMemo(
    () => todayRituals.filter(r => r.completed).length,
    [todayRituals],
  );

  const totalCount = useMemo(() => todayRituals.length, [todayRituals]);

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

    for (const slot of incompleteSlots) {
      await setMealCompletedApi(date, { time: slot.time, completed: true });
    }

    await refetchNutrition();
  }, [weeklyPlans, todayISO, refetchNutrition]);

  const toggleOptionalRitual = useCallback(
    async (ritualKey: string, completed: boolean) => {
      const res = await postRitualDayToggle({
        date: todayISO,
        ritualKey,
        completed,
      });
      if (res.success) {
        setRitualCompletions(prev => ({ ...prev, [ritualKey]: completed }));
      }
    },
    [todayISO],
  );

  return {
    ritualsLoading,
    progress: { completed: completedCount, total: totalCount },
    todayRituals,
    ritualsBySection,
    symptomSummary,
    sleepSummary,
    completeMovement,
    completeNutrition,
    toggleOptionalRitual,
    refreshAll,
    cycleStatus,
    ritualDefinitions,
    ritualPreferences,
    refreshRitualPack,
  };
}
