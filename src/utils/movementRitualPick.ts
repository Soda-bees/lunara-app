import type { LoggedWorkout, WorkoutOption } from '../services/api';
import {
  sectionFromWorkoutDoc,
  type RitualSection,
} from './ritualSections';

const RITUAL_ORDER: RitualSection[] = ['morning', 'midday', 'evening'];

export type PlannedMovementWinner = {
  section: RitualSection;
  planned: WorkoutOption;
  originalIndex: number;
};

const normalizeWorkoutId = (workoutId: unknown): string | null => {
  if (!workoutId) return null;
  if (typeof workoutId === 'string') return workoutId;
  if (typeof workoutId === 'object' && workoutId !== null) {
    const o = workoutId as { _id?: unknown };
    if (o._id != null) return String(o._id);
  }
  return null;
};

const loggedAtMs = (entry: LoggedWorkout): number => {
  const t = new Date(entry.loggedAt).getTime();
  return Number.isFinite(t) ? t : 0;
};

/**
 * At most one planned workout per ritual section (morning / midday / evening).
 * Highest phaseFitScore wins; tie-break lower plan index.
 */
export function pickPlannedMovementWinners(
  planned: WorkoutOption[],
): PlannedMovementWinner[] {
  const best = new Map<
    RitualSection,
    { planned: WorkoutOption; originalIndex: number; score: number }
  >();

  planned.forEach((w, idx) => {
    const section = sectionFromWorkoutDoc(w.workout, idx);
    const raw = w.phaseFitScore;
    const score = typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;

    const prev = best.get(section);
    if (
      !prev ||
      score > prev.score ||
      (score === prev.score && idx < prev.originalIndex)
    ) {
      best.set(section, { planned: w, originalIndex: idx, score });
    }
  });

  return RITUAL_ORDER.filter(s => best.has(s)).map(s => {
    const row = best.get(s)!;
    return {
      section: s,
      planned: row.planned,
      originalIndex: row.originalIndex,
    };
  });
}

export type GapFillMovementLog = {
  section: RitualSection;
  log: LoggedWorkout;
};

/**
 * Custom / unlinked logs only for sections with no planned winner.
 * At most one log per section; latest loggedAt wins ties.
 */
export function pickGapFillMovementLogs(
  logged: LoggedWorkout[],
  sectionsWithPlanned: Set<RitualSection>,
  plannedLength: number,
): GapFillMovementLog[] {
  const filtered = logged.filter(
    l => Boolean(l.isCustom) || !normalizeWorkoutId(l.workoutId),
  );

  const best = new Map<RitualSection, LoggedWorkout>();

  filtered.forEach((l, idx) => {
    const section = sectionFromWorkoutDoc(l.workoutId, plannedLength + idx);
    if (sectionsWithPlanned.has(section)) return;

    const prev = best.get(section);
    if (!prev || loggedAtMs(l) >= loggedAtMs(prev)) {
      best.set(section, l);
    }
  });

  return RITUAL_ORDER.filter(s => best.has(s)).map(s => ({
    section: s,
    log: best.get(s)!,
  }));
}
