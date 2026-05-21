import { clearToken, getMeForBootstrap, getStoredToken } from '../services/api';

/** Where to land after splash when a stored session exists. */
export type SessionRoute = 'TabNavigator' | null;

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

async function verifySessionWithServer(): Promise<SessionRoute> {
  const token = await getStoredToken();
  if (!token) {
    return null;
  }

  try {
    await getMeForBootstrap();
    return 'TabNavigator';
  } catch (error: unknown) {
    if (isUnauthorizedError(error)) {
      await clearToken();
      return null;
    }
    // Slow server, offline, or 5xx — keep local session so the app stays usable.
    const status = (error as { status?: number })?.status;
    if (isNetworkError(error) || (status != null && status >= 500)) {
      return 'TabNavigator';
    }
    return 'TabNavigator';
  }
}

function sessionVerifyTimeout(): Promise<SessionRoute> {
  return new Promise(resolve => {
    setTimeout(async () => {
      const token = await getStoredToken();
      resolve(token ? 'TabNavigator' : null);
    }, SESSION_VERIFY_TIMEOUT_MS);
  });
}

/**
 * Validates session during splash (parallel with other preloads).
 * - No token → Welcome
 * - Valid /auth/me → Home tabs
 * - 401 → clear token, Welcome
 * - Network down / slow server → Home tabs if a token exists (offline-first)
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
  return token ? 'TabNavigator' : null;
}
