/**
 * Forwards device localhost:8080 → PC :8080 so a USB or wireless-adb
 * phone can still hit the API directly if Metro proxy is not used.
 * Never fails the Android run — emulators and missing adb are skipped.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const API_PORT = '8080';
const ADB_NAME = process.platform === 'win32' ? 'adb.exe' : 'adb';

function resolveAdb() {
  const candidates = [
    process.env.ANDROID_HOME &&
      path.join(process.env.ANDROID_HOME, 'platform-tools', ADB_NAME),
    process.env.ANDROID_SDK_ROOT &&
      path.join(process.env.ANDROID_SDK_ROOT, 'platform-tools', ADB_NAME),
    process.env.LOCALAPPDATA &&
      path.join(
        process.env.LOCALAPPDATA,
        'Android',
        'Sdk',
        'platform-tools',
        ADB_NAME,
      ),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return ADB_NAME;
}

function listDeviceSerials(adb) {
  const result = spawnSync(adb, ['devices'], { encoding: 'utf8' });
  if (result.error) {
    console.warn(
      '[lunara] adb not found; skip API port reverse (USB/wireless-adb tunnel).',
    );
    return [];
  }
  if (result.status !== 0) {
    console.warn(
      `[lunara] adb devices failed; skip API port reverse.\n${result.stderr || result.stdout}`,
    );
    return [];
  }

  return (result.stdout || '')
    .split(/\r?\n/)
    .slice(1)
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('*'))
    .map(line => line.split(/\s+/))
    .filter(parts => parts[1] === 'device')
    .map(parts => parts[0]);
}

function reverseApiPort(adb, serial) {
  const result = spawnSync(
    adb,
    ['-s', serial, 'reverse', `tcp:${API_PORT}`, `tcp:${API_PORT}`],
    { encoding: 'utf8' },
  );
  if (result.status === 0) {
    console.log(
      `[lunara] adb reverse tcp:${API_PORT} → host :${API_PORT} (${serial})`,
    );
    return;
  }
  console.warn(
    `[lunara] adb reverse tcp:${API_PORT} skipped for ${serial}: ${
      (result.stderr || result.stdout || 'unknown error').trim()
    }`,
  );
}

function main() {
  const adb = resolveAdb();
  const serials = listDeviceSerials(adb);
  if (serials.length === 0) {
    console.warn(
      '[lunara] No adb devices in "device" state; skip API port reverse.',
    );
    return;
  }
  serials.forEach(serial => reverseApiPort(adb, serial));
}

main();
