import { Alert } from 'react-native';
type ErrorShowProps = {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onHide?: () => void;
};

export const ErrorShow = ({ type, title, message, onHide }: ErrorShowProps): void => {
  // Temporary local fallback: avoids external toast dependency during integration.
  // Keeps callsites unchanged until backend/UI toast system is finalized.
  Alert.alert(title, message, [
    {
      text: type === 'error' ? 'OK' : 'Close',
      onPress: onHide,
    },
  ]);
};
