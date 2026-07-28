import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PartnerHome from '../../screens/partner/Home/index';
import PartnerCycleInsight from '../../screens/partner/CycleInsight/index';
import PartnerTrack from '../../screens/partner/Track/index';

export type PartnerStackParamList = {
  Home: undefined;
  Cycle: undefined;
  Track: undefined;
};

const Stack = createNativeStackNavigator<PartnerStackParamList>();

export default function PartnerStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen name="Home" component={PartnerHome} />
      <Stack.Screen name="Cycle" component={PartnerCycleInsight} />
      <Stack.Screen name="Track" component={PartnerTrack} />
    </Stack.Navigator>
  );
}
