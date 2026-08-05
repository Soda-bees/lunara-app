import { apiCall } from './httpClient';

// Workout API Types
export interface WorkoutOption {
  workout: string | { _id: string; [key: string]: any };
  title: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  type: string;
  equipment: string[];
  benefits: string[];
  tags: string[];
  phaseFitScore?: number;
}

export interface LoggedWorkout {
  _id?: string;
  workoutId?: string | { _id: string; [key: string]: any } | null;
  workoutTitleSnapshot: string;
  durationMinutes: number;
  isCustom: boolean;
  loggedAt: string;
}

export interface DailyWorkoutPlan {
  _id: string;
  user: string;
  date: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isPostpartum: boolean;
  primaryGoal?: string | null;
  activityLevel?: string | null;
  workouts: WorkoutOption[];
  loggedWorkouts: LoggedWorkout[];
  // Legacy fields (kept for backward compatibility)
  selectedOptionIndex?: number;
  completed?: boolean;
  loggedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DailyWorkoutPlanResponse {
  success: boolean;
  data: DailyWorkoutPlan;
}

export interface LogWorkoutRequest {
  date: string;
  workoutId?: string;
  loggedEntryId?: string;
  durationMinutes?: number;
  action?: 'add' | 'remove';
}

export interface LogWorkoutResponse {
  success: boolean;
  data: {
    loggedWorkouts: LoggedWorkout[];
    action: 'add' | 'remove';
  };
}

export async function getDailyWorkoutPlan(
  date?: string,
): Promise<DailyWorkoutPlanResponse> {
  const params = new URLSearchParams();
  if (date) {
    params.append('date', date);
  }
  const query = params.toString();
  const endpoint = `/workouts/plan${query ? `?${query}` : ''}`;
  return apiCall<DailyWorkoutPlanResponse>(endpoint, {
    method: 'GET',
  });
}

/**
 * Force-regenerate daily workout plan via POST (API-002 / MOB-021).
 * Prefer this over GET `forceRegenerate` (deprecated).
 */
export async function regenerateWorkoutPlan(body?: {
  date?: string;
}): Promise<DailyWorkoutPlanResponse> {
  return apiCall<DailyWorkoutPlanResponse>('/workouts/plan/regenerate', {
    method: 'POST',
    body: JSON.stringify(body || {}),
  });
}

export async function logWorkoutApi(
  date: string,
  workoutId?: string,
  action?: 'add' | 'remove',
  durationMinutes?: number,
  loggedEntryId?: string,
): Promise<LogWorkoutResponse> {
  return apiCall<LogWorkoutResponse>('/workouts/log', {
    method: 'POST',
    body: JSON.stringify({
      date,
      workoutId,
      action,
      durationMinutes,
      loggedEntryId,
    }),
  });
}

export interface WorkoutLibraryResponse {
  success: boolean;
  data: Workout[];
}

export interface CreateCustomWorkoutRequest {
  title: string;
  durationMinutes: number;
  description?: string;
  ritualSection?: 'morning' | 'midday' | 'evening';
}

export interface CreateCustomWorkoutResponse {
  success: boolean;
  data: Workout;
  reusedExisting?: boolean;
}

export interface UpdateCustomWorkoutRequest {
  title?: string;
  durationMinutes?: number;
  description?: string;
  ritualSection?: 'morning' | 'midday' | 'evening';
}

export interface UpdateCustomWorkoutResponse {
  success: boolean;
  data: Workout;
}

export interface DeleteCustomWorkoutResponse {
  success: boolean;
  data: { _id: string };
}

export async function getWorkoutLibrary(
  query?: string,
): Promise<WorkoutLibraryResponse> {
  const params = new URLSearchParams();
  if (query && query.trim()) {
    params.append('q', query.trim());
  }
  const qs = params.toString();
  return apiCall<WorkoutLibraryResponse>(`/workouts/library${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function createCustomWorkoutApi(
  body: CreateCustomWorkoutRequest,
): Promise<CreateCustomWorkoutResponse> {
  return apiCall<CreateCustomWorkoutResponse>('/workouts/custom', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateCustomWorkoutApi(
  id: string,
  body: UpdateCustomWorkoutRequest,
): Promise<UpdateCustomWorkoutResponse> {
  return apiCall<UpdateCustomWorkoutResponse>(`/workouts/custom/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function deleteCustomWorkoutApi(
  id: string,
): Promise<DeleteCustomWorkoutResponse> {
  return apiCall<DeleteCustomWorkoutResponse>(`/workouts/custom/${id}`, {
    method: 'DELETE',
  });
}

// Personalized Movement Content API Types
export interface PersonalizedMovementContent {
  title: string;
  description: string;
  duration: string;
  benefit: string;
  activities: string;
  energyLevel: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isPostpartum: boolean;
}

export interface PersonalizedMovementContentResponse {
  success: boolean;
  data: PersonalizedMovementContent;
}

export async function getPersonalizedMovementContent(
  date?: string,
): Promise<PersonalizedMovementContentResponse> {
  const params = new URLSearchParams();
  if (date) {
    params.append('date', date);
  }
  const query = params.toString();
  const endpoint = `/workouts/content${query ? `?${query}` : ''}`;
  return apiCall<PersonalizedMovementContentResponse>(endpoint, {
    method: 'GET',
  });
}

// Cycle Movement Map API Types
export interface CycleMovementMapPhase {
  phaseName: string;
  phaseLevel: 'Low' | 'Medium' | 'High';
  phaseTitle: string;
  phaseLogs: string[];
}

export interface CycleMovementMapResponse {
  success: boolean;
  data: CycleMovementMapPhase[];
}

export async function getCycleMovementMap(): Promise<CycleMovementMapResponse> {
  return apiCall<CycleMovementMapResponse>('/workouts/movement-map', {
    method: 'GET',
  });
}

// Movement Science API Types
export interface MovementScienceItem {
  title: string;
  description: string;
  image: string;
}

export interface MovementScienceResponse {
  success: boolean;
  data: MovementScienceItem[];
}

export async function getMovementScience(): Promise<MovementScienceResponse> {
  return apiCall<MovementScienceResponse>('/workouts/movement-science', {
    method: 'GET',
  });
}

// Phase Info API Types
export interface PhaseInfo {
  phaseName: string;
  phaseTitle: string;
  description: string;
  benefit: string;
  avoid: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isPostpartum: boolean;
}

export interface PhaseInfoResponse {
  success: boolean;
  data: PhaseInfo;
}

export async function getPhaseInfo(date?: string): Promise<PhaseInfoResponse> {
  const params = new URLSearchParams();
  if (date) {
    params.append('date', date);
  }
  const query = params.toString();
  const endpoint = `/workouts/phase-info${query ? `?${query}` : ''}`;
  return apiCall<PhaseInfoResponse>(endpoint, {
    method: 'GET',
  });
}

export interface Workout {
  _id: string;
  title: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  type: string;
  equipment: string[];
  instructions: string[];
  benefits: string[];
  cyclePhases: string[];
  pregnancySafe: boolean;
  postpartumSafe: boolean;
  breastfeedingSafe: boolean;
  tags: string[];
  goals: string[];
  ritualSection?: 'morning' | 'midday' | 'evening';
  isCustom?: boolean;
  createdBy?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutDetailResponse {
  success: boolean;
  data: Workout;
}

export async function getWorkoutDetail(
  id: string,
): Promise<WorkoutDetailResponse> {
  return apiCall<WorkoutDetailResponse>(`/workouts/${id}`, {
    method: 'GET',
  });
}

