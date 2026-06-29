import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Track from '../../screens/Track';
import More from '../../screens/More';
import Home from '../../screens/Home';
import CycleInsight from '../../screens/CycleInsight';
import { getMainTabScreenOptions, MAIN_TAB_SCREENS } from './sharedTabScreenOptions';
import { useTabPressHandler } from './useTabPressHandler';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { pressedRoute, handleTabPress } = useTabPressHandler();

  return (
    <Tab.Navigator
      screenOptions={getMainTabScreenOptions(insets, pressedRoute, handleTabPress)}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name="Cycle"
        component={CycleInsight}
        options={{ tabBarLabel: 'Insights' }}
      />
      <Tab.Screen name="Track" component={Track} options={{ tabBarLabel: 'Track' }} />
      <Tab.Screen name="More" component={More} options={{ tabBarLabel: 'More' }} />
    </Tab.Navigator>
  );
}
