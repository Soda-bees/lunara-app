import React from 'react';
import { PlatformPressable } from '@react-navigation/elements';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  getTabIcon,
  TabRouteName,
} from '../../constants/content/tabNavigatorIcons';
import AnimatedTabIcon from '../../components/AnimatedTabIcon/indes';

type TabPressHandler = (
  routeName: string,
  props: { onPress?: (e: unknown) => void },
) => (e: unknown) => void;

export function getMainTabScreenOptions(
  insets: { bottom: number },
  pressedRoute: string,
  handleTabPress: TabPressHandler,
): (options: { route: { name: string } }) => BottomTabNavigationOptions {
  return ({ route }) => ({
    tabBarButton: props => (
      <PlatformPressable
        {...props}
        android_ripple={{ color: 'transparent' }}
        onPress={handleTabPress(route.name, props)}
      />
    ),
    tabBarIcon: ({ focused }) => {
      const icon = getTabIcon(route.name as TabRouteName, focused);
      return (
        <AnimatedTabIcon
          source={icon}
          triggerAnimation={pressedRoute === route.name}
        />
      );
    },
    headerShown: false,
    tabBarStyle: {
      backgroundColor: colors.white,
      width: sizes.screenWidth,
      height: 60 + insets.bottom,
      paddingTop: 4,
      borderTopWidth: 0,
      overflow: 'hidden',
    },
    tabBarLabelStyle: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      fontWeight: '400',
      top: 2,
    },
    tabBarActiveTintColor: '#E4AF5D',
    tabBarInactiveTintColor: '#7DA38D',
  });
}

export const MAIN_TAB_SCREENS = [
  { name: 'Home' as const, label: 'Home' },
  { name: 'Cycle' as const, label: 'Insights' },
  { name: 'Track' as const, label: 'Track' },
  { name: 'More' as const, label: 'More' },
];
