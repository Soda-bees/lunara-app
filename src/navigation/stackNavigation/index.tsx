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
import SleepTracker from '../../screens/SleepTracker';
import CycleInsight from '../../screens/CycleInsight';
import FounderStory from '../../screens/FounderStory';
import HormoneResetGuide from '../../screens/HormoneResetGuide';
import Profile from '../../screens/Profile';
import ChallengeHub from '../../screens/ChallengeHub';
import DetoxChallenge from '../../screens/DetoxChallenge';
import { AccountSetupScreen } from '../../screens/onboarding/AccountSetupScreen';
import { BasicInfoScreen } from '../../screens/onboarding/BasicInfoScreen';
import { GoalsScreen } from '../../screens/onboarding/GoalsScreen';
import { WomenHealthScreen } from '../../screens/onboarding/WomenHealthScreen';
import { DietaryPreferencesScreen } from '../../screens/onboarding/DietaryPreferencesScreen';
import { LifestyleScreen } from '../../screens/onboarding/LifestyleScreen';
import { MedicalInfoScreen } from '../../screens/onboarding/MedicalInfoScreen';
import { OnboardingCompleteScreen } from '../../screens/onboarding/OnboardingCompleteScreen';
import { HomeScreen } from '../../screens/HomeScreen/HomeScreen';
import { NutritionScreen } from '../../screens/NutritionScreen/NutritionScreen';
import { MealDetailScreen } from '../../screens/MealDetailScreen/MealDetailScreen';
import { ChallengesScreen } from '../../screens/ChallengesScreen/ChallengesScreen';
import { ChallengeDetailScreen } from '../../screens/ChallengeDetailScreen/ChallengeDetailScreen';
import { MovementsScreen } from '../../screens/MovementsScreen/MovementsScreen';
import { WorkoutDetailScreen } from '../../screens/WorkoutDetailScreen/WorkoutDetailScreen';
import { SymptomsScreen } from '../../screens/SymptomsScreen/SymptomsScreen';
import { PeriodsScreen } from '../../screens/PeriodsScreen/PeriodsScreen';
import Journal from '../../screens/Journal';
import Journals from '../../screens/Journals';
import WriteJournal from '../../screens/WriteJournal';
import CycleHistory from '../../screens/CycleHistory';
// PregnancyDashboard is now merged into CycleInsight (Insights tab)
// import PregnancyDashboard from '../../screens/PregnancyDashboard';
import PregnancyInfo from '../../screens/PregnancyInfo';
import PregnancyHistory from '../../screens/PregnancyHistory';
import SymptomHistory from '../../screens/SymptomHistory';
import PostpartumTransition from '../../screens/PostpartumTransition';
import { ProfileScreen } from '../../screens/ProfileScreen/ProfileScreen';
import { CycleInsightsScreen } from '../../screens/CycleInsightsScreen/CycleInsightsScreen';
import { SleepTrackingScreen } from '../../screens/SleepTrackingScreen/SleepTrackingScreen';
import Track from '../../screens/Track';
import { NavigationHandler } from '../../components/NavigationHandler/NavigationHandler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider } from '../../context/OnboardingContext';
import { StatusBar } from 'react-native';
import { WelcomeScreen } from '../../screens/WelcomeScreen';
import type { SessionRoute } from '../../utils/resolveSessionRoute';
import { LetsGetStarted } from '../../screens/LetsGetStarted';
import { YoureDoingGreat } from '../../screens/YoureDoingGreat';
import { UniqueJourney } from '../../screens/UniqueJourney';
import { FuelAndJoy } from '../../screens/FuelAndJoy';
import { DailyLifeMatters } from '../../screens/DailyLifeMatters';
import { HealthStory } from '../../screens/HealthStory';
import { AlmostThere } from '../../screens/AlmostThere';
import { FastingHome } from '../../screens/FastingHome/FastingHome';
import { JournalProvider } from '../../context/JournalContext';
import { JournalType } from '../../types';
import WeeklyMealPlanningScreen from '../../screens/WeeklyMealPlanning';
import GroceryListScreen from '../../screens/GroceryList';
import WeeklyMealOverviewScreen from '../../screens/WeeklyMealOverview';
import RitualLibraryScreen from '../../screens/RitualLibrary';

