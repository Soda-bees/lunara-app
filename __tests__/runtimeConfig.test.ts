import {
  getDevPackagerOrigin,
  resolveApiBaseUrl,
} from '../src/config/runtimeConfig';

const PROD = 'https://lunaranew-e6853745dbd7.herokuapp.com/api';

describe('getDevPackagerOrigin', () => {
  it('parses a LAN Metro URL used by wireless devices', () => {
    expect(
      getDevPackagerOrigin(
        'http://192.168.1.24:8081/index.bundle?platform=android&dev=true',
      ),
    ).toBe('http://192.168.1.24:8081');
  });

  it('parses localhost used by USB adb reverse', () => {
    expect(getDevPackagerOrigin('http://localhost:8081/index.bundle')).toBe(
      'http://localhost:8081',
    );
  });

  it('parses the Android emulator host', () => {
    expect(getDevPackagerOrigin('http://10.0.2.2:8081/index.bundle')).toBe(
      'http://10.0.2.2:8081',
    );
  });

  it('parses IPv6 hosts with brackets', () => {
    expect(getDevPackagerOrigin('http://[::1]:8081/index.bundle')).toBe(
      'http://[::1]:8081',
    );
  });

  it('returns null for missing or non-http URLs', () => {
    expect(getDevPackagerOrigin(null)).toBeNull();
    expect(
      getDevPackagerOrigin('file:///android_asset/index.android.bundle'),
    ).toBeNull();
  });
});

describe('resolveApiBaseUrl', () => {
  it('uses an explicit override first', () => {
    expect(
      resolveApiBaseUrl({
        isDev: true,
        platformOS: 'android',
        scriptURL: 'http://10.0.2.2:8081/index.bundle',
        override: 'http://192.168.0.9:8081/api/',
      }),
    ).toBe('http://192.168.0.9:8081/api');
  });

  it('uses production in release builds', () => {
    expect(
      resolveApiBaseUrl({
        isDev: false,
        platformOS: 'android',
        scriptURL: 'http://192.168.1.24:8081/index.bundle',
      }),
    ).toBe(PROD);
  });

  it('points a wireless device at Metro so /api is proxied', () => {
    expect(
      resolveApiBaseUrl({
        isDev: true,
        platformOS: 'android',
        scriptURL:
          'http://192.168.1.24:8081/index.bundle?platform=android&dev=true',
      }),
    ).toBe('http://192.168.1.24:8081/api');
  });

  it('points USB adb at localhost Metro (reverse tcp:8081)', () => {
    expect(
      resolveApiBaseUrl({
        isDev: true,
        platformOS: 'android',
        scriptURL: 'http://localhost:8081/index.bundle',
      }),
    ).toBe('http://localhost:8081/api');
  });

  it('falls back to emulator / simulator Metro hosts when URL is unknown', () => {
    expect(
      resolveApiBaseUrl({
        isDev: true,
        platformOS: 'android',
        scriptURL: null,
      }),
    ).toBe('http://10.0.2.2:8081/api');

    expect(
      resolveApiBaseUrl({
        isDev: true,
        platformOS: 'ios',
        scriptURL: null,
      }),
    ).toBe('http://localhost:8081/api');
  });
});
