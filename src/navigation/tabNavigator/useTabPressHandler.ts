import { useCallback, useRef, useState } from 'react';

export function useTabPressHandler() {
  const [pressedRoute, setPressedRoute] = useState('');
  const triggerRef = useRef('');

  const handleTabPress = useCallback(
    (routeName: string, props: { onPress?: (e: unknown) => void }) =>
      (e: unknown) => {
        triggerRef.current = routeName;
        setPressedRoute(routeName);
        props.onPress?.(e);
        setTimeout(() => {
          triggerRef.current = '';
          setPressedRoute('');
        }, 10);
      },
    [],
  );

  return { pressedRoute, handleTabPress };
}