export type RootStackParamList = {
  SignIn: any;
  IntroSlider: any;
  SignUp: any;
  PrivacyConsent: any;
  ForgotPassword: { from?: string } | undefined;
  OTP: { email: string } | undefined;
  ResetPassword: { email: string; otp: string } | undefined;
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
  CycleInsight: { tab?: string } | undefined;
  FounderStory: any;
  HormoneResetGuide: any;
  UserProfile: any;
  ChallengeHub: any;
  DetoxChallenge: any;
  Welcome: undefined;
  Login: { from?: string } | undefined;
  AccountSetup: { googleUser?: { email: string; name: string } } | undefined;
  BasicInfo: undefined;
  Goals: undefined;
  WomenHealth: undefined;
  DietaryPreferences: undefined;
  Lifestyle: undefined;
  MedicalInfo: undefined;
  OnboardingComplete: undefined;
  Home: undefined;
  Nutrition: undefined;
  MealDetail: undefined;
  Challenges: undefined;
  ChallengeDetail: undefined;
  Movements: undefined;
  WorkoutDetail: undefined;
  Symptoms: undefined;
  Periods: undefined;
  Journal: { id: string };
  Journals: undefined;
  WriteJournal: { journal?: JournalType } | undefined;
  Profile: undefined;
  CycleInsights: undefined;
  SleepTracking: undefined;
  Track:
    | { initialCategory?: 'Nutrition' | 'Movement' | 'Mindful' }
    | undefined;
  // PregnancyDashboard: undefined; // Merged into CycleInsight (Insights tab)
  PregnancyInfo: undefined;
  PregnancyHistory: undefined;
  PostpartumTransition: undefined;
  LetsGetStarted: undefined;
  YoureDoingGreat: undefined;
  UniqueJourney: undefined;
  FuelAndJoy: undefined;
  DailyLifeMatters: undefined;
  HealthStory: undefined;
  AlmostThere: undefined;
  CycleHistory: undefined;
  SymptomHistory: undefined;
  FastingHome: undefined;
  WeeklyMealPlanning: undefined;
  WeeklyMealOverview: undefined;
  GroceryList: undefined;
  RitualLibrary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type MainStackProps = {
  initialSessionRoute: SessionRoute;
};

export default function MainStack({ initialSessionRoute }: MainStackProps) {
  const initialRouteName =
    initialSessionRoute === 'TabNavigator' ? 'TabNavigator' : 'Welcome';

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationHandler initialSessionRoute={initialSessionRoute} />
        <JournalProvider>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
              headerShown: false,
              freezeOnBlur: true,
            }}
          >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={SignIn} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="AccountSetup" component={AccountSetupScreen} />
          <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
          <Stack.Screen name="Goals" component={GoalsScreen} />
          <Stack.Screen name="WomenHealth" component={WomenHealthScreen} />
          <Stack.Screen
            name="DietaryPreferences"
            component={DietaryPreferencesScreen}
          />
          <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
          <Stack.Screen name="MedicalInfo" component={MedicalInfoScreen} />
          <Stack.Screen
            name="OnboardingComplete"
            component={OnboardingCompleteScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Nutrition" component={NutritionScreen} />
          <Stack.Screen name="MealDetail" component={MealDetailScreen} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} />
          <Stack.Screen
            name="ChallengeDetail"
            component={ChallengeDetailScreen}
          />
          <Stack.Screen name="Movements" component={MovementsScreen} />
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
          <Stack.Screen name="Symptoms" component={SymptomsScreen} />
          <Stack.Screen name="Periods" component={PeriodsScreen} />
          <Stack.Screen name="CycleHistory" component={CycleHistory} />
          {/* PregnancyDashboard is now merged into CycleInsight (Insights tab) */}
          {/* <Stack.Screen name="PregnancyDashboard" component={PregnancyDashboard} /> */}
          <Stack.Screen name="PregnancyInfo" component={PregnancyInfo} />
          <Stack.Screen name="PregnancyHistory" component={PregnancyHistory} />
          <Stack.Screen name="SymptomHistory" component={SymptomHistory} />
          <Stack.Screen name="PostpartumTransition" component={PostpartumTransition} />
          <Stack.Screen name="Journal" component={Journal} />
          <Stack.Screen name="Journals" component={Journals} />
          <Stack.Screen name="WriteJournal" component={WriteJournal} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="CycleInsights" component={CycleInsightsScreen} />
          <Stack.Screen name="SleepTracking" component={SleepTrackingScreen} />
          <Stack.Screen name="Track" component={Track} />
          <Stack.Screen name="LetsGetStarted" component={LetsGetStarted} />
          <Stack.Screen name="YoureDoingGreat" component={YoureDoingGreat} />
          <Stack.Screen name="UniqueJourney" component={UniqueJourney} />
          <Stack.Screen name="FuelAndJoy" component={FuelAndJoy} />
          <Stack.Screen name="DailyLifeMatters" component={DailyLifeMatters} />
          <Stack.Screen name="HealthStory" component={HealthStory} />
          <Stack.Screen name="AlmostThere" component={AlmostThere} />
          <Stack.Screen name="FastingHome" component={FastingHome} />
          <Stack.Screen
            name="WeeklyMealPlanning"
            component={WeeklyMealPlanningScreen}
          />
          <Stack.Screen
            name="WeeklyMealOverview"
            component={WeeklyMealOverviewScreen}
          />
          <Stack.Screen name="RitualLibrary" component={RitualLibraryScreen} />
          <Stack.Screen name="GroceryList" component={GroceryListScreen} />

          <Stack.Screen name="IntroSlider" component={IntroSlider} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="CycleInsight" component={CycleInsight} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OTP" component={OTP} />
          <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
          <Stack.Screen name="PrivacyConsent" component={PrivacyConsent} />
          <Stack.Screen name="NameInput" component={NameInput} />
          <Stack.Screen name="GetToKnow" component={GetToKnow} />
          <Stack.Screen name="UploadProfile" component={UploadProfile} />
          <Stack.Screen name="WhoIsTheUser" component={WhoIsTheUser} />
          <Stack.Screen
            name="AboutYouTransition"
            component={AboutYouTransition}
          />
          <Stack.Screen name="BirthdayInput" component={BirthdayInput} />
          <Stack.Screen name="PregnancyStatus" component={PregnancyStatus} />
          <Stack.Screen
            name="YourJourneyTransition"
            component={YourJourneyTransition}
          />
          <Stack.Screen
            name="TrackingAnimation"
            component={TrackingAnimation}
          />
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
          <Stack.Screen name="FounderStory" component={FounderStory} />
          <Stack.Screen
            name="HormoneResetGuide"
            component={HormoneResetGuide}
          />
          <Stack.Screen name="UserProfile" component={Profile} />
          <Stack.Screen name="ChallengeHub" component={ChallengeHub} />
          <Stack.Screen name="DetoxChallenge" component={DetoxChallenge} />
          </Stack.Navigator>
        </JournalProvider>
        {/* </NavigationContainer> */}
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
