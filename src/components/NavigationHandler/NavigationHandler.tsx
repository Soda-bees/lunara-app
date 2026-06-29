import { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStep, useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { clearToken } from '../../services/api';
import type { SessionRoute } from '../../utils/resolveSessionRoute';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type NavigationHandlerProps = {
  /** Resolved during splash — avoids a second auth gate screen. */
  initialSessionRoute: SessionRoute;
};

export const NavigationHandler: React.FC<NavigationHandlerProps> = ({
  initialSessionRoute,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const { data, currentStep, isDataLoaded, resetData: resetOnboarding } =
    useOnboarding();
  const hasNavigated = useRef(false);
  const isSessionResetting = useRef(false);

  const [authCheckStatus, setAuthCheckStatus] = useState<
    'authed' | 'unauth'
  >(() =>
    initialSessionRoute === 'TabNavigator' ||
    initialSessionRoute === 'PartnerStackNavigator'
      ? 'authed'
      : 'unauth',
  );

  useEffect(() => {
    if (
      initialSessionRoute === 'TabNavigator' ||
      initialSessionRoute === 'PartnerStackNavigator'
    ) {
      hasNavigated.current = true;
    }
  }, [initialSessionRoute]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('session_expired', async () => {
      if (isSessionResetting.current) return;
      isSessionResetting.current = true;

      try {
        await clearToken();
        await resetOnboarding();
      } catch {
        // Ignore best-effort failures; navigation reset still matters.
      } finally {
        hasNavigated.current = true;
        setAuthCheckStatus('unauth');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
        isSessionResetting.current = false;
      }
    });

    return () => {
      sub.remove();
    };
  }, [navigation, resetOnboarding]);

  useEffect(() => {
    if (authCheckStatus !== 'unauth') return;
    if (!isDataLoaded) return;
    if (hasNavigated.current) return;

    const determineNextScreen = (): OnboardingStep | 'Welcome' => {
      if (!data.fullName && !data.email) {
        return 'Welcome';
      }

      if (currentStep) {
        if (
          currentStep === 'AccountSetup' &&
          data.fullName &&
          data.email
        ) {
          return 'BasicInfo';
        }
        return currentStep;
      }

      if (!data.age) return 'BasicInfo';
      if (!data.primaryGoal) return 'Goals';

      const hasWomenHealthData =
        data.isTrackingCycle !== undefined ||
        data.isPregnant !== undefined ||
        data.isBreastfeeding !== undefined;
      if (!hasWomenHealthData) return 'WomenHealth';

      if (
        !data.dietaryRestrictions &&
        !data.cuisinePreferences &&
        !data.otherAllergies
      ) {
        return 'DietaryPreferences';
      }

      if (!data.mealFrequency) return 'Lifestyle';

      if (data.medicalConditions === undefined && !data.medications) {
        return 'MedicalInfo';
      }

      return 'OnboardingComplete';
    };

    const nextScreen = determineNextScreen();
    hasNavigated.current = true;
    navigation.reset({
      index: 0,
      routes: [{ name: nextScreen as keyof RootStackParamList }],
    });
  }, [authCheckStatus, isDataLoaded, data, currentStep, navigation]);

  return null;
};
