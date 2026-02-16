import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API configuration
// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works fine
// For physical devices, use your computer's IP address (e.g., http://192.168.1.100:3000/api)

const getBaseURL = () => {
  if (!__DEV__) {
    return 'https://lunaranew-e6853745dbd7.herokuapp.com/api'; // Production
  }

  // For Android
  if (Platform.OS === 'android') {
    // Use your computer's IP address for physical device
    // Change this to your computer's IPv4 address when testing on physical device
    // Use '10.0.2.2' for Android emulator
    const PHYSICAL_DEVICE_IP = '192.168.100.207'; // Your computer's IP address
    return `http://${PHYSICAL_DEVICE_IP}:3000/api`; // Physical device
    // return 'http://10.0.2.2:3000/api'; // Uncomment this for Android emulator
  }

  // For iOS simulator
  return 'http://localhost:3000/api'; // iOS simulator
};

const API_BASE_URL = getBaseURL();

// Types
export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  age?: string;
  height?: string;
  weight?: string;
  activityLevel?: string;
  primaryGoal?: string;
  targetWeight?: string;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;
  dietaryRestrictions?: {
    vegetarian: boolean;
    vegan: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutAllergy: boolean;
  };
  otherAllergies?: string;
  cuisinePreferences?: string[];
  dislikedFoods?: string;
  favoriteFoods?: string;
  mealFrequency?: string;
  cookingSkill?: string;
  mealPrepPreference?: string;
  budgetRange?: string;
  medicalConditions?: string[];
  medications?: string;
}

export interface SignupResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message?: string;
}

// Helper function to make API calls
export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  retryable?: boolean;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 2,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available (for future authenticated requests)
  const token = await getStoredToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let lastError: ApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: any = { message: 'An error occurred' };

        try {
          errorData = await response.json();
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorData = { message: text || `Server error: ${response.status}` };
          } catch {
            errorData = { message: `Server error: ${response.status}` };
          }
        }

        const errorObj: ApiError = new Error(
          errorData.message ||
            errorData.error ||
            `API error: ${response.status}`,
        ) as ApiError;

        errorObj.status = response.status;
        errorObj.details = errorData;

        // Provide user-friendly messages based on status code
        if (response.status === 400) {
          errorObj.message =
            errorData.message || 'Invalid request. Please check your input.';
        } else if (response.status === 401) {
          errorObj.message = 'Session expired. Please log in again.';
          errorObj.code = 'UNAUTHORIZED';
        } else if (response.status === 403) {
          errorObj.message =
            'You do not have permission to perform this action.';
        } else if (response.status === 404) {
          errorObj.message = 'The requested resource was not found.';
        } else if (response.status === 422) {
          // Validation errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorObj.message = errorData.errors
              .map((e: any) => e.msg || e.message)
              .join(', ');
          } else {
            errorObj.message =
              errorData.message || 'Validation error. Please check your input.';
          }
        } else if (response.status >= 500) {
          errorObj.message = 'Server error. Please try again later.';
          errorObj.retryable = true;
        }

        // Retry on server errors (5xx) or network errors
        if (errorObj.retryable && attempt < retries) {
          await new Promise<void>(resolve =>
            setTimeout(() => resolve(), 1000 * (attempt + 1)),
          );
          lastError = errorObj;
          continue;
        }

        throw errorObj;
      }

      return response.json();
    } catch (error: any) {
      // Better error handling for network issues
      if (
        error.message === 'Network request failed' ||
        error.message.includes('Failed to connect') ||
        error.message.includes('NetworkError') ||
        error.name === 'TypeError' ||
        !error.status
      ) {
        const networkError: ApiError = new Error(
          'Network error. Please check your internet connection and try again.',
        ) as ApiError;
        networkError.code = 'NETWORK_ERROR';
        networkError.retryable = true;

        // Retry on network errors
        if (attempt < retries) {
          await new Promise<void>(resolve =>
            setTimeout(() => resolve(), 1000 * (attempt + 1)),
          );
          lastError = networkError;
          continue;
        }

        throw networkError;
      }

      // If it's not a retryable error, throw immediately
      if (error.status && error.status < 500) {
        throw error;
      }

      lastError = error;
    }
  }

  // If we've exhausted retries, throw the last error
  throw lastError || new Error('Request failed after multiple attempts');
}

// Token storage helpers (using AsyncStorage in React Native)
export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
}

export async function clearToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}

// API functions
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiCall<SignupResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiCall<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function forgotPassword(
  email: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    return await apiCall<{ success: boolean; message?: string }>(
      '/auth/forgot-password',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
    );
  } catch (error: any) {
    // Handle 404 (email not found) - return error response instead of throwing
    if (error.status === 404 || error.message?.includes('not registered')) {
      return {
        success: false,
        message:
          error.message ||
          'This email is not registered. Please check your email or sign up.',
      };
    }
    // Re-throw other errors (network errors, etc.)
    throw error;
  }
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

