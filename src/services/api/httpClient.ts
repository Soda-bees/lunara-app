import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL as RUNTIME_API_BASE_URL } from '../../config/runtimeConfig';
import { DeviceEventEmitter } from 'react-native';
import { clearStoredDisplayName } from '../../utils/displayNameStorage';
import { clearStoredPartnerCode } from '../../utils/partnerCodeStorage';

/** Known encrypted-storage keys used by this module (REF-009). */
export type EncryptedStorageKey = 'authToken';

const AUTH_TOKEN_KEY: EncryptedStorageKey = 'authToken';

/** Minimal typed surface for `react-native-encrypted-storage`. */
export type EncryptedStorageModule = {
  getItem: (key: EncryptedStorageKey) => Promise<string | null>;
  setItem: (key: EncryptedStorageKey, value: string) => Promise<void>;
  removeItem: (key: EncryptedStorageKey) => Promise<void>;
};

function resolveEncryptedStorage(mod: unknown): EncryptedStorageModule | null {
  if (!mod || typeof mod !== 'object') {
    return null;
  }
  const withDefault = mod as { default?: unknown };
  const candidate =
    withDefault.default && typeof withDefault.default === 'object'
      ? withDefault.default
      : mod;
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }
  const storage = candidate as Partial<EncryptedStorageModule>;
  if (
    typeof storage.getItem !== 'function' ||
    typeof storage.setItem !== 'function' ||
    typeof storage.removeItem !== 'function'
  ) {
    return null;
  }
  return storage as EncryptedStorageModule;
}

// `react-native-encrypted-storage` is a native module. If it isn't correctly
// linked/available on the device, importing it can break the entire module.
// We use a guarded require and fall back to AsyncStorage to keep the app booting.
let EncryptedStorage: EncryptedStorageModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  EncryptedStorage = resolveEncryptedStorage(
    require('react-native-encrypted-storage'),
  );
} catch {
  EncryptedStorage = null;
}

// Resolved in runtimeConfig: Metro host in __DEV__, production URL in release.
export const API_BASE_URL = RUNTIME_API_BASE_URL;

type ApiErrorBody = {
  message?: string;
  error?: string;
  errors?: Array<{ msg?: string; message?: string }>;
};

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  retryable?: boolean;
}

type ErrorLike = {
  message: string;
  name?: string;
  status?: number;
};

function asErrorLike(error: unknown): ErrorLike {
  if (error instanceof Error) {
    const withStatus = error as ApiError;
    return {
      message: error.message,
      name: error.name,
      status:
        typeof withStatus.status === 'number' ? withStatus.status : undefined,
    };
  }
  if (typeof error === 'object' && error !== null) {
    const o = error as Record<string, unknown>;
    return {
      message: typeof o.message === 'string' ? o.message : 'Unknown error',
      name: typeof o.name === 'string' ? o.name : undefined,
      status: typeof o.status === 'number' ? o.status : undefined,
    };
  }
  return { message: String(error) };
}

function asApiErrorBody(value: unknown): ApiErrorBody {
  if (typeof value === 'object' && value !== null) {
    return value as ApiErrorBody;
  }
  return { message: 'An error occurred' };
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

/**
 * MOB-035 retry matrix (auto-retry on 5xx / network only):
 * - GET/HEAD: yes, jittered backoff
 * - POST: only when `Idempotency-Key` header is present (API-013/014)
 * - PUT/PATCH/DELETE: unchanged (still retry; out of this ticket's scope)
 * - POST without key: fail once (caller may retry manually)
 */
function getHeaderValue(
  headers: RequestInit['headers'] | undefined,
  name: string,
): string | undefined {
  if (!headers) {
    return undefined;
  }
  const lower = name.toLowerCase();
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    return headers.get(name) ?? headers.get(lower) ?? undefined;
  }
  if (Array.isArray(headers)) {
    const hit = headers.find(([k]) => k.toLowerCase() === lower);
    return hit?.[1];
  }
  const record = headers as Record<string, string>;
  for (const key of Object.keys(record)) {
    if (key.toLowerCase() === lower) {
      return record[key];
    }
  }
  return undefined;
}

