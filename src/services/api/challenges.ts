import { apiCall } from './httpClient';

// Challenge API Types
export interface ChallengePhase {
  name: string;
  startDay: number;
  endDay: number;
  goal?: string;
  description?: string;
}

export interface ChallengePathway {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  whatItDoes: string[];
  howWeAddress: string[];
}

export interface ChallengeStackTimingInfo {
  heading: string;
  description: string;
}

export interface ChallengeStackPhase {
  name: string;
  days?: string;
  goal?: string;
  supplements: {
    timing: string;
    items: string[];
  }[];
}

export interface ChallengeStackContent {
  title: string;
  description?: string;
  timingInfo: ChallengeStackTimingInfo[];
  phases: ChallengeStackPhase[];
}

export interface ChallengeFeatures {
  hasPathways: boolean;
  hasStackContent: boolean;
  hasPhases: boolean;
}

export interface Challenge {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  duration: number;
  phases: ChallengePhase[];
  pathways: ChallengePathway[];
  stackContent?: ChallengeStackContent | null;
  gradientColors?: string[];
  isActive: boolean;
  features?: ChallengeFeatures;
}

export interface ChallengeInstanceSummary {
  id: string;
  status: 'active' | 'completed' | 'abandoned';
  currentDay: number;
  streak: number;
  progress: number;
}

export interface ChallengeListItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  duration: number;
  phases: ChallengePhase[];
  gradientColors?: string[];
  features?: ChallengeFeatures;
  userInstance: ChallengeInstanceSummary | null;
}

export interface GetAllChallengesResponse {
  success: boolean;
  data: ChallengeListItem[];
}

export interface GetChallengeDetailResponse {
  success: boolean;
  data: Challenge;
}

export interface StartChallengeResponse {
  success: boolean;
  data: {
    instanceId: string;
    challenge: Challenge;
    startDate: string;
  };
}

export type ChallengeTaskType =
  | 'supplement'
  | 'meal'
  | 'workout'
  | 'habit'
  | 'info';

export interface ChallengeTask {
  _id: string;
  type: ChallengeTaskType;
  title: string;
  description?: string;
  icon?: string;
  completed: boolean;
  externalRef?: string;
  // Deprecated: Sync fields no longer used, kept for backward compatibility
  syncWithNutrition?: boolean;
  syncMealSlot?: string;
  syncMealTime?: string;
  syncWithWorkout?: boolean;
  syncWorkoutId?: string | null;
}

export interface ChallengeDay {
  dayNumber: number;
  weekNumber: number;
  focusTitle: string;
  focusDescription?: string;
  focusAction?: string;
  tasks: ChallengeTask[];
  progress: {
    completed: number;
    total: number;
  };
  mealPlanLink?: string | null;
}

export interface GetChallengeTodayResponse {
  success: boolean;
  data: ChallengeDay;
}

export interface CompleteChallengeTaskResponse {
  success: boolean;
  data: {
    taskId: string;
    completed: boolean;
    streak: number;
    progress: {
      currentDay: number;
      totalDays: number;
      completionPercentage: number;
      day: {
        completed: number;
        total: number;
      };
    };
  };
}

export interface GetChallengeStackContentResponse {
  success: boolean;
  data: {
    currentPhase: ChallengePhase | null;
    stackContent: ChallengeStackContent | null;
    duration: number;
  };
}

export interface ChallengePathwayWithProgress extends ChallengePathway {
  percentage: number;
}

export interface GetChallengePathwaysResponse {
  success: boolean;
  data: {
    currentWeek: number;
    pathways: ChallengePathwayWithProgress[];
    duration: number;
    currentPhase: ChallengePhase | null;
    challengeTitle: string;
    challengeDescription: string | null;
  };
}

export interface ChallengeHabitTask {
  id: string;
  title: string;
  type: 'supplement' | 'meal' | 'workout' | 'habit' | 'info';
  icon?: string;
  description?: string;
  pathway: 'Liver' | 'Gut' | 'Lymphatic' | null;
  completedDays: number;
  totalDays: number;
}

export interface ChallengePhaseHabits {
  name: string;
  startDay: number;
  endDay: number;
  goal?: string;
  description?: string;
  unlocked: boolean;
  mastered: boolean;
  tasks: ChallengeHabitTask[];
}

export interface GetChallengeHabitsResponse {
  success: boolean;
  data: {
    phases: ChallengePhaseHabits[];
    currentDay: number;
  };
}

export interface GetChallengeProgressResponse {
  success: boolean;
  data: {
    currentDay: number;
    totalDays: number;
    streak: number;
    completionPercentage: number;
    status: 'active' | 'completed' | 'abandoned';
  };
}

// Challenge API Functions
export async function getAllChallenges(): Promise<GetAllChallengesResponse> {
  return apiCall<GetAllChallengesResponse>('/challenges', {
    method: 'GET',
  });
}

export async function getChallengeDetail(
  id: string,
): Promise<GetChallengeDetailResponse> {
  return apiCall<GetChallengeDetailResponse>(`/challenges/${id}`, {
    method: 'GET',
  });
}

export async function startChallenge(
  id: string,
): Promise<StartChallengeResponse> {
  return apiCall<StartChallengeResponse>(`/challenges/${id}/start`, {
    method: 'POST',
  });
}

export async function getChallengeToday(
  instanceId: string,
): Promise<GetChallengeTodayResponse> {
  return apiCall<GetChallengeTodayResponse>(
    `/challenges/instances/${instanceId}/today`,
    {
      method: 'GET',
    },
  );
}

export async function completeChallengeTask(
  instanceId: string,
  taskId: string,
  completed?: boolean,
): Promise<CompleteChallengeTaskResponse> {
  return apiCall<CompleteChallengeTaskResponse>(
    `/challenges/instances/${instanceId}/tasks/${taskId}/complete`,
    {
      method: 'POST',
      body: JSON.stringify(typeof completed === 'boolean' ? { completed } : {}),
    },
  );
}

export async function getChallengeStackContent(
  instanceId: string,
): Promise<GetChallengeStackContentResponse> {
  return apiCall<GetChallengeStackContentResponse>(
    `/challenges/instances/${instanceId}/stack`,
    {
      method: 'GET',
    },
  );
}

export async function getChallengePathways(
  instanceId: string,
): Promise<GetChallengePathwaysResponse> {
  return apiCall<GetChallengePathwaysResponse>(
    `/challenges/instances/${instanceId}/pathways`,
    {
      method: 'GET',
    },
  );
}

export async function getChallengeHabits(
  instanceId: string,
): Promise<GetChallengeHabitsResponse> {
  return apiCall<GetChallengeHabitsResponse>(
    `/challenges/instances/${instanceId}/habits`,
    {
      method: 'GET',
    },
  );
}

export async function getChallengeProgress(
  instanceId: string,
): Promise<GetChallengeProgressResponse> {
  return apiCall<GetChallengeProgressResponse>(
    `/challenges/instances/${instanceId}/progress`,
    {
      method: 'GET',
    },
  );
}
