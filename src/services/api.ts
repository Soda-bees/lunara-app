import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as RUNTIME_API_BASE_URL } from '../config/runtimeConfig';
import { DeviceEventEmitter } from 'react-native';
import type {
  CycleSymptomSeverity,
  CycleSymptomType,
} from '../constants/cycleSymptoms';

// `react-native-encrypted-storage` is a native module. If it isn't correctly
// linked/available on the device, importing it can break the entire module.
// We use a guarded require and fall back to AsyncStorage to keep the app booting.
let EncryptedStorage: any = null;
try {
  const mod = require('react-native-encrypted-storage');
  EncryptedStorage = mod?.default ?? mod;
} catch {
  EncryptedStorage = null;
}

// API configuration
// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works fine
// For physical devices, use your computer's IP address (e.g., http://192.168.1.100:3000/api)

const API_BASE_URL = RUNTIME_API_BASE_URL;

// Types
export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  age?: string;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  measurementSystem?: 'metric' | 'imperial';
  /** @deprecated server maps legacy strings as cm/kg */
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

/** 401 on these routes means wrong credentials / pre-auth failure, not an expired session. */
function isUnauthenticatedAuthEndpoint(endpoint: string): boolean {
  const path = endpoint.split('?')[0];
  const publicAuthPaths = [
    '/auth/login',
    '/auth/signup',
    '/auth/google',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/partner/connect',
  ];
  return publicAuthPaths.some(p => path === p);
}

export type SessionType = 'owner' | 'partner';

const SESSION_TYPE_KEY = 'sessionType';

function isMutatingMethod(method?: string): boolean {
  const m = (method || 'GET').toUpperCase();
  return m === 'POST' || m === 'PUT' || m === 'PATCH' || m === 'DELETE';
}

function isPartnerAllowedMutation(endpoint: string, method?: string): boolean {
  const path = endpoint.split('?')[0];
  return path === '/partner/logout' && (method || 'GET').toUpperCase() === 'POST';
}

export async function getStoredSessionType(): Promise<SessionType> {
  try {
    const value = await AsyncStorage.getItem(SESSION_TYPE_KEY);
    return value === 'partner' ? 'partner' : 'owner';
  } catch {
    return 'owner';
  }
}

export async function storeSessionType(sessionType: SessionType): Promise<void> {
  try {
    await AsyncStorage.setItem(SESSION_TYPE_KEY, sessionType);
  } catch (error) {
    console.error('Error storing session type:', error);
  }
}

export async function clearSessionType(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SESSION_TYPE_KEY);
  } catch (error) {
    console.error('Error clearing session type:', error);
  }
}

