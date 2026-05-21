import AsyncStorage from '@react-native-async-storage/async-storage';

const DISMISS_PREFIX = '@lunara_weekly_plan_prompt_dismissed_';

export async function wasWeeklyPlanPromptDismissed(
  weekStartIso: string,
): Promise<boolean> {
  try {
    const val = await AsyncStorage.getItem(`${DISMISS_PREFIX}${weekStartIso}`);
    return val === '1';
  } catch {
    return false;
  }
}

export async function dismissWeeklyPlanPrompt(weekStartIso: string): Promise<void> {
  try {
    await AsyncStorage.setItem(`${DISMISS_PREFIX}${weekStartIso}`, '1');
  } catch {
    // ignore
  }
}
