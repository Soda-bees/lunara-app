import type { NutritionTimeSlot } from '../services/api';

export type RitualSection = 'morning' | 'midday' | 'evening';

/**
 * Buckets a meal slot into Morning / Midday / Evening using label keywords, then clock time.
 */
export function mealSlotSection(slot: NutritionTimeSlot): RitualSection {
  const label = (slot.label || '').toLowerCase();
  if (
    label.includes('breakfast') ||
    label.includes('morning snack') ||
    label.includes('mid-morning') ||
    label.includes('mid morning')
  ) {
    return 'morning';
  }
  if (label.includes('dinner')) {
    return 'evening';
  }
  if (
    label.includes('lunch') ||
    label.includes('afternoon snack') ||
    label.includes('snack')
  ) {
    return 'midday';
  }

  const raw = (slot.time || '12:00').trim();
  const [hStr, mStr] = raw.split(':');
  const h = Number(hStr);
  const m = Number(mStr) || 0;
  if (Number.isNaN(h)) return 'midday';
  const mins = h * 60 + m;
  if (mins < 11 * 60) return 'morning';
  if (mins < 17 * 60) return 'midday';
  return 'evening';
}

const WORKOUT_SECTION_CYCLE: RitualSection[] = [
  'morning',
  'midday',
  'evening',
];

/** Stable section from plan order when workouts have no scheduled time. */
export function workoutRitualSectionFromIndex(index: number): RitualSection {
  const i =
    Number.isFinite(index) && index >= 0 ? Math.floor(index) : 0;
  return WORKOUT_SECTION_CYCLE[i % 3];
}

/** Resolve ritual section from API workout shape; optional index fallback for legacy rows. */
export function sectionFromWorkoutDoc(
  workout: unknown,
  fallbackIndex?: number,
): RitualSection {
  if (workout && typeof workout === 'object' && 'ritualSection' in workout) {
    const s = (workout as { ritualSection?: string }).ritualSection;
    if (s === 'morning' || s === 'midday' || s === 'evening') {
      return s;
    }
  }
  if (fallbackIndex !== undefined) {
    return workoutRitualSectionFromIndex(fallbackIndex);
  }
  return 'midday';
}
