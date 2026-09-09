import AsyncStorage from '@react-native-async-storage/async-storage';

const PARTNER_CODE_KEY = '@lunara/partnerConnectCode';

export type StoredPartnerCode = {
  code: string;
  expiresAt: string;
};

export async function getStoredPartnerCode(): Promise<StoredPartnerCode | null> {
  try {
    const raw = await AsyncStorage.getItem(PARTNER_CODE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPartnerCode;
    if (!parsed?.code || !parsed?.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      await clearStoredPartnerCode();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function persistPartnerCode(
  code: string,
  expiresAt: string,
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      PARTNER_CODE_KEY,
      JSON.stringify({ code, expiresAt } satisfies StoredPartnerCode),
    );
  } catch {
    // Ignore write failures; in-session state still works.
  }
}

export async function clearStoredPartnerCode(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PARTNER_CODE_KEY);
  } catch {
    // Best-effort
  }
}
