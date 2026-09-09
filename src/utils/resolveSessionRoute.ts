import {
  clearToken,
  getMeForBootstrap,
  getStoredSessionType,
  getStoredToken,
  storeSessionType,
  type SessionType,
} from '../services/api';
import { persistDisplayName } from './displayNameStorage';

/** Where to land after splash when a stored session exists. */
export type SessionRoute = 'TabNavigator' | 'PartnerStackNavigator' | null;

/** Max wait for /auth/me during splash — then trust local token (offline-friendly). */
const SESSION_VERIFY_TIMEOUT_MS = 4500;

function isUnauthorizedError(error: unknown): boolean {
  const err = error as { status?: number; code?: string; message?: string };
  return (
    err?.status === 401 ||
    err?.code === 'UNAUTHORIZED' ||
    Boolean(err?.message?.includes('Session expired'))
  );
}

function isNetworkError(error: unknown): boolean {
  const err = error as { code?: string; status?: number; message?: string };
  return (
    err?.code === 'NETWORK_ERROR' ||
    !err?.status ||
    Boolean(err?.message?.includes('Network error'))
  );
}

function routeForSessionType(sessionType: SessionType): SessionRoute {
  return sessionType === 'partner' ? 'PartnerStackNavigator' : 'TabNavigator';
}

async function verifySessionWithServer(): Promise<SessionRoute> {
  const token = await getStoredToken();
  if (!token) {
    return null;
  }

  try {
    const me = await getMeForBootstrap();
    const sessionType = me.sessionType ?? (await getStoredSessionType());
    if (me.sessionType) {
      await storeSessionType(me.sessionType);
    }
    if (me.user?.fullName) {
      await persistDisplayName(me.user.fullName);
    }
    return routeForSessionType(sessionType);
  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      await clearToken();
      return null;
    }
    const storedType = await getStoredSessionType();
    return routeForSessionType(storedType);
  }
}

function sessionVerifyTimeout(): Promise<SessionRoute> {
  return new Promise(resolve => {
    setTimeout(async () => {
      const token = await getStoredToken();
      if (!token) {
        resolve(null);
        return;
      }
      const storedType = await getStoredSessionType();
      resolve(routeForSessionType(storedType));
    }, SESSION_VERIFY_TIMEOUT_MS);
  });
}

/**
 * Validates session during splash (parallel with other preloads).
 * - No token → Welcome
 * - Valid /auth/me → owner or partner tabs
 * - 401 → clear token, Welcome
 * - Network down / slow server → tabs if a token exists (offline-first)
 */
export async function resolveSessionRoute(): Promise<SessionRoute> {
  const token = await getStoredToken();
  if (!token) {
    return null;
  }

  return Promise.race([verifySessionWithServer(), sessionVerifyTimeout()]);
}

/** Used when splash hard-cap fires before resolveSessionRoute finishes. */
export async function resolveSessionRouteFallback(): Promise<SessionRoute> {
  const token = await getStoredToken();
  if (!token) {
    return null;
  }
  const storedType = await getStoredSessionType();
  return routeForSessionType(storedType);
}
