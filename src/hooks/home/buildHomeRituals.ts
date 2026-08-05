import type {
  RitualDefinitionDto,
  RitualSection,
  UserRitualPreferenceDto,
} from '../../services/api';
import { mealSlotSection } from '../../utils/ritualSections';
import {
  pickGapFillMovementLogs,
  pickPlannedMovementWinners,
} from '../../utils/movementRitualPick';
import type { HomeRitual, RitualInteraction } from './types';
import { normalizeWorkoutId, sortByOrder } from './dateUtils';

type WeeklyPlanDay = {
  isToday?: boolean;
  plan?: {
    timeSlots?: Array<{
      time: string;
      label?: string;
      completed?: boolean;
      selectedOptionIndex?: number;
      options?: Array<{ title?: string }>;
    }>;
  };
};

type WorkoutPlanLike = {
  workouts?: Array<{
    workout?: unknown;
    title: string;
    description: string;
  }>;
  loggedWorkouts?: Array<{
    workoutId?: unknown;
    _id?: string;
    workoutTitleSnapshot?: string;
    durationMinutes?: number;
  }>;
} | null;

export type BuildHomeRitualsInput = {
  defByKey: Map<string, RitualDefinitionDto>;
  ritualPreferences: UserRitualPreferenceDto[];
  ritualCompletions: Record<string, boolean>;
  weeklyPlans: WeeklyPlanDay[];
  hasWeeklyPlan: boolean;
  planningStatus: string | null | undefined;
  workoutPlan: WorkoutPlanLike;
  sleepCompleted: boolean;
  symptomsCompleted: boolean;
};

export function buildHomeRitualsBySection({
  defByKey,
  ritualPreferences,
  ritualCompletions,
  weeklyPlans,
  hasWeeklyPlan,
  planningStatus,
  workoutPlan,
  sleepCompleted,
  symptomsCompleted,
}: BuildHomeRitualsInput): Record<RitualSection, HomeRitual[]> {
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
        slot.options?.[slot.selectedOptionIndex as number] || slot.options?.[0];
      const section = mealSlotSection(slot as any);
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
      description: 'Set up Mon–Sun meals and your grocery list for the week.',
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

  const plannedWinners = pickPlannedMovementWinners(planned as any);
  const sectionsWithPlanned = new Set(plannedWinners.map(w => w.section));

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

  pickGapFillMovementLogs(
    logged as any,
    sectionsWithPlanned,
    planned.length,
  ).forEach(({ section, log: l }, gapIdx) => {
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
  });

  morning.sort(sortByOrder);
  midday.sort(sortByOrder);
  evening.sort(sortByOrder);

  return { morning, midday, evening };
}
