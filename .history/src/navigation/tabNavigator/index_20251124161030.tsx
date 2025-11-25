import React, { useCallback, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';
import Cycle from '../../screens/Cycle';
import Track from '../../screens/Track';
import More from '../../screens/More';
import Home from '../../screens/Home';
import {
  getTabIcon,
  TabRouteName,
} from '../../constants/content/tabNavigatorIcons';
import AnimatedTabIcon from '../../components/AnimatedTabIcon/indes';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const [pressedRoute, setPressedRoute] = useState<string>('');
  const triggerRef = useRef<string>('');

  const handleTabPress = useCallback(
    (routeName: string, props: any) => (e: any) => {
      triggerRef.current = routeName;
      setPressedRoute(routeName);

      props.onPress?.(e);

      // Reset quickly to avoid repeated animations
      setTimeout(() => {
        triggerRef.current = '';
        setPressedRoute('');
      }, 10);
    },
    [],
  );
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
          // position: 'absolute',
          backgroundColor: colors.white,
          width: sizes.screenWidth,
          height: sizes.screenHeight * 0.08 + insets.bottom,
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
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Cycle"
        component={Cycle}
        options={{ tabBarLabel: 'Cycle' }}
      />
      <Tab.Screen
        name="Track"
        component={Track}
        options={{ tabBarLabel: 'Track' }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{ tabBarLabel: 'More' }}
      />
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  icon: {
    height: 22,
    width: 22,
  },
});
