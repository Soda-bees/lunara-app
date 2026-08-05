import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as RUNTIME_API_BASE_URL } from '../../config/runtimeConfig';
import { DeviceEventEmitter } from 'react-native';

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

export const API_BASE_URL = RUNTIME_API_BASE_URL;

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

export async function apiCall<T>(
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
