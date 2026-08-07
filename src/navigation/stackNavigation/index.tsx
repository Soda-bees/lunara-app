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
import TabNavigator from '../tabNavigator';
import PartnerStackNavigator from '../partnerStackNavigator';
import { AccountSetupScreen } from '../../screens/onboarding/AccountSetupScreen';
import { BasicInfoScreen } from '../../screens/onboarding/BasicInfoScreen';
import { GoalsScreen } from '../../screens/onboarding/GoalsScreen';
import { WomenHealthScreen } from '../../screens/onboarding/WomenHealthScreen';
import { DietaryPreferencesScreen } from '../../screens/onboarding/DietaryPreferencesScreen';
import { LifestyleScreen } from '../../screens/onboarding/LifestyleScreen';
import { MedicalInfoScreen } from '../../screens/onboarding/MedicalInfoScreen';
import { OnboardingCompleteScreen } from '../../screens/onboarding/OnboardingCompleteScreen';
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
import { JournalProvider } from '../../context/JournalContext';
import { JournalType } from '../../types';
import PartnerConnect from '../../screens/PartnerConnect';
import PartnerCodeEntry from '../../screens/PartnerCodeEntry';
import { PartnerModeProvider } from '../../context/PartnerModeContext';

export type RootStackParamList = {
  // Canonical auth route (NAV-001); SignIn kept in types for existing NavigationProp generics.
  Login: { from?: string } | undefined;
  SignIn: undefined;
  IntroSlider: undefined;
  SignUp: undefined;
  PrivacyConsent: undefined;
  ForgotPassword: { from?: string } | undefined;
  OTP: { email: string } | undefined;
  ResetPassword: { email: string; otp: string } | undefined;
  ResetSuccess: undefined;
  NameInput: undefined;
  GetToKnow: undefined;
  UploadProfile: undefined;
  WhoIsTheUser: undefined;
  AboutYouTransition: { profileImage?: string | null } | undefined;
  BirthdayInput: undefined;
  PregnancyStatus: undefined;
  YourJourneyTransition: undefined;
  TrackingAnimation: undefined;
  RhythmAnimation: undefined;
  YourStrengthTransition: undefined;
  AllSetTransition: undefined;
  AboutTodayTransition: undefined;
  Weight: undefined;
  Height:
    | { weightKg: number; measurementSystem?: 'metric' | 'imperial' }
    | undefined;
  PeriodDuration: undefined;
  CyclePattern: undefined;
  QuickTracking: undefined;
  TabNavigator: undefined;
  PartnerStackNavigator: undefined;
  SleepTracker: undefined;
  CycleInsight: { tab?: string } | undefined;
  FounderStory: undefined;
  HormoneResetGuide: undefined;
  UserProfile: undefined;
  ChallengeHub: undefined;
  DetoxChallenge: { challengeId: string; instanceId?: string };
  Welcome: undefined;
  AccountSetup: { googleUser?: { email: string; name: string } } | undefined;
  BasicInfo: undefined;
  Goals: undefined;
  WomenHealth: undefined;
  DietaryPreferences: undefined;
  Lifestyle: undefined;
  MedicalInfo: undefined;
  OnboardingComplete: undefined;
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
  EditProfileBody: undefined;
  EditProfileGoals: undefined;
  EditProfileDietary: undefined;
  Track:
    | { initialCategory?: 'Nutrition' | 'Movement' | 'Mindful' }
    | undefined;
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
  PartnerConnect: undefined;
  PartnerCodeEntry: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type MainStackProps = {
  initialSessionRoute: SessionRoute;
};

export default function MainStack({ initialSessionRoute }: MainStackProps) {
  const initialRouteName =
    initialSessionRoute === 'TabNavigator'
      ? 'TabNavigator'
      : initialSessionRoute === 'PartnerStackNavigator'
        ? 'PartnerStackNavigator'
        : 'Welcome';

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <PartnerModeProvider>
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
          {/* Eager: auth / onboarding / tabs / partner entry */}
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
          <Stack.Screen name="LetsGetStarted" component={LetsGetStarted} />
          <Stack.Screen name="YoureDoingGreat" component={YoureDoingGreat} />
          <Stack.Screen name="UniqueJourney" component={UniqueJourney} />
          <Stack.Screen name="FuelAndJoy" component={FuelAndJoy} />
          <Stack.Screen name="DailyLifeMatters" component={DailyLifeMatters} />
          <Stack.Screen name="HealthStory" component={HealthStory} />
          <Stack.Screen name="AlmostThere" component={AlmostThere} />
          <Stack.Screen name="IntroSlider" component={IntroSlider} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen
            name="PartnerStackNavigator"
            component={PartnerStackNavigator}
          />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="OTP" component={OTP} />
          <Stack.Screen name="ResetSuccess" component={ResetSuccess} />
          <Stack.Screen name="PrivacyConsent" component={PrivacyConsent} />
          <Stack.Screen name="PartnerConnect" component={PartnerConnect} />
          <Stack.Screen name="PartnerCodeEntry" component={PartnerCodeEntry} />

          {/* Lazy: deep / obscure stack screens (MOB-033) */}
          <Stack.Screen
            name="Nutrition"
            getComponent={() =>
              require('../../screens/NutritionScreen/NutritionScreen')
                .NutritionScreen
            }
          />
          <Stack.Screen
            name="MealDetail"
            getComponent={() =>
              require('../../screens/MealDetailScreen/MealDetailScreen')
                .MealDetailScreen
            }
          />
          <Stack.Screen
            name="Challenges"
            getComponent={() =>
              require('../../screens/ChallengesScreen/ChallengesScreen')
                .ChallengesScreen
            }
          />
          <Stack.Screen
            name="ChallengeDetail"
            getComponent={() =>
              require('../../screens/ChallengeDetailScreen/ChallengeDetailScreen')
                .ChallengeDetailScreen
            }
          />
          <Stack.Screen
            name="Movements"
            getComponent={() =>
              require('../../screens/MovementsScreen/MovementsScreen')
                .MovementsScreen
            }
          />
          <Stack.Screen
            name="WorkoutDetail"
            getComponent={() =>
              require('../../screens/WorkoutDetailScreen/WorkoutDetailScreen')
                .WorkoutDetailScreen
            }
          />
          <Stack.Screen
            name="Symptoms"
            getComponent={() =>
              require('../../screens/SymptomsScreen/SymptomsScreen')
                .SymptomsScreen
            }
          />
          <Stack.Screen
            name="Periods"
            getComponent={() =>
              require('../../screens/PeriodsScreen/PeriodsScreen').PeriodsScreen
            }
          />
          <Stack.Screen
            name="CycleHistory"
            getComponent={() => require('../../screens/CycleHistory').default}
          />
          <Stack.Screen
            name="PregnancyInfo"
            getComponent={() => require('../../screens/PregnancyInfo').default}
          />
          <Stack.Screen
            name="PregnancyHistory"
            getComponent={() =>
              require('../../screens/PregnancyHistory').default
            }
          />
          <Stack.Screen
            name="SymptomHistory"
            getComponent={() => require('../../screens/SymptomHistory').default}
          />
          <Stack.Screen
            name="PostpartumTransition"
            getComponent={() =>
              require('../../screens/PostpartumTransition').default
            }
          />
          <Stack.Screen
            name="Journal"
            getComponent={() => require('../../screens/Journal').default}
          />
          <Stack.Screen
            name="Journals"
            getComponent={() => require('../../screens/Journals').default}
          />
          <Stack.Screen
            name="WriteJournal"
            getComponent={() => require('../../screens/WriteJournal').default}
          />
          <Stack.Screen
            name="Profile"
            getComponent={() => require('../../screens/Profile').default}
          />
          <Stack.Screen
            name="EditProfileBody"
            getComponent={() =>
              require('../../screens/Profile/edit/EditBodyMetricsScreen').default
            }
          />
          <Stack.Screen
            name="EditProfileGoals"
            getComponent={() =>
              require('../../screens/Profile/edit/EditGoalsCycleScreen').default
            }
          />
          <Stack.Screen
            name="EditProfileDietary"
            getComponent={() =>
              require('../../screens/Profile/edit/EditDietaryScreen').default
            }
          />
          <Stack.Screen
            name="Track"
            getComponent={() => require('../../screens/Track').default}
          />
          <Stack.Screen
            name="FastingHome"
            getComponent={() =>
              require('../../screens/FastingHome/FastingHome').default
            }
          />
          <Stack.Screen
            name="WeeklyMealPlanning"
            getComponent={() =>
              require('../../screens/WeeklyMealPlanning').default
            }
          />
          <Stack.Screen
            name="WeeklyMealOverview"
            getComponent={() =>
              require('../../screens/WeeklyMealOverview').default
            }
          />
          <Stack.Screen
            name="RitualLibrary"
            getComponent={() => require('../../screens/RitualLibrary').default}
          />
          <Stack.Screen
            name="GroceryList"
            getComponent={() => require('../../screens/GroceryList').default}
          />
          <Stack.Screen
            name="CycleInsight"
            getComponent={() => require('../../screens/CycleInsight').default}
          />
          <Stack.Screen
            name="NameInput"
            getComponent={() => require('../../screens/NameInput').default}
          />
          <Stack.Screen
            name="GetToKnow"
            getComponent={() => require('../../screens/GetToKnow').default}
          />
          <Stack.Screen
            name="UploadProfile"
            getComponent={() => require('../../screens/UploadProfile').default}
          />
          <Stack.Screen
            name="WhoIsTheUser"
            getComponent={() => require('../../screens/WhoIsTheUser').default}
          />
          <Stack.Screen
            name="AboutYouTransition"
            getComponent={() =>
              require('../../screens/AboutYouTransition').default
            }
          />
          <Stack.Screen
            name="BirthdayInput"
            getComponent={() => require('../../screens/BirthdayInput').default}
          />
          <Stack.Screen
            name="PregnancyStatus"
            getComponent={() =>
              require('../../screens/PregnancyStatus').default
            }
          />
          <Stack.Screen
            name="YourJourneyTransition"
            getComponent={() =>
              require('../../screens/YourJourneyTransition').default
            }
          />
          <Stack.Screen
            name="TrackingAnimation"
            getComponent={() =>
              require('../../screens/TrackingAnimation').default
            }
          />
          <Stack.Screen
            name="RhythmAnimation"
            getComponent={() =>
              require('../../screens/RhythmAnimation').default
            }
          />
          <Stack.Screen
            name="YourStrengthTransition"
            getComponent={() =>
              require('../../screens/YourStrengthTransition').default
            }
          />
          <Stack.Screen
            name="AllSetTransition"
            getComponent={() =>
              require('../../screens/AllSetTransition').default
            }
          />
          <Stack.Screen
            name="AboutTodayTransition"
            getComponent={() =>
              require('../../screens/AboutTodayTransition').default
            }
          />
          <Stack.Screen
            name="Weight"
            getComponent={() => require('../../screens/Weight').default}
          />
          <Stack.Screen
            name="Height"
            getComponent={() => require('../../screens/Height').default}
          />
          <Stack.Screen
            name="PeriodDuration"
            getComponent={() => require('../../screens/PeriodDuration').default}
          />
          <Stack.Screen
            name="CyclePattern"
            getComponent={() => require('../../screens/CyclePattern').default}
          />
          <Stack.Screen
            name="QuickTracking"
            getComponent={() => require('../../screens/QuickTracking').default}
          />
          <Stack.Screen
            name="SleepTracker"
            getComponent={() => require('../../screens/SleepTracker').default}
          />
          <Stack.Screen
            name="FounderStory"
            getComponent={() => require('../../screens/FounderStory').default}
          />
          <Stack.Screen
            name="HormoneResetGuide"
            getComponent={() =>
              require('../../screens/HormoneResetGuide').default
            }
          />
          <Stack.Screen
            name="UserProfile"
            getComponent={() => require('../../screens/Profile').default}
          />
          <Stack.Screen
            name="ChallengeHub"
            getComponent={() => require('../../screens/ChallengeHub').default}
          />
          <Stack.Screen
            name="DetoxChallenge"
            getComponent={() => require('../../screens/DetoxChallenge').default}
          />
          </Stack.Navigator>
        </JournalProvider>
        </PartnerModeProvider>
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}
