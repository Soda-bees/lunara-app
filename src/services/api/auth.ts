import { apiCall, type SessionType } from './httpClient';

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
