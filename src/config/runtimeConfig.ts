import { NativeModules, Platform } from 'react-native';

declare global {
  // Optional override (debugger / one-off). Prefer Metro auto-detect in __DEV__.
  // Set before app init: globalThis.__LUNARA_API_BASE_URL__ = 'http://192.168.x.x:8081/api'
  // eslint-disable-next-line no-var
  var __LUNARA_API_BASE_URL__: string | undefined;
}

/** Production API (release builds). Documented intentional default — see README. */
const PROD_API_BASE_URL =
  'https://lunaranew-e6853745dbd7.herokuapp.com/api';

/** Metro port; /api is proxied to the backend (see metro.config.js). */
const DEV_METRO_PORT = 8081;

/**
 * Android emulator loopback to the host Metro server.
 */
const DEV_ANDROID_EMULATOR_API_BASE_URL = `http://10.0.2.2:${DEV_METRO_PORT}/api`;

/** iOS Simulator / USB-forwarded localhost Metro. */
const DEV_IOS_API_BASE_URL = `http://localhost:${DEV_METRO_PORT}/api`;

type SourceCodeModule = {
  scriptURL?: string;
  getConstants?: () => { scriptURL?: string };
};

export type ResolveApiBaseUrlOptions = {
  isDev: boolean;
  platformOS: typeof Platform.OS | string;
  scriptURL?: string | null;
  override?: string;
};

function readMetroScriptURL(): string | null {
  try {
    const sourceCode = NativeModules.SourceCode as SourceCodeModule | undefined;
    const fromProp = sourceCode?.scriptURL;
    if (typeof fromProp === 'string' && fromProp.length > 0) {
      return fromProp;
    }
    const fromConstants = sourceCode?.getConstants?.()?.scriptURL;
    if (typeof fromConstants === 'string' && fromConstants.length > 0) {
      return fromConstants;
    }
  } catch {
    // Jest / missing native module
  }
  return null;
}

/**
 * Origin of the packager that served JS (`http://host:port`).
 * On a physical device this is USB `localhost:8081` or the PC LAN IP:8081.
 */
export function getDevPackagerOrigin(
  scriptURL: string | null | undefined,
): string | null {
  if (typeof scriptURL !== 'string' || scriptURL.length === 0) {
    return null;
  }
  const match = scriptURL.match(
    /^(https?):\/\/(\[[^\]]+\]|[^:/]+)(?::(\d+))?/i,
  );
  if (!match) {
    return null;
  }
  const protocol = match[1];
  const host = match[2];
  const port = match[3] || String(DEV_METRO_PORT);
  return `${protocol}://${host}:${port}`;
}

export function resolveApiBaseUrl({
  isDev,
  platformOS,
  scriptURL,
  override,
}: ResolveApiBaseUrlOptions): string {
  if (typeof override === 'string' && override.trim().length > 0) {
    return override.replace(/\/+$/, '');
  }

  if (!isDev) {
    return PROD_API_BASE_URL;
  }

  const origin = getDevPackagerOrigin(scriptURL);
  if (origin) {
    return `${origin}/api`;
  }

  if (platformOS === 'android') {
    return DEV_ANDROID_EMULATOR_API_BASE_URL;
  }

  return DEV_IOS_API_BASE_URL;
}

export function getApiBaseUrl(): string {
  const override = globalThis.__LUNARA_API_BASE_URL__;
  return resolveApiBaseUrl({
    isDev: __DEV__,
    platformOS: Platform.OS,
    scriptURL: readMetroScriptURL(),
    override: typeof override === 'string' ? override : undefined,
  });
}

export const API_BASE_URL = getApiBaseUrl();
