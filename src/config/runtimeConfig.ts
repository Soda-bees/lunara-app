import { Platform } from 'react-native';

declare global {
  // Allows overriding the API base URL at runtime (e.g. physical device → host LAN IP).
  // Set before app init: globalThis.__LUNARA_API_BASE_URL__ = 'http://192.168.x.x:8080/api'
  // eslint-disable-next-line no-var
  var __LUNARA_API_BASE_URL__: string | undefined;
}

/** Production API (release builds). Documented intentional default — see README. */
const PROD_API_BASE_URL =
  'https://lunaranew-e6853745dbd7.herokuapp.com/api';

/**
 * Android emulator loopback to the host machine (not a machine-specific LAN IP).
 * Physical devices must set `__LUNARA_API_BASE_URL__` — see Lunara/README.md.
 */
const DEV_ANDROID_EMULATOR_API_BASE_URL = 'http://10.0.2.2:8080/api';

/** iOS Simulator can reach the host via localhost. */
const DEV_IOS_API_BASE_URL = 'http://localhost:8080/api';

export function getApiBaseUrl(): string {
  const override = globalThis.__LUNARA_API_BASE_URL__;
  if (override && typeof override === 'string') {
    return override;
  }

  if (!__DEV__) {
    return PROD_API_BASE_URL;
  }

  if (Platform.OS === 'android') {
    return DEV_ANDROID_EMULATOR_API_BASE_URL;
  }

  return DEV_IOS_API_BASE_URL;
}

export const API_BASE_URL = getApiBaseUrl();
