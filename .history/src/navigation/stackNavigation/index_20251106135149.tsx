import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../../screens/SignIn';
import IntroSlider from '../../screens/IntroSlider';
import SignUp from '../../screens/SignUp';

export type RootStackParamList = {
  SignIn: any;
  IntroSlider: any;
  SignUp: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroSlider" component={IntroSlider} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}
