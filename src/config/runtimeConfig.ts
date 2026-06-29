import { Platform } from 'react-native';

declare global {
  // Allows overriding the API base URL at runtime (e.g. for debugging).
  // You can set `globalThis.__LUNARA_API_BASE_URL__ = '...'` before app init.
  // eslint-disable-next-line no-var
  var __LUNARA_API_BASE_URL__: string | undefined;
}

const PROD_API_BASE_URL =
  'https://lunaranew-e6853745dbd7.herokuapp.com/api';

const DEV_ANDROID_API_BASE_URL =
  'http://192.168.100.206:8080/api';

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
    return DEV_ANDROID_API_BASE_URL;
  }

  return DEV_IOS_API_BASE_URL;
}

export const API_BASE_URL = getApiBaseUrl();

