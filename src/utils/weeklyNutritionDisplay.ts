import { DailyMealPlan, getWeeklyPlanning } from '../services/api';

export type WeeklyNutritionDisplaySource = 'weekly_generated' | 'none';

export type WeeklyPlanningStatus = 'generated' | 'skipped' | 'none';

export type WeeklyPlanRow = {
  isoDate: string;
  label: string;
  isToday: boolean;
  plan: DailyMealPlan | null;
};

export type FetchWeeklyNutritionPlansResult = {
  data: DailyMealPlan[];
  source: WeeklyNutritionDisplaySource;
  planningStatus: WeeklyPlanningStatus;
  /** Canonical week start (Monday) for cache keys and UI */
  weekKey: string;
};

/** Local calendar YYYY-MM-DD (avoids UTC-only `toISOString().split('T')[0]` drift). */
export function toLocalYyyyMmDd(input: string | Date): string {
  const d = new Date(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getMondayOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const delta = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + delta);
  return d;
}

/**
 * Loads meal rows for the current canonical week on the server.
 * Weekly-first: only returns meals when `weeklyPlan.status === 'generated'`.
 * Does not auto-fetch legacy 5-day daily plans.
 */
export async function fetchWeeklyNutritionPlansForWeek(
  legacyWeekStartIso: string,
): Promise<FetchWeeklyNutritionPlansResult> {
  const planningRes = await getWeeklyPlanning();
  const weeklyPlan = planningRes.data?.weeklyPlan;
  const weekKey =
    planningRes.data?.weekStart != null
      ? toLocalYyyyMmDd(planningRes.data.weekStart)
      : legacyWeekStartIso;

  if (weeklyPlan?.status === 'skipped') {
    return {
      data: [],
      source: 'none',
      planningStatus: 'skipped',
      weekKey,
    };
  }

  const days = weeklyPlan?.days;
  if (
    weeklyPlan?.status === 'generated' &&
    Array.isArray(days) &&
    days.length > 0
  ) {
    const data: DailyMealPlan[] = days.map(day => ({
      _id: `${weeklyPlan._id}_${toLocalYyyyMmDd(day.date)}`,
      user: weeklyPlan.user || '',
      date: toLocalYyyyMmDd(day.date),
      phase: 'unknown',
      isPregnant: false,
      isBreastfeeding: false,
      isPostpartum: false,
      dietaryRestrictionsSnapshot: {
        vegetarian: false,
        vegan: false,
        pescatarian: false,
        glutenFree: false,
        dairyFree: false,
        nutAllergy: false,
        cuisines: [],
      },
      timeSlots: day.timeSlots || [],
      createdAt: weeklyPlan.createdAt || new Date().toISOString(),
      updatedAt: weeklyPlan.updatedAt || new Date().toISOString(),
    }));
    return {
      data,
      source: 'weekly_generated',
      planningStatus: 'generated',
      weekKey,
    };
  }

  return {
    data: [],
    source: 'none',
    planningStatus: 'none',
    weekKey,
  };
}

/** One row per plan using each plan's own `date` (weekly snapshot or legacy daily docs). */
export function weeklyPlanRowsFromSnapshotPlans(
  plans: DailyMealPlan[],
): WeeklyPlanRow[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return plans.map(plan => {
    const d = new Date(plan.date);
    const isoDate = toLocalYyyyMmDd(d);
    const dayOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return {
      isoDate,
      label: d.toLocaleDateString(undefined, { weekday: 'long' }),
      isToday: dayOnly.getTime() === today.getTime(),
      plan,
    };
  });
}

/** Monday-anchored rows when plans do not carry reliable per-day dates. */
export function weeklyPlanRowsFromDailyPlans(
  data: DailyMealPlan[],
  startDate: string,
): WeeklyPlanRow[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.map((plan, index) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + index);
    const isoDate = toLocalYyyyMmDd(d);
    return {
      isoDate,
      label: d.toLocaleDateString(undefined, { weekday: 'long' }),
      isToday: d.getTime() === today.getTime(),
      plan,
    };
  });
}

export function weeklyPlanRowsForNutritionUi(
  plans: DailyMealPlan[],
  weekStartMondayIsoFallback: string,
): WeeklyPlanRow[] {
  const allHaveDates =
    plans.length > 0 &&
    plans.every(p => p?.date != null && String(p.date).trim() !== '');
  if (allHaveDates) {
    return weeklyPlanRowsFromSnapshotPlans(plans);
  }
  return weeklyPlanRowsFromDailyPlans(plans, weekStartMondayIsoFallback);
}
