/**
 * MOB-031 — Persist cycle/sleep summary snapshots for cold-start SWR.
 * Status/stats only (not full history). Prefer EncryptedStorage; fall back to AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

let EncryptedStorage: {
  getItem?: (key: string) => Promise<string | null>;
  setItem?: (key: string, value: string) => Promise<void>;
  removeItem?: (key: string) => Promise<void>;
} | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require('react-native-encrypted-storage');
  EncryptedStorage = mod?.default ?? mod;
} catch {
  EncryptedStorage = null;
}

const KEYS = {
  cycleStatus: '@lunara_snapshot_cycle_status',
  sleepStatistics: '@lunara_snapshot_sleep_statistics',
} as const;

export type ContextSnapshot<T> = {
  data: T;
  savedAt: number;
};

async function storageGet(key: string): Promise<string | null> {
  try {
    if (EncryptedStorage?.getItem) {
      return await EncryptedStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function storageSet(key: string, value: string): Promise<void> {
  try {
    if (EncryptedStorage?.setItem) {
      await EncryptedStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  } catch {
    // ignore write failures — network path still works
  }
}

async function storageRemove(key: string): Promise<void> {
  try {
    if (EncryptedStorage?.removeItem) {
      await EncryptedStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

async function loadSnapshot<T>(key: string): Promise<ContextSnapshot<T> | null> {
  const raw = await storageGet(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ContextSnapshot<T>;
    if (!parsed || parsed.data == null || typeof parsed.savedAt !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function saveSnapshot<T>(key: string, data: T, savedAt: number): Promise<void> {
  const payload: ContextSnapshot<T> = { data, savedAt };
  await storageSet(key, JSON.stringify(payload));
}

export async function loadCycleStatusSnapshot<T>(): Promise<ContextSnapshot<T> | null> {
  return loadSnapshot<T>(KEYS.cycleStatus);
}

export async function saveCycleStatusSnapshot<T>(
  data: T,
  savedAt: number = Date.now(),
): Promise<void> {
  await saveSnapshot(KEYS.cycleStatus, data, savedAt);
}

export async function loadSleepStatisticsSnapshot<T>(): Promise<ContextSnapshot<T> | null> {
  return loadSnapshot<T>(KEYS.sleepStatistics);
}

export async function saveSleepStatisticsSnapshot<T>(
  data: T,
  savedAt: number = Date.now(),
): Promise<void> {
  await saveSnapshot(KEYS.sleepStatistics, data, savedAt);
}

export async function clearContextSnapshots(): Promise<void> {
  await Promise.all([
    storageRemove(KEYS.cycleStatus),
    storageRemove(KEYS.sleepStatistics),
  ]);
}
