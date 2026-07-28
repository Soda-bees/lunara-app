/**
 * @format
 *
 * Sentry (OBS-003):
 * - Set DSN at runtime: globalThis.__LUNARA_SENTRY_DSN__ = 'https://...@....ingest.sentry.io/...'
 * - When DSN is unset, SDK stays disabled (dev builds unaffected).
 * - Source maps (v1 not automated): for release builds, upload JS source maps with
 *   `@sentry/cli` / `npx @sentry/wizard -i reactNative` per
 *   https://docs.sentry.io/platforms/react-native/sourcemaps/
 * - After installing, run `cd ios && pod install` on macOS for native crash support.
 */

import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import * as Sentry from '@sentry/react-native';
import App from './App';
import { name as appName } from './app.json';

// Improves navigation performance by using native screens.
enableScreens();

const sentryDsn =
  typeof globalThis.__LUNARA_SENTRY_DSN__ === 'string'
    ? globalThis.__LUNARA_SENTRY_DSN__.trim()
    : '';

Sentry.init({
  dsn: sentryDsn || undefined,
  enabled: Boolean(sentryDsn),
  sendDefaultPii: false,
  environment: __DEV__ ? 'development' : 'production',
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