export async function storeAuthSession(
  token: string,
  sessionType: SessionType = 'owner',
): Promise<void> {
  await storeToken(token);
  await storeSessionType(sessionType);
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 2,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';

  const skipAuthHeader = isUnauthenticatedAuthEndpoint(endpoint);
  const sessionType = skipAuthHeader ? 'owner' : await getStoredSessionType();
  if (
    sessionType === 'partner' &&
    isMutatingMethod(method) &&
    !isPartnerAllowedMutation(endpoint, method)
  ) {
    const errorObj: ApiError = new Error(
      'Partner view is read-only. Exit partner view to make changes.',
    ) as ApiError;
    errorObj.status = 403;
    errorObj.code = 'PARTNER_READ_ONLY';
    throw errorObj;
  }

  const token = skipAuthHeader ? null : await getStoredToken();
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

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

        const isPreAuth401 =
          response.status === 401 && isUnauthenticatedAuthEndpoint(endpoint);

        // Provide user-friendly messages based on status code
        if (response.status === 400) {
          errorObj.message =
            errorData.message || 'Invalid request. Please check your input.';
        } else if (response.status === 401) {
          if (isPreAuth401) {
            errorObj.message =
              errorData.message ||
              errorData.error ||
              'Invalid email or password. Please try again.';
          } else {
            errorObj.message = 'Session expired. Please log in again.';
            errorObj.code = 'UNAUTHORIZED';
          }
        } else if (response.status === 403) {
          errorObj.message =
            errorData.message ||
            'You do not have permission to perform this action.';
          if (
            errorData.message?.includes('read-only') ||
            errorData.message?.includes('Partner mode')
          ) {
            errorObj.code = 'PARTNER_READ_ONLY';
          }
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

        // Centralized session-expired handling (not for login/signup/etc. 401s).
        if (response.status === 401 && !isPreAuth401) {
          try {
            await clearToken();
            await clearSessionType();
          } catch {
            // Token clearing is best-effort; navigation still follows.
          }
          DeviceEventEmitter.emit('session_expired');
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

// Token storage helpers (encrypted-at-rest)
export async function getStoredToken(): Promise<string | null> {
  try {
    if (EncryptedStorage?.getItem) {
      const encryptedToken = await EncryptedStorage.getItem('authToken');
      if (encryptedToken !== null) {
        return encryptedToken;
      }
      // Migration path: older app versions stored tokens in plain AsyncStorage.
      return await AsyncStorage.getItem('authToken');
    }
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  try {
    if (EncryptedStorage?.setItem) {
      await EncryptedStorage.setItem('authToken', token);
      return;
    }
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
}

export async function clearToken(): Promise<void> {
  try {
    if (EncryptedStorage?.removeItem) {
      await EncryptedStorage.removeItem('authToken');
    }
    // Always clear the fallback store as well.
    await AsyncStorage.removeItem('authToken');
    await clearSessionType();
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
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  measurementSystem?: 'metric' | 'imperial';
  /** @deprecated server maps legacy strings as cm/kg */
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
export async function logSleep(data: LogSleepRequest): Promise<SleepResponse> {
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
  return apiCall<SleepsResponse>(
    `/sleep${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
    },
  );
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
  iconType:
    | 'energy'
    | 'mental'
    | 'metabolism'
    | 'mood'
    | 'fertility'
    | 'nutrition'
    | 'movement';
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
  return apiCall<WeeklyUpdatesResponse>(
    `/cycle-phase-content/${phase}/weekly-updates`,
    {
      method: 'GET',
    },
  );
}

// Did You Know API Functions
export async function getDidYouKnowByPhase(
  phase: string,
): Promise<DidYouKnowResponse> {
  return apiCall<DidYouKnowResponse>(
    `/cycle-phase-content/${phase}/did-you-know`,
    {
      method: 'GET',
    },
  );
}

// Personalized Insight API Functions
export async function getPersonalizedInsight(): Promise<PersonalizedInsightResponse> {
  return apiCall<PersonalizedInsightResponse>(
    '/cycle-phase-content/personalized-insight',
    {
      method: 'GET',
    },
  );
}

// User API
export interface DietaryRestrictions {
  vegetarian?: boolean;
  vegan?: boolean;
  pescatarian?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  nutAllergy?: boolean;
}

export type PrimaryGoal =
  | 'weight_loss'
  | 'weight_gain'
  | 'maintenance'
  | 'muscle_gain'
  | 'health';

export interface CycleHistorySummary {
  totalPeriods?: number;
  averageCycleLength?: number;
  averagePeriodLength?: number;
  lastCalculatedAt?: string;
}

/** GET /auth/me owner payload (SEC-010). Symptoms/rituals use dedicated APIs. */
export interface OwnerMeUser {
  _id: string;
  fullName: string;
  email: string;
  age?: string;
  height?: string;
  weight?: string;
  activityLevel?: string;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  measurementSystem?: 'metric' | 'imperial';
  targetWeight?: string;
  primaryGoal?: PrimaryGoal | string;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  cycleHistory?: CycleHistorySummary;
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;
  dueDate?: string;
  lastMenstrualPeriod?: string;
  pregnancyStartDate?: string;
  pregnancyNotes?: string;
  birthDate?: string;
  postpartumWeek?: number;
  dietaryRestrictions?: DietaryRestrictions;
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
  partnerSessionActive?: boolean;
  partnerConnectedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /auth/me partner payload (SEC-011) — read-only health summary. */
export interface PartnerMeUser {
  _id: string;
  fullName: string;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  cycleHistory?: CycleHistorySummary;
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;
  dueDate?: string;
  lastMenstrualPeriod?: string;
  pregnancyStartDate?: string;
  birthDate?: string;
  postpartumWeek?: number;
}

export type MeUser = OwnerMeUser | PartnerMeUser;

/** Owner profile fields; PATCH /auth/profile may return the full user document. */
export type User = OwnerMeUser;

export function isOwnerMeUser(user: MeUser): user is OwnerMeUser {
  return 'email' in user;
}

export function isPartnerMeUser(user: MeUser): user is PartnerMeUser {
  return !isOwnerMeUser(user);
}

export interface GetMeResponse {
  success: boolean;
  user: MeUser;
  sessionType?: SessionType;
  partnerStatus?: {
    partnerSessionActive: boolean;
    codeExpiresAt: string | null;
  };
}

export interface PartnerStatusResponse {
  success: boolean;
  partnerSessionActive: boolean;
  partnerConnectedAt: string | null;
  codeExpiresAt: string | null;
  hasActiveCode: boolean;
}

export interface GeneratePartnerCodeResponse {
  success: boolean;
  code: string;
  expiresAt: string;
}

export interface ConnectPartnerCodeResponse {
  success: boolean;
  token: string;
  primaryUserName?: string;
  message?: string;
}

export async function generatePartnerCode(): Promise<GeneratePartnerCodeResponse> {
  return apiCall<GeneratePartnerCodeResponse>('/partner/code/generate', {
    method: 'POST',
  });
}

export async function getPartnerStatus(): Promise<PartnerStatusResponse> {
  return apiCall<PartnerStatusResponse>('/partner/status', {
    method: 'GET',
  });
}

export async function disconnectPartner(): Promise<{
  success: boolean;
  message?: string;
}> {
  return apiCall<{ success: boolean; message?: string }>('/partner/disconnect', {
    method: 'POST',
  });
}

export async function connectWithPartnerCode(
  code: string,
): Promise<ConnectPartnerCodeResponse> {
  return apiCall<ConnectPartnerCodeResponse>('/partner/connect', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function partnerLogout(): Promise<{
  success: boolean;
  message?: string;
}> {
  return apiCall<{ success: boolean; message?: string }>('/partner/logout', {
    method: 'POST',
  });
}

export async function getMe(): Promise<GetMeResponse> {
  return apiCall<GetMeResponse>('/auth/me', {
    method: 'GET',
  });
}

/** Single attempt — used during splash so offline boot is not delayed by retries. */
export async function getMeForBootstrap(): Promise<GetMeResponse> {
  return apiCall<GetMeResponse>(
    '/auth/me',
    {
      method: 'GET',
    },
    0,
  );
}

export interface ProfileUpdateRequest {
  measurementSystem?: 'metric' | 'imperial';
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  height?: string;
  weight?: string;
  targetWeight?: string;
  primaryGoal?: PrimaryGoal | string | null;
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string;
  lastPeriodEndDate?: string;
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;
  dietaryRestrictions?: DietaryRestrictions;
  otherAllergies?: string;
  cuisinePreferences?: string[];
  dislikedFoods?: string;
  favoriteFoods?: string;
}

export async function updateProfile(
  body: ProfileUpdateRequest,
): Promise<GetMeResponse> {
  return apiCall<GetMeResponse>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(body),
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

export interface WeeklyMealPlanResponse {
  success: boolean;
  data: DailyMealPlan[];
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
  fastingAutoEnded?: boolean;
  fastingSession?: FastingSession;
}

export interface Meal {
  _id: string;
  title: string;
  description: string;
  timeSlot:
    | 'breakfast'
    | 'mid_morning_snack'
    | 'lunch'
    | 'afternoon_snack'
    | 'dinner';
  protein: number;
  carbs: number;
  fat: number;
  phases: string[];
  pregnancySafe: boolean;
  postpartumSafe: boolean;
  breastfeedingSafe: boolean;
  vegetarian: boolean;
  vegan: boolean;
  pescatarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  nutFree: boolean;
  cuisines: string[];
  tags: string[];
  goals: string[];
  ingredients?: Array<{
    name: string;
    quantity?: number | null;
    unit?: string | null;
  }>;
  budgetLevel?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealDetailResponse {
  success: boolean;
  data: Meal;
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

export async function getWeeklyNutritionPlan(
  startDate?: string,
): Promise<WeeklyMealPlanResponse> {
  const params = new URLSearchParams();
  if (startDate) {
    params.append('startDate', startDate);
  }
  const query = params.toString();
  const endpoint = `/nutrition/plan/week${query ? `?${query}` : ''}`;
  return apiCall<WeeklyMealPlanResponse>(endpoint, {
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

export async function getMealDetail(id: string): Promise<MealDetailResponse> {
  return apiCall<MealDetailResponse>(`/nutrition/meals/${id}`, {
    method: 'GET',
  });
}

export type WeeklyMealStructure =
  | '3_meals'
  | '3_meals_1_snack'
  | '3_meals_2_snacks';

export interface WeeklyMealPlanDay {
  date: string;
  timeSlots: NutritionTimeSlot[];
}

export interface WeeklyMealPlanning {
  _id: string;
  user: string;
  weekStart: string;
  weekEnd: string;
  status: 'generated' | 'skipped';
  mealStructure: WeeklyMealStructure;
  days: WeeklyMealPlanDay[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyPlanningResponse {
  success: boolean;
  data: {
    weekStart: string;
    weekEnd: string;
    weeklyPlan: WeeklyMealPlanning | null;
  };
}

export interface WeeklyPlanningGenerateResponse {
  success: boolean;
  data: WeeklyMealPlanning;
}

export interface GroceryListItem {
  _id: string;
  name: string;
  normalizedName: string;
  quantity?: number | null;
  unit?: string | null;
  checked: boolean;
  source: 'generated' | 'manual';
}

export interface WeeklyGroceryList {
  _id: string;
  user: string;
  weekStart: string;
  weekEnd: string;
  weeklyMealPlan: string;
  items: GroceryListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyGroceryListResponse {
  success: boolean;
  data: WeeklyGroceryList | null;
}

export async function getWeeklyPlanning(
  date?: string,
): Promise<WeeklyPlanningResponse> {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const query = params.toString();
  return apiCall<WeeklyPlanningResponse>(
    `/nutrition/weekly-planning${query ? `?${query}` : ''}`,
    { method: 'GET' },
  );
}

export async function generateWeeklyPlanning(body: {
  date?: string;
  mealStructure: WeeklyMealStructure;
}): Promise<WeeklyPlanningGenerateResponse> {
  return apiCall<WeeklyPlanningGenerateResponse>(
    '/nutrition/weekly-planning/generate',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  );
}

export async function skipWeeklyPlanning(body?: {
  date?: string;
}): Promise<WeeklyPlanningGenerateResponse> {
  return apiCall<WeeklyPlanningGenerateResponse>('/nutrition/weekly-planning/skip', {
    method: 'POST',
    body: JSON.stringify(body || {}),
  });
}

export async function getWeeklyGroceryList(
  date?: string,
): Promise<WeeklyGroceryListResponse> {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  const query = params.toString();
  return apiCall<WeeklyGroceryListResponse>(
    `/nutrition/grocery-list${query ? `?${query}` : ''}`,
    { method: 'GET' },
  );
}

export async function regenerateWeeklyGroceryList(body?: {
  date?: string;
}): Promise<WeeklyGroceryListResponse> {
  return apiCall<WeeklyGroceryListResponse>('/nutrition/grocery-list/regenerate', {
    method: 'POST',
    body: JSON.stringify(body || {}),
  });
}

export async function addWeeklyGroceryItem(body: {
  date?: string;
  name: string;
  quantity?: number;
  unit?: string;
}): Promise<WeeklyGroceryListResponse> {
  return apiCall<WeeklyGroceryListResponse>('/nutrition/grocery-list/items', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteWeeklyGroceryItem(body: {
  date?: string;
  itemId: string;
}): Promise<WeeklyGroceryListResponse> {
  return apiCall<WeeklyGroceryListResponse>(
    `/nutrition/grocery-list/items/${body.itemId}`,
    {
      method: 'DELETE',
      body: JSON.stringify({ date: body.date }),
    },
  );
}

export async function updateWeeklyGroceryItem(body: {
  date?: string;
  itemId: string;
  checked: boolean;
}): Promise<WeeklyGroceryListResponse> {
  return apiCall<WeeklyGroceryListResponse>(
    `/nutrition/grocery-list/items/${body.itemId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ date: body.date, checked: body.checked }),
    },
  );
}

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
  return apiCall<WorkoutDetailResponse>(`/workouts/workouts/${id}`, {
    method: 'GET',
  });
}

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

// Fasting API Types
export interface FastingProtocol {
  _id: string;
  user: string;
  name: string;
  fastDurationMinutes: number;
  eatingWindowMinutes?: number;
  startTimePreference: 'morning' | 'evening' | 'custom';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FastingSession {
  _id: string;
  user: string;
  protocol?: string | FastingProtocol | null;
  protocolName?: string;
  startTime: string;
  endTime?: string | null;
  status: 'active' | 'completed' | 'cancelled';
  targetDurationMinutes?: number;
  actualDurationMinutes?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FastingInsights {
  rangeDays: number;
  totalSessions: number;
  averageDurationMinutes: number | null;
  longestDurationMinutes: number | null;
  currentStreakDays: number;
  longestStreakDays: number;
}

export interface GetFastingProtocolsResponse {
  success: boolean;
  data: FastingProtocol[];
}

export interface GetFastingCurrentResponse {
  success: boolean;
  data: FastingSession | null;
}

export interface GetFastingHistoryResponse {
  success: boolean;
  data: FastingSession[];
}

export interface GetFastingInsightsResponse {
  success: boolean;
  data: FastingInsights;
}

export interface CreateFastingProtocolRequest {
  name: string;
  fastDurationMinutes: number;
  eatingWindowMinutes?: number;
  startTimePreference?: 'morning' | 'evening' | 'custom';
  isDefault?: boolean;
}

export type UpdateFastingProtocolRequest =
  Partial<CreateFastingProtocolRequest>;

export interface StartFastingSessionRequest {
  protocolId?: string;
  customDurationMinutes?: number;
  startTimeOverride?: string;
}

export interface EndFastingSessionRequest {
  endTimeOverride?: string;
  notes?: string;
}

// Fasting API Functions
export async function getFastingProtocols(): Promise<GetFastingProtocolsResponse> {
  return apiCall<GetFastingProtocolsResponse>('/fasting/protocols', {
    method: 'GET',
  });
}

export async function createFastingProtocol(
  data: CreateFastingProtocolRequest,
): Promise<{ success: boolean; data: FastingProtocol }> {
  return apiCall<{ success: boolean; data: FastingProtocol }>(
    '/fasting/protocols',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function updateFastingProtocol(
  id: string,
  data: UpdateFastingProtocolRequest,
): Promise<{ success: boolean; data: FastingProtocol }> {
  return apiCall<{ success: boolean; data: FastingProtocol }>(
    `/fasting/protocols/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteFastingProtocolApi(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(
    `/fasting/protocols/${id}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getFastingCurrent(): Promise<GetFastingCurrentResponse> {
  return apiCall<GetFastingCurrentResponse>('/fasting/current', {
    method: 'GET',
  });
}

export async function startFastingSession(
  data: StartFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>('/fasting/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function endFastingSession(
  data: EndFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>('/fasting/end', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cancelFastingSession(): Promise<{
  success: boolean;
  data: FastingSession;
}> {
  return apiCall<{ success: boolean; data: FastingSession }>(
    '/fasting/cancel',
    {
      method: 'POST',
    },
  );
}

export interface UpdateFastingSessionRequest {
  targetDurationMinutes: number;
}

export async function updateFastingSession(
  data: UpdateFastingSessionRequest,
): Promise<{ success: boolean; data: FastingSession }> {
  return apiCall<{ success: boolean; data: FastingSession }>(
    '/fasting/current',
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export interface GetFastingHistoryParams {
  from?: string;
  to?: string;
  limit?: number;
}

export async function getFastingHistory(
  params?: GetFastingHistoryParams,
): Promise<GetFastingHistoryResponse> {
  const search = new URLSearchParams();
  if (params?.from) search.append('from', params.from);
  if (params?.to) search.append('to', params.to);
  if (params?.limit) search.append('limit', params.limit.toString());

  const qs = search.toString();
  return apiCall<GetFastingHistoryResponse>(
    `/fasting/history${qs ? `?${qs}` : ''}`,
    {
      method: 'GET',
    },
  );
}

export async function getFastingInsights(
  range: number = 7,
): Promise<GetFastingInsightsResponse> {
  const qs = new URLSearchParams({ range: String(range) }).toString();
  return apiCall<GetFastingInsightsResponse>(`/fasting/insights?${qs}`, {
    method: 'GET',
  });
}

// Journal API Types
export interface Journal {
  _id: string;
  user?: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  pin?: boolean;
}

export interface JournalsResponse {
  success: boolean;
  data: Journal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface JournalResponse {
  success: boolean;
  data: Journal;
  message?: string;
}

export interface CreateJournalRequest {
  title: string;
  description?: string;
}

export interface UpdateJournalRequest {
  title?: string;
  description?: string;
  pin?: boolean;
}

export interface JournalListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getJournals(
  params?: JournalListParams,
): Promise<JournalsResponse> {
  const search = new URLSearchParams();
  if (params?.page != null) search.append('page', String(params.page));
  if (params?.limit != null) search.append('limit', String(params.limit));
  if (params?.search) search.append('search', params.search);

  const qs = search.toString();
  return apiCall<JournalsResponse>(`/journals${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
}

export async function getJournal(id: string): Promise<JournalResponse> {
  return apiCall<JournalResponse>(`/journals/${id}`, {
    method: 'GET',
  });
}

export async function createJournal(
  data: CreateJournalRequest,
): Promise<JournalResponse> {
  return apiCall<JournalResponse>('/journals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateJournal(
  id: string,
  data: UpdateJournalRequest,
): Promise<JournalResponse> {
  return apiCall<JournalResponse>(`/journals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteJournal(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall<{ success: boolean; message?: string }>(`/journals/${id}`, {
    method: 'DELETE',
  });
}

// --- Rituals (catalog + preferences + optional daily checkmarks) ---

export type RitualSection = 'morning' | 'midday' | 'evening';
export type RitualInteraction = 'check' | 'action';

export interface RitualDefinitionDto {
  _id: string;
  keyId: string;
  title: string;
  description: string;
  /** True when user-authored (not seeded catalog) */
  isCustom?: boolean;
  /** Catalog hint: which cycle phases this often fits */
  phaseFitLabel?: string;
  /** Expandable copy: phase fit rationale (wellness framing) */
  phaseFitWhy?: string;
  tag: string;
  defaultSection: RitualSection;
  anchor: string;
  interaction: RitualInteraction;
  navigationTarget?: string | null;
  actionParams?: Record<string, unknown>;
  isCore: boolean;
  defaultSortOrder?: number;
  isActive: boolean;
}

export interface UserRitualPreferenceDto {
  ritualKey: string;
  section: RitualSection;
  userNote: string;
  sortIndex: number;
  enabled: boolean;
}

export interface RitualDefinitionsResponse {
  success: boolean;
  data: RitualDefinitionDto[];
}

export interface CreateCustomRitualRequest {
  title: string;
  description?: string;
  defaultSection: RitualSection;
}

export interface CreateCustomRitualResponse {
  success: boolean;
  data?: RitualDefinitionDto;
  message?: string;
}

export interface RitualPreferencesResponse {
  success: boolean;
  data: UserRitualPreferenceDto[];
}

export interface RitualCompletionsResponse {
  success: boolean;
  data: Record<string, boolean>;
}

export async function getRitualDefinitions(): Promise<RitualDefinitionsResponse> {
  return apiCall<RitualDefinitionsResponse>('/rituals/definitions', {
    method: 'GET',
  });
}

export async function postCustomRitual(
  body: CreateCustomRitualRequest,
): Promise<CreateCustomRitualResponse> {
  return apiCall<CreateCustomRitualResponse>('/rituals/custom', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteCustomRitual(
  keyId: string,
): Promise<{ success: boolean; message?: string }> {
  return apiCall(`/rituals/custom/${encodeURIComponent(keyId)}`, {
    method: 'DELETE',
  });
}

export async function getRitualPreferences(): Promise<RitualPreferencesResponse> {
  return apiCall<RitualPreferencesResponse>('/rituals/preferences', {
    method: 'GET',
  });
}

export async function putRitualPreferences(
  preferences: UserRitualPreferenceDto[],
): Promise<RitualPreferencesResponse> {
  return apiCall<RitualPreferencesResponse>('/rituals/preferences', {
    method: 'PUT',
    body: JSON.stringify({ preferences }),
  });
}

export async function getRitualCompletions(
  date: string,
): Promise<RitualCompletionsResponse> {
  const qs = new URLSearchParams({ date });
  return apiCall<RitualCompletionsResponse>(
    `/rituals/completions?${qs.toString()}`,
    { method: 'GET' },
  );
}

export async function postRitualDayToggle(body: {
  date: string;
  ritualKey: string;
  completed: boolean;
}): Promise<{ success: boolean; data?: { date: string; ritualKey: string; completed: boolean } }> {
  return apiCall('/rituals/day-toggle', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
