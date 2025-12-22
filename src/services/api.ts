import AsyncStorage from '@react-native-async-storage/async-storage';

// API configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api' // Development
  : 'https://your-api-domain.com/api'; // Production

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
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available (for future authenticated requests)
  const token = await getStoredToken();
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Token storage helpers (using AsyncStorage in React Native)
async function getStoredToken(): Promise<string | null> {
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
  email: string
): Promise<{ success: boolean; message?: string }> {
  return apiCall('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> {
  return apiCall('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
  });
}

