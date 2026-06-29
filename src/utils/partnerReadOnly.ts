import { Alert } from 'react-native';

export function showPartnerReadOnlyAlert() {
  Alert.alert(
    'Read only',
    'Partner view is read-only. Exit partner view to make changes.',
  );
}
