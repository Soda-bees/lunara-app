import type {
  CycleSymptomSeverity,
  CycleSymptomType,
} from '../../constants/cycleSymptoms';
import { apiCall } from './httpClient';

// Period API Types
export interface Period {
  _id: string;
  user: string;
  startDate: string;
  endDate?: string; // Optional - can be added later when period ends
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePeriodRequest {
  startDate: string;
  endDate?: string; // Optional - can be added later
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface UpdatePeriodRequest {
  startDate?: string;
  endDate?: string;
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface PeriodsResponse {
  success: boolean;
  data: Period[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PeriodResponse {
  success: boolean;
  data: Period;
  message?: string;
}

export interface CycleStatusResponse {
  success: boolean;
  data: {
    isTracking: boolean;
    phase?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
    cycleDay?: number;
    description?: string;
    tagline?: string;
    fertilityLevel?: 'low' | 'medium' | 'high';
    fertileWindowStart?: string | null;
    fertileWindowEnd?: string | null;
    fertilityDescription?: string | null;
    daysSinceStart?: number;
    nextPeriodDate?: string;
    daysUntilNextPeriod?: number | null;
    averageCycleLength?: number;
    averagePeriodLength?: number;
    lastPeriodStartDate?: string;
    lastPeriodEndDate?: string;
    regularityScore?: number | null;
    regularityClassification?:
      | 'very_regular'
      | 'regular'
      | 'irregular'
      | 'very_irregular'
      | 'insufficient_data';
    predictionConfidence?: number;
    dataQuality?: 'excellent' | 'good' | 'fair' | 'needs_improvement';
    energyLevel?: 'low' | 'rising' | 'high' | 'declining' | null;
    bestFor?: string[];
    nutrition?: string[];
    movement?: string[];
    mindset?: string[];
    understanding?: string | null;
    irregularCycles?: Array<{
      cycleLength: number;
      startDate: string;
      previousStartDate: string;
      type: 'short' | 'long';
    }>;
    hasIrregularCycles?: boolean;
    irregularCycleMessage?: string | null;
    missingPeriods?: Array<{
      expectedDate: string;
      actualNextDate: string | null;
      gapDays: number;
      isRecent?: boolean;
    }>;
    hasMissingPeriods?: boolean;
    missingPeriodMessage?: string | null;
    isPaused?: boolean;
    pauseReason?: 'pregnancy' | 'breastfeeding';
    message?: string;
  };
}

// Period API Functions
export async function createPeriod(
  data: CreatePeriodRequest,
): Promise<PeriodResponse> {
  return apiCall<PeriodResponse>('/periods', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface PeriodFilters {
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: 'newest' | 'oldest';
}

export async function getPeriods(
  page: number = 1,
  limit: number = 50,
  filters?: PeriodFilters,
): Promise<PeriodsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (filters?.startDate) {
    params.append('startDate', filters.startDate);
  }
  if (filters?.endDate) {
    params.append('endDate', filters.endDate);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }
  if (filters?.sort) {
    params.append('sort', filters.sort);
  }

  return apiCall<PeriodsResponse>(`/periods?${params.toString()}`, {
    method: 'GET',
  });
}

export async function getPeriod(id: string): Promise<PeriodResponse> {
  return apiCall<PeriodResponse>(`/periods/${id}`, {
    method: 'GET',
  });
}

export async function getCurrentCycleStatus(): Promise<CycleStatusResponse> {
  return apiCall<CycleStatusResponse>('/periods/current', {
    method: 'GET',
  });
}

export async function updatePeriod(
  id: string,
  data: UpdatePeriodRequest,
): Promise<PeriodResponse> {
  return apiCall<PeriodResponse>(`/periods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePeriod(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(`/periods/${id}`, {
    method: 'DELETE',
  });
}

export interface PeriodAnalyticsResponse {
  success: boolean;
  data: {
    cycleTrend?: 'increasing' | 'decreasing' | 'stable';
    periodTrend?: 'increasing' | 'decreasing' | 'stable';
    topSymptoms?: Array<{ symptom: string; count: number }>;
    flowDistribution?: {
      light: number;
      medium: number;
      heavy: number;
    };
    cycleRange?: {
      min: number | null;
      max: number | null;
      average: number | null;
    };
    periodRange?: {
      min: number | null;
      max: number | null;
      average: number | null;
    };
    totalPeriods?: number;
    totalCycles?: number;
    message?: string;
  };
}

/** Period analytics — bounded server-side to last 50 periods (PERF-003). */
export async function getPeriodAnalytics(): Promise<PeriodAnalyticsResponse> {
  return apiCall<PeriodAnalyticsResponse>('/periods/analytics', {
    method: 'GET',
  });
}

export interface PeriodStatisticsResponse {
  success: boolean;
  data: {
    totalPeriods?: number;
    dateRange?: {
      firstPeriodDate: string;
      lastPeriodDate: string;
    };
    cycleLength?: {
      average: number | null;
      longest: number | null;
      shortest: number | null;
      totalCycles: number;
    };
    periodLength?: {
      average: number | null;
      longest: number | null;
      shortest: number | null;
    };
    mostCommonSymptoms?: Array<{ symptom: string; count: number }>;
    flowDistribution?: {
      light: number;
      medium: number;
      heavy: number;
    };
    message?: string;
  };
}

/** Period statistics — bounded server-side to last 50 periods (PERF-003). */
export async function getPeriodStatistics(): Promise<PeriodStatisticsResponse> {
  return apiCall<PeriodStatisticsResponse>('/periods/statistics', {
    method: 'GET',
  });
}

// Pregnancy API Types
export interface PregnancySymptom {
  date: string;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface BabyDevelopmentInfo {
  week: number;
  size: string;
  development: string;
}

export interface TrimesterInsights {
  nutrition: string[];
  exercise: string[];
  symptoms: string[];
  warnings: string[];
  whatToExpect: string[];
}

export interface PregnancyStatusResponse {
  success: boolean;
  data: {
    isPregnant: boolean;
    pregnancyWeek?: number;
    trimester?: number;
    dueDate?: string;
    lastMenstrualPeriod?: string;
    daysUntilDueDate?: number;
    babyDevelopment?: BabyDevelopmentInfo;
    trimesterInsights?: TrimesterInsights;
    progressPercentage?: number;
    pregnancyNotes?: string;
    pregnancyStartDate?: string;
    message?: string;
  };
}

export async function getPregnancyStatus(): Promise<PregnancyStatusResponse> {
  return apiCall<PregnancyStatusResponse>('/pregnancy/status', {
    method: 'GET',
  });
}

export interface UpdatePregnancyInfoRequest {
  dueDate?: string;
  lastMenstrualPeriod?: string;
  pregnancyNotes?: string;
  isPregnant?: boolean; // Allow setting isPregnant to true
  trimester?: 1 | 2 | 3 | null;
}

export interface UpdatePregnancyInfoResponse {
  success: boolean;
  data: {
    dueDate?: string;
    lastMenstrualPeriod?: string;
    pregnancyNotes?: string;
  };
  message?: string;
}

export async function updatePregnancyInfo(
  data: UpdatePregnancyInfoRequest,
): Promise<UpdatePregnancyInfoResponse> {
  return apiCall<UpdatePregnancyInfoResponse>('/pregnancy/info', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export interface LogPregnancySymptomRequest {
  date: string;
  symptom: string;
  severity?: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface LogPregnancySymptomResponse {
  success: boolean;
  data: PregnancySymptom;
  message?: string;
}

export async function logPregnancySymptom(
  data: LogPregnancySymptomRequest,
): Promise<LogPregnancySymptomResponse> {
  return apiCall<LogPregnancySymptomResponse>('/pregnancy/symptoms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface PregnancyHistoryResponse {
  success: boolean;
  data: PregnancySymptom[];
}

export async function getPregnancyHistory(): Promise<PregnancyHistoryResponse> {
  return apiCall<PregnancyHistoryResponse>('/pregnancy/history', {
    method: 'GET',
  });
}

export interface TransitionToPostpartumRequest {
  birthDate: string;
  resumeCycleTracking?: boolean;
}

export interface TransitionToPostpartumResponse {
  success: boolean;
  data: {
    isPregnant: boolean;
    birthDate?: string;
    postpartumWeek?: number;
    isTrackingCycle?: boolean;
  };
  message?: string;
}

export async function transitionToPostpartum(
  data: TransitionToPostpartumRequest,
): Promise<TransitionToPostpartumResponse> {
  return apiCall<TransitionToPostpartumResponse>('/pregnancy/postpartum', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface CycleSymptom {
  _id?: string;
  date: string;
  symptom: CycleSymptomType;
  severity: CycleSymptomSeverity;
  notes?: string;
}

export interface LogCycleSymptomRequest {
  date: string;
  symptom: CycleSymptomType;
  severity?: CycleSymptomSeverity;
  notes?: string;
}

export interface CycleSymptomResponse {
  success: boolean;
  data: CycleSymptom;
  message?: string;
}

export interface CycleSymptomsResponse {
  success: boolean;
  data: CycleSymptom[];
}

export interface CycleSymptomPattern {
  symptom: string;
  severity: CycleSymptomSeverity;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface CycleSymptomPatternsResponse {
  success: boolean;
  data: {
    patterns: CycleSymptomPattern[];
  };
}

export interface CycleSymptomHistoryItem {
  day: number | null;
  date: string;
  phase: string;
  symptoms: Record<string, string>;
  note?: string | null;
}

export interface CycleSymptomHistoryResponse {
  success: boolean;
  data: CycleSymptomHistoryItem[];
}

// Cycle Symptom API Functions
export async function logCycleSymptom(
  data: LogCycleSymptomRequest,
): Promise<CycleSymptomResponse> {
  return apiCall<CycleSymptomResponse>('/symptoms/cycle', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getCycleSymptoms(
  startDate?: string,
  endDate?: string,
): Promise<CycleSymptomsResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const queryString = params.toString();
  return apiCall<CycleSymptomsResponse>(
    `/symptoms/cycle${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
    },
  );
}

export async function getCycleSymptomPatterns(): Promise<CycleSymptomPatternsResponse> {
  return apiCall<CycleSymptomPatternsResponse>('/symptoms/cycle/patterns', {
    method: 'GET',
  });
}

export async function getCycleSymptomHistory(): Promise<CycleSymptomHistoryResponse> {
  return apiCall<CycleSymptomHistoryResponse>('/symptoms/cycle/history', {
    method: 'GET',
  });
}

export async function getCycleSymptom(
  id: string,
): Promise<CycleSymptomResponse> {
  return apiCall<CycleSymptomResponse>(`/symptoms/cycle/${id}`, {
    method: 'GET',
  });
}

export interface UpdateCycleSymptomRequest {
  date?: string;
  symptom?: CycleSymptomType;
  severity?: CycleSymptomSeverity;
  notes?: string;
}

export async function updateCycleSymptom(
  id: string,
  data: UpdateCycleSymptomRequest,
): Promise<CycleSymptomResponse> {
  return apiCall<CycleSymptomResponse>(`/symptoms/cycle/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCycleSymptom(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(
    `/symptoms/cycle/${id}`,
    {
      method: 'DELETE',
    },
  );
}

