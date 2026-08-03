import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerHome from '../../screens/partner/Home/index';
import PartnerCycleInsight from '../../screens/partner/CycleInsight/index';
import PartnerTrack from '../../screens/partner/Track/index';

export type PartnerStackParamList = {
  Home: undefined;
  Cycle: undefined;
  Track: { initialCategory?: 'Nutrition' | 'Movement' | 'Mindful' };
};

const Stack = createNativeStackNavigator<PartnerStackParamList>();

/** Screen titles used for a11y / navigation announcements (MOB-023). */
const PARTNER_SCREEN_A11Y = {
  Home: 'Home',
  Cycle: 'Cycle insights',
  Track: 'Track',
} as const;

export default function PartnerStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen
        name="Home"
        component={PartnerHome}
        options={{ title: PARTNER_SCREEN_A11Y.Home }}
      />
      <Stack.Screen
        name="Cycle"
        component={PartnerCycleInsight}
        options={{ title: PARTNER_SCREEN_A11Y.Cycle }}
      />
      <Stack.Screen
        name="Track"
        component={PartnerTrack}
        options={{ title: PARTNER_SCREEN_A11Y.Track }}
      />
    </Stack.Navigator>
  );
}
