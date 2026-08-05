import { apiCall } from './httpClient';
import type { FastingSession } from './fasting';

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

/**
 * Force-regenerate nutrition plan(s) via POST (API-001 / MOB-021).
 * Prefer this over GET `forceRegenerate` (deprecated).
 * - `{ date }` → one day
 * - `{ startDate }` → 5-day week
 */
export async function regenerateNutritionPlan(body?: {
  date?: string;
  startDate?: string;
}): Promise<DailyMealPlanResponse | WeeklyMealPlanResponse> {
  return apiCall<DailyMealPlanResponse | WeeklyMealPlanResponse>(
    '/nutrition/plan/regenerate',
    {
      method: 'POST',
      body: JSON.stringify(body || {}),
    },
  );
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

