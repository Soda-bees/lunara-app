import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import images from '../../constants/images';
import { fontSize } from '../../constants/fonts';
import Cycle from '../../screens/Cycle';
import Track from '../../screens/Track';
import More from '../../screens/More';
import Home from '../../screens/Home';
const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const iconSets = {
    Home: { focused: images.btHomeActive, unfocused: images.btHome },
    Cycle: { focused: images.btCycleActive, unfocused: images.btCycle },
    Track: { focused: images.btTrackActive, unfocused: images.btTrack },
    More: { focused: images.btMoreActive, unfocused: images.btMore },
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: props => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: 'transparent' }}
          />
        ),
        tabBarIcon: ({ focused }) => {
          const icon = focused
            ? iconSets[route.name as keyof typeof iconSets].focused
            : iconSets[route.name as keyof typeof iconSets].unfocused;
          return <Image source={icon} style={styles.icon} />;
        },
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: colors.white,
          width: sizes.screenWidth,
          height: sizes.screenHeight * 0.08 + insets.bottom,
          paddingTop: 4,
          borderTopWidth: 0,
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontFamily: 'Medium',
          fontSize: fontSize.small,
          fontWeight: '400',
          top: 2,
        },
        tabBarActiveTintColor: '#DC87A9',
        tabBarInactiveTintColor: '#A0A0A0',
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
