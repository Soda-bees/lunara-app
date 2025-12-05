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
import UploadProfile from '../../screens/UploadProfile';
import WhoIsTheUser from '../../screens/WhoIsTheUser';
import AboutYouTransition from '../../screens/AboutYouTransition';
import BirthdayInput from '../../screens/BirthdayInput';
import PregnancyStatus from '../../screens/PregnancyStatus';
import YourJourneyTransition from '../../screens/YourJourneyTransition';
import TrackingAnimation from '../../screens/TrackingAnimation';
import RhythmAnimation from '../../screens/RhythmAnimation';
import YourStrengthTransition from '../../screens/YourStrengthTransition';
import AllSetTransition from '../../screens/AllSetTransition';
import AboutTodayTransition from '../../screens/AboutTodayTransition';
import Weight from '../../screens/Weight';
import Height from '../../screens/Height';
import PeriodDuration from '../../screens/PeriodDuration';
import CyclePattern from '../../screens/CyclePattern';
import QuickTracking from '../../screens/QuickTracking';
import TabNavigator from '../tabNavigator';
import { TabRouteName } from '../../constants/content/tabNavigatorIcons';
import SleepTracker from '../../screens/SleepTracker';
import CycleInsight from '../../screens/CycleInsight';
import Workouts from '../../screens/Workouts';
import FounderStory from '../../screens/FounderStory';
import HormoneResetGuide from '../../screens/HormoneResetGuide';
import Profile from '../../screens/Profile';

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
  UploadProfile: any;
  WhoIsTheUser: any;
  AboutYouTransition: any;
  BirthdayInput: any;
  PregnancyStatus: any;
  YourJourneyTransition: any;
  TrackingAnimation: any;
  RhythmAnimation: any;
  YourStrengthTransition: any;
  AllSetTransition: any;
  AboutTodayTransition: any;
  Weight: any;
  Height: any;
  PeriodDuration: any;
  CyclePattern: any;
  QuickTracking: any;
  TabNavigator: any;
  SleepTracker: any;
  CycleInsight: any;
  Workouts: any;
  FounderStory: any;
  HormoneResetGuide: any;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="CycleInsight" component={CycleInsight} />
      <Stack.Screen name="IntroSlider" component={IntroSlider} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
      <Stack.Screen name="PrivacyConsent" component={PrivacyConsent} />
      <Stack.Screen name="NameInput" component={NameInput} />
      <Stack.Screen name="GetToKnow" component={GetToKnow} />
      <Stack.Screen name="UploadProfile" component={UploadProfile} />
      <Stack.Screen name="WhoIsTheUser" component={WhoIsTheUser} />
      <Stack.Screen name="AboutYouTransition" component={AboutYouTransition} />
      <Stack.Screen name="BirthdayInput" component={BirthdayInput} />
      <Stack.Screen name="PregnancyStatus" component={PregnancyStatus} />
      <Stack.Screen
        name="YourJourneyTransition"
        component={YourJourneyTransition}
      />
      <Stack.Screen name="TrackingAnimation" component={TrackingAnimation} />
      <Stack.Screen name="RhythmAnimation" component={RhythmAnimation} />
      <Stack.Screen
        name="YourStrengthTransition"
        component={YourStrengthTransition}
      />
      <Stack.Screen name="AllSetTransition" component={AllSetTransition} />
      <Stack.Screen
        name="AboutTodayTransition"
        component={AboutTodayTransition}
      />
      <Stack.Screen name="Weight" component={Weight} />
      <Stack.Screen name="Height" component={Height} />
      <Stack.Screen name="PeriodDuration" component={PeriodDuration} />
      <Stack.Screen name="CyclePattern" component={CyclePattern} />
      <Stack.Screen name="QuickTracking" component={QuickTracking} />
      <Stack.Screen name="SleepTracker" component={SleepTracker} />
      <Stack.Screen name="Workouts" component={Workouts} />
      <Stack.Screen name="FounderStory" component={FounderStory} />
      <Stack.Screen name="HormoneResetGuide" component={HormoneResetGuide} />
    </Stack.Navigator>
  );
}
