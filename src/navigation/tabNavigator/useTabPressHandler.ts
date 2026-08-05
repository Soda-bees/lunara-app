import { useCallback, useRef, useState } from 'react';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

type TabBarOnPress = NonNullable<BottomTabBarButtonProps['onPress']>;

export function useTabPressHandler() {
  const [pressedRoute, setPressedRoute] = useState('');
  const triggerRef = useRef('');

  const handleTabPress = useCallback(
    (
      routeName: string,
      props: Pick<BottomTabBarButtonProps, 'onPress'>,
    ): TabBarOnPress =>
      e => {
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
