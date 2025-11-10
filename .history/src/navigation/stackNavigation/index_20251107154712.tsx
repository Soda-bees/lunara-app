import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../../screens/SignIn';
import IntroSlider from '../../screens/IntroSlider';
import SignUp from '../../screens/SignUp';
import PrivacyConsent from '../../screens/PrivacyConsent';
import ForgotPassword from '../../screens/ForgotPassword';
import OTP from '../../screens/OTP';
import ResetPassword from '../../screens/ResetPassword';
import ResetSuccess from '../../screens/ResetSuccess';
import NameInput from '../../screens/NameInput';
import GetToKnow from '../../screens/GetToKnow';

export type RootStackParamList = {
  SignIn: any;
  IntroSlider: any;
  SignUp: any;
  PrivacyConsent: any;
  ForgotPassword: any;
  OTP: any;
  ResetPassword: any;
  ResetSuccess: any;
  NameInput: any;
  GetToKnow: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroSlider" component={IntroSlider} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
      <Stack.Screen name="NameInput" component={NameInput} />
      <Stack.Screen name="GetToKnow" component={GetToKnow} />
    </Stack.Navigator>
  );
}
