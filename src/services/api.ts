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

  // For Android emulator
  if (Platform.OS === 'android') {
    // Use your computer's IP address for physical device
    // Use '10.0.2.2' for Android emulator
    return 'http://10.0.2.2:3000/api'; // Android emulator
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
