import { CommonActions } from '@react-navigation/native';
import { clearToken, partnerLogout } from '../services/api';

type ExitNavigation = {
  getParent: () => ExitNavigation | undefined;
  dispatch: (action: ReturnType<typeof CommonActions.reset>) => void;
};

function getRootNavigation(navigation: ExitNavigation): ExitNavigation {
  let root = navigation;
  let parent = root.getParent();
  while (parent) {
    root = parent;
    parent = root.getParent();
  }
  return root;
}

export type ExitPartnerViewOptions = {
  navigation: ExitNavigation;
  resetData: () => void | Promise<void>;
  refreshSessionType?: () => void | Promise<void>;
};

export async function performExitPartnerView({
  navigation,
  resetData,
  refreshSessionType,
}: ExitPartnerViewOptions) {
  try {
    try {
      await partnerLogout();
    } catch {
      // Best-effort server logout.
    }
    await clearToken();
    await resetData();
    await refreshSessionType?.();
    getRootNavigation(navigation).dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      }),
    );
  } catch (error) {
    console.error('Exit partner view error:', error);
  }
}
