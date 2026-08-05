import { useCallback, useEffect, useMemo, useRef } from 'react';
import { setMealCompletedApi } from '../services/api';
import { useSleepData } from '../context/SleepDataContext';
import { useCycleData } from '../context/CycleDataContext';
import { useNutritionPlan } from './useNutritionPlan';
import { useWorkoutPlan } from './useWorkoutPlan';
import { toLocalDateKey, normalizeWorkoutId } from './home/dateUtils';
import { useHomeSymptoms } from './home/useHomeSymptoms';
import { useRitualPack } from './home/useRitualPack';
import { useSleepSummary } from './home/useSleepSummary';
import { buildHomeRitualsBySection } from './home/buildHomeRituals';

export type {
  HomeRitualType,
  RitualInteraction,
  HomeRitual,
  SymptomSummary,
  SleepSummary,
} from './home/types';

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

  const {
    symptomsLoading,
    symptomsCompleted,
    symptomSummary,
    refreshSymptoms,
  } = useHomeSymptoms(todayISO);

  const {
    ritualDefinitions,
    ritualPreferences,
    ritualCompletions,
    defByKey,
    refreshRitualPack,
    toggleOptionalRitual,
  } = useRitualPack(todayISO);

  const { sleepCompleted, sleepSummary } = useSleepSummary(
    sleepLogsState,
    todayISO,
  );

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

  const ritualsBySection = useMemo(
    () =>
      buildHomeRitualsBySection({
        defByKey,
        ritualPreferences,
        ritualCompletions,
        weeklyPlans,
        hasWeeklyPlan,
        planningStatus,
        workoutPlan,
        sleepCompleted,
        symptomsCompleted,
      }),
    [
      defByKey,
      ritualPreferences,
      ritualCompletions,
      weeklyPlans,
      hasWeeklyPlan,
      planningStatus,
      workoutPlan,
      sleepCompleted,
      symptomsCompleted,
    ],
  );

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