function shouldAutoRetry(
  method: string,
  headers?: RequestInit['headers'],
): boolean {
  const m = (method || 'GET').toUpperCase();
  if (m === 'GET' || m === 'HEAD') {
    return true;
  }
  if (m === 'POST') {
    const key = getHeaderValue(headers, 'Idempotency-Key');
    return Boolean(key && String(key).trim());
  }
  return true;
}

/** Linear backoff with full jitter: [0, base] where base = 1000 * (attempt + 1). */
function retryDelayMs(attempt: number): number {
  const base = 1000 * (attempt + 1);
  return Math.floor(Math.random() * (base + 1));
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
  const effectiveRetries = shouldAutoRetry(method, options.headers)
    ? retries
    : 0;

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

  for (let attempt = 0; attempt <= effectiveRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorData: ApiErrorBody = { message: 'An error occurred' };

        try {
          errorData = asApiErrorBody(await response.json());
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
              .map(e => e.msg || e.message)
              .join(', ');
          } else {
            errorObj.message =
              errorData.message || 'Validation error. Please check your input.';
          }
        } else if (response.status === 429) {
          errorObj.message =
            errorData.message ||
            'Too many requests. Please try again later.';
          errorObj.code = 'RATE_LIMITED';
          errorObj.retryable = false;
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

        // Never retry rate limits — one 429 must not become three requests.
        if (response.status === 429) {
          throw errorObj;
        }

        // Retry on server errors (5xx) when policy allows
        if (errorObj.retryable && attempt < effectiveRetries) {
          await new Promise<void>(resolve =>
            setTimeout(() => resolve(), retryDelayMs(attempt)),
          );
          lastError = errorObj;
          continue;
        }

        throw errorObj;
      }

      return response.json() as Promise<T>;
    } catch (error: unknown) {
      const err = asErrorLike(error);

      if (err.status === 429) {
        throw error;
      }

      // Better error handling for network issues
      if (
        err.message === 'Network request failed' ||
        err.message.includes('Failed to connect') ||
        err.message.includes('NetworkError') ||
        err.name === 'TypeError' ||
        !err.status
      ) {
        const networkError: ApiError = new Error(
          'Network error. Please check your internet connection and try again.',
        ) as ApiError;
        networkError.code = 'NETWORK_ERROR';
        networkError.retryable = true;

        // Retry on network errors when policy allows
        if (attempt < effectiveRetries) {
          await new Promise<void>(resolve =>
            setTimeout(() => resolve(), retryDelayMs(attempt)),
          );
          lastError = networkError;
          continue;
        }

        throw networkError;
      }

      // If it's not a retryable error, throw immediately
      if (err.status && err.status < 500) {
        throw error;
      }

      lastError =
        error instanceof Error
          ? (error as ApiError)
          : (new Error(err.message) as ApiError);
    }
  }

  // If we've exhausted retries, throw the last error
  throw lastError || new Error('Request failed after multiple attempts');
}

// Token storage helpers (encrypted-at-rest)
export async function getStoredToken(): Promise<string | null> {
  try {
    if (EncryptedStorage?.getItem) {
      const encryptedToken = await EncryptedStorage.getItem(AUTH_TOKEN_KEY);
      if (encryptedToken !== null) {
        return encryptedToken;
      }
      // Migration path: older app versions stored tokens in plain AsyncStorage.
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    }
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export async function storeToken(token: string): Promise<void> {
  try {
    if (EncryptedStorage?.setItem) {
      await EncryptedStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
}

export async function clearToken(): Promise<void> {
  try {
    if (EncryptedStorage?.removeItem) {
      await EncryptedStorage.removeItem(AUTH_TOKEN_KEY);
    }
    // Always clear the fallback store as well.
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await clearSessionType();
    await clearStoredDisplayName();
    await clearStoredPartnerCode();
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}