export interface GoogleAuthRequest {
  idToken: string;
  email?: string;
  name?: string;
  // Onboarding data (optional - for completing signup)
  age?: string;
  height?: string;
  weight?: string;
  activityLevel?: string;
  primaryGoal?: string;
  targetWeight?: string;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;
  dietaryRestrictions?: {
    vegetarian: boolean;
    vegan: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutAllergy: boolean;
  };
  otherAllergies?: string;
  cuisinePreferences?: string[];
  dislikedFoods?: string;
  favoriteFoods?: string;
  mealFrequency?: string;
  cookingSkill?: string;
  mealPrepPreference?: string;
  budgetRange?: string;
  medicalConditions?: string[];
  medications?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  user?: {
    id?: string;
    email: string;
    name: string;
  };
  token?: string;
  message?: string;
  isNewUser?: boolean;
}

export async function googleAuth(
  data: GoogleAuthRequest,
): Promise<GoogleAuthResponse> {
  return apiCall<GoogleAuthResponse>('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

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

// Cycle Symptom API Types
export type CycleSymptomType =
  | 'Energy'
  | 'Mood'
  | 'Focus'
  | 'Cramps'
  | 'Bloating'
  | 'Headache'
  | 'Breast Tenderness'
  | 'Acne'
  | 'Food Cravings'
  | 'Back Pain'
  | 'Nausea';

export type CycleSymptomSeverity =
  | 'mild'
  | 'moderate'
  | 'severe'
  | 'low'
  | 'medium'
  | 'high'
  | 'poor'
  | 'neutral'
  | 'good'
  | 'fair';

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
  severity: 'mild' | 'moderate' | 'severe';
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

// Sleep API Types
export interface Sleep {
  _id: string;
  user: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
  cyclePhase?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null;
  pregnancyWeek?: number | null;
  trimester?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LogSleepRequest {
  date: string;
  bedTime: string;
  wakeTime: string;
  quality: number;
  notes?: string;
}

export interface SleepResponse {
  success: boolean;
  data: Sleep;
  message?: string;
}

export interface SleepsResponse {
  success: boolean;
  data: Sleep[];
  pagination?: {
    page: number;
    pages: number;
    limit: number;
    total: number;
  };
}

export interface SleepStatisticsResponse {
  success: boolean;
  data: {
    sevenDayGoal: {
      totalDays: number;
      daysWith8Plus: number;
      percentage: number;
      recentLogCount: number;
      days: Array<{
        date: string;
        hours: number | null;
      }>;
    };
    averages: {
      duration: number | null;
      quality: number | null;
    };
    totalLogs: number;
  };
}

export interface SleepPhasePattern {
  phase: string;
  avgDuration: number | null;
  avgQuality: number | null;
  count: number;
}

export interface SleepPatternsResponse {
  success: boolean;
  data: SleepPhasePattern[];
}

export interface SleepInsightsResponse {
  success: boolean;
  data: string[];
}

export interface UpdateSleepRequest {
  date?: string;
  bedTime?: string;
  wakeTime?: string;
  quality?: number;
  notes?: string;
}

// Sleep API Functions
export async function logSleep(
  data: LogSleepRequest,
): Promise<SleepResponse> {
  return apiCall<SleepResponse>('/sleep', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface SleepFilters {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getSleepLogs(
  filters?: SleepFilters,
): Promise<SleepsResponse> {
  const params = new URLSearchParams();
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  return apiCall<SleepsResponse>(`/sleep${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
  });
}

export async function getSleepStatistics(): Promise<SleepStatisticsResponse> {
  return apiCall<SleepStatisticsResponse>('/sleep/statistics', {
    method: 'GET',
  });
}

export async function getSleepPatternsByPhase(): Promise<SleepPatternsResponse> {
  return apiCall<SleepPatternsResponse>('/sleep/patterns', {
    method: 'GET',
  });
}

export async function getSleepInsights(): Promise<SleepInsightsResponse> {
  return apiCall<SleepInsightsResponse>('/sleep/insights', {
    method: 'GET',
  });
}

export async function getSleep(id: string): Promise<SleepResponse> {
  return apiCall<SleepResponse>(`/sleep/${id}`, {
    method: 'GET',
  });
}

export async function updateSleep(
  id: string,
  data: UpdateSleepRequest,
): Promise<SleepResponse> {
  return apiCall<SleepResponse>(`/sleep/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSleep(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(`/sleep/${id}`, {
    method: 'DELETE',
  });
}

// Cycle Phase Content API Types
export interface CyclePhaseContent {
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  energyLevel: 'low' | 'rising' | 'high' | 'declining';
  bestFor: string[];
  nutrition: string[];
  movement: string[];
  mindset: string[];
  understanding: string;
  isActive: boolean;
}

export interface CyclePhaseContentResponse {
  success: boolean;
  data: CyclePhaseContent[];
}

export async function getCyclePhaseContent(): Promise<CyclePhaseContentResponse> {
  return apiCall<CyclePhaseContentResponse>('/cycle-phase-content', {
    method: 'GET',
  });
}

// Weekly Updates API Types
export interface WeeklyUpdate {
  title: string;
  message: string;
  iconType: 'energy' | 'mental' | 'metabolism' | 'mood' | 'fertility' | 'nutrition' | 'movement';
  color: string;
  iconColor?: string;
  order: number;
}

export interface WeeklyUpdatesResponse {
  success: boolean;
  data: WeeklyUpdate[];
}

// Did You Know API Types
export interface DidYouKnow {
  fact: string;
  author?: string | null;
}

export interface DidYouKnowResponse {
  success: boolean;
  data: DidYouKnow;
}

// Personalized Insight API Types
export interface PersonalizedInsight {
  insight: string;
}

export interface PersonalizedInsightResponse {
  success: boolean;
  data: PersonalizedInsight | null;
}

// Weekly Updates API Functions
export async function getWeeklyUpdatesByPhase(
  phase: string,
): Promise<WeeklyUpdatesResponse> {
  return apiCall<WeeklyUpdatesResponse>(`/cycle-phase-content/${phase}/weekly-updates`, {
    method: 'GET',
  });
}

// Did You Know API Functions
export async function getDidYouKnowByPhase(
  phase: string,
): Promise<DidYouKnowResponse> {
  return apiCall<DidYouKnowResponse>(`/cycle-phase-content/${phase}/did-you-know`, {
    method: 'GET',
  });
}

// Personalized Insight API Functions
export async function getPersonalizedInsight(): Promise<PersonalizedInsightResponse> {
  return apiCall<PersonalizedInsightResponse>('/cycle-phase-content/personalized-insight', {
    method: 'GET',
  });
}

// User API
export interface User {
  _id: string;
  fullName: string;
  email: string;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  isPregnant?: boolean;
  trimester?: number;
  isBreastfeeding?: boolean;
  // Add other user fields as needed
}

export interface GetMeResponse {
  success: boolean;
  user: User;
}

export async function getMe(): Promise<GetMeResponse> {
  return apiCall<GetMeResponse>('/auth/me', {
    method: 'GET',
  });
}

// Nutrition API Types
export interface MealOption {
  meal: string;
  title: string;
  description: string;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
}

export interface NutritionTimeSlot {
  time: string;
  label: string;
  options: MealOption[];
  selectedOptionIndex: number;
  completed: boolean;
}

export interface DailyMealPlan {
  _id: string;
  user: string;
  date: string;
  phase: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | 'unknown';
  isPregnant: boolean;
  isBreastfeeding: boolean;
  isPostpartum: boolean;
  primaryGoal?: string | null;
  dietaryRestrictionsSnapshot: {
    vegetarian: boolean;
    vegan: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutAllergy: boolean;
    cuisines: string[];
    dislikedFoods?: string;
    favoriteFoods?: string;
    budgetRange?: string;
  };
  timeSlots: NutritionTimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyMealPlanResponse {
  success: boolean;
  data: DailyMealPlan;
}

export interface SwapMealResponse {
  success: boolean;
  data: {
    index: number;
    time: string;
    selectedOptionIndex: number;
  };
}

export interface SetMealCompletedResponse {
  success: boolean;
  data: {
    index: number;
    time: string;
    completed: boolean;
  };
}

export async function getDailyNutritionPlan(
  date?: string,
): Promise<DailyMealPlanResponse> {
  const params = new URLSearchParams();
  if (date) {
    params.append('date', date);
  }
  const query = params.toString();
  const endpoint = `/nutrition/plan${query ? `?${query}` : ''}`;
  return apiCall<DailyMealPlanResponse>(endpoint, {
    method: 'GET',
  });
}

export async function swapMealOptionApi(
  date: string,
  params: { time?: string; slotIndex?: number },
): Promise<SwapMealResponse> {
  return apiCall<SwapMealResponse>('/nutrition/plan/swap', {
    method: 'POST',
    body: JSON.stringify({ date, ...params }),
  });
}

export async function setMealCompletedApi(
  date: string,
  params: { time?: string; slotIndex?: number; completed: boolean },
): Promise<SetMealCompletedResponse> {
  return apiCall<SetMealCompletedResponse>('/nutrition/plan/complete', {
    method: 'POST',
    body: JSON.stringify({ date, ...params }),
  });
}
