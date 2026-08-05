import React from 'react';
import { View } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import type {
  BottomTabBarButtonProps,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  getTabIcon,
  TabRouteName,
} from '../../constants/content/tabNavigatorIcons';
import AnimatedTabIcon from '../../components/AnimatedTabIcon';

type TabPressHandler = (
  routeName: string,
  props: Pick<BottomTabBarButtonProps, 'onPress'>,
) => NonNullable<BottomTabBarButtonProps['onPress']>;

export const MAIN_TAB_SCREENS = [
  { name: 'Home' as const, label: 'Home' },
  { name: 'Cycle' as const, label: 'Insights' },
  { name: 'Track' as const, label: 'Track' },
  { name: 'More' as const, label: 'More' },
];

export function getMainTabScreenOptions(
  insets: { bottom: number },
  pressedRoute: string,
  handleTabPress: TabPressHandler,
): (options: { route: { name: string } }) => BottomTabNavigationOptions {
  return ({ route }) => {
    const tabLabel =
      MAIN_TAB_SCREENS.find(screen => screen.name === route.name)?.label ??
      route.name;

    return {
      tabBarAccessibilityLabel: tabLabel,
      tabBarButton: props => (
        <PlatformPressable
          {...props}
          accessibilityRole="button"
          accessibilityLabel={tabLabel}
          android_ripple={{ color: 'transparent' }}
          onPress={handleTabPress(route.name, props)}
        />
      ),
      tabBarIcon: ({ focused }) => {
        const icon = getTabIcon(route.name as TabRouteName, focused);
        return (
          <View accessible={false} importantForAccessibility="no-hide-descendants">
            <AnimatedTabIcon
              source={icon}
              triggerAnimation={pressedRoute === route.name}
            />
          </View>
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
    };
  };
}
