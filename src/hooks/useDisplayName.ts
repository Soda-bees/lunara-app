import { usePartnerMode } from '../context/PartnerModeContext';
import { useUserIdentity } from '../context/UserIdentityContext';

/** Owner name from UserIdentityContext; partner view prefers primaryUserName. */
export function useDisplayName(): string {
  const { isPartnerMode, primaryUserName } = usePartnerMode();
  const { displayName } = useUserIdentity();

  if (isPartnerMode) {
    return primaryUserName || displayName;
  }
  return displayName;
}
