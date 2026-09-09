import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

const DISPLAY_NAME_KEY = '@lunara/displayName';

export const DISPLAY_NAME_CLEARED_EVENT = 'lunara_display_name_cleared';

export async function getStoredDisplayName(): Promise<string> {
  try {
    const value = await AsyncStorage.getItem(DISPLAY_NAME_KEY);
    return value?.trim() || '';
  } catch {
    return '';
  }
}

export async function persistDisplayName(name: string): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) {
    await clearStoredDisplayName();
    return;
  }
  try {
    await AsyncStorage.setItem(DISPLAY_NAME_KEY, trimmed);
  } catch {
    // Ignore write failures; in-memory context still works this session.
  }
}

export async function clearStoredDisplayName(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DISPLAY_NAME_KEY);
  } catch {
    // Best-effort
  }
  DeviceEventEmitter.emit(DISPLAY_NAME_CLEARED_EVENT);
}
