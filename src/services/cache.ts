import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = '@lunara_cache_';

/**
 * Get cached data if it exists and is still valid
 */
export async function getCachedData<T>(
  key: string,
  ttl: number = 3600000, // Default 1 hour
): Promise<T | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    const age = now - entry.timestamp;

    // Check if cache is still valid
    if (age < (entry.ttl || ttl)) {
      return entry.data;
    }

    // Cache expired, remove it
    await AsyncStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.error('[Cache] Error reading cache:', error);
    return null;
  }
}

/**
 * Store data in cache with TTL
 */
export async function setCachedData<T>(
  key: string,
  data: T,
  ttl: number = 3600000, // Default 1 hour
): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.error('[Cache] Error writing cache:', error);
  }
}

/**
 * Remove cached data
 */
export async function removeCachedData(key: string): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    await AsyncStorage.removeItem(cacheKey);
  } catch (error) {
    console.error('[Cache] Error removing cache:', error);
  }
}

/**
 * Clear all cache entries
 */
export async function clearAllCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
}

/**
 * Cache keys for different data types
 */
export const CacheKeys = {
  nutritionPlan: (date: string) => `nutrition_plan_${date}`,
  workoutPlan: (date: string) => `workout_plan_${date}`,
  weeklyNutritionPlan: (startDate: string) => `weekly_nutrition_${startDate}`,
  movementContent: (date: string) => `movement_content_${date}`,
  movementScience: () => 'movement_science',
  phaseInfo: (date: string) => `phase_info_${date}`,
  movementMap: () => 'movement_map',
};

/**
 * TTL constants (in milliseconds)
 */
export const CacheTTL = {
  plans: 3600000, // 1 hour
  weeklyPlans: 3600000, // 1 hour
  dynamicContent: 300000, // 5 minutes
  scienceData: 1800000, // 30 minutes
};
