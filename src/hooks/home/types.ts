import type { RitualSection } from '../../services/api';

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
