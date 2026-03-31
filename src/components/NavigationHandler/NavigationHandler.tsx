import { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStep, useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { clearToken, getMe, getStoredToken } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const NavigationHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data, currentStep, isDataLoaded, resetData } = useOnboarding();
  const hasNavigated = useRef(false);
  const isSessionResetting = useRef(false);

  const [authCheckStatus, setAuthCheckStatus] = useState<
    'checking' | 'authed' | 'unauth' | 'done'
  >('checking');

  // Listen for auth expiration events coming from background API calls.
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('session_expired', async () => {
      if (isSessionResetting.current) return;
      isSessionResetting.current = true;

      try {
        // Best-effort: token may already be cleared in apiCall.
        await clearToken();
        await resetData();
      } catch {
        // Ignore best-effort failures; navigation reset still matters.
      } finally {
        hasNavigated.current = true;
        // Reset to logged-out start (same as logout).
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
  }, [navigation, resetData]);

  useEffect(() => {
    let cancelled = false;
    const authGuardRef = { current: false };

    const checkAuthAndSetStatus = async () => {
      if (authGuardRef.current) return;
      authGuardRef.current = true;

      try {
        const token = await getStoredToken();
        if (cancelled) return;

        if (!token) {
          setAuthCheckStatus('unauth');
          return;
        }

        // Validate token before entering TabNavigator.
        try {
          await getMe();
          if (cancelled) return;
          hasNavigated.current = true;
          setAuthCheckStatus('authed');
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigator' }],
          });
        } catch (error: any) {
          const status = error?.status;
          const code = error?.code;
          const message: string | undefined = error?.message;

          const isUnauthorized =
            status === 401 ||
            code === 'UNAUTHORIZED' ||
            message?.includes('Session expired');

          if (isUnauthorized) {
            isSessionResetting.current = true;
            try {
              await clearToken();
              await resetData();
            } finally {
              if (cancelled) return;
              hasNavigated.current = true;
              setAuthCheckStatus('unauth');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
              isSessionResetting.current = false;
            }
          } else {
            // Network/backend issue: fall back to authenticated flow.
            if (cancelled) return;
            hasNavigated.current = true;
            setAuthCheckStatus('authed');
            navigation.reset({
              index: 0,
              routes: [{ name: 'TabNavigator' }],
            });
          }
        }
      } catch {
        // If token lookup fails unexpectedly, keep the app functional.
        if (cancelled) return;
        setAuthCheckStatus('unauth');
      }
    };

    checkAuthAndSetStatus();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, resetData]);

  useEffect(() => {
    if (authCheckStatus !== 'unauth') return;
    if (!isDataLoaded) return;
    if (hasNavigated.current) return;

    const determineNextScreen = (): OnboardingStep | 'Welcome' => {
      // If no data at all, start from Welcome
      if (!data.fullName && !data.email) {
        return 'Welcome';
      }

      // If we have a saved step, use it (but verify it makes sense)
      if (currentStep) {
        // Verify the step is valid based on data
        if (
          currentStep === 'AccountSetup' &&
          data.fullName &&
          data.email
        ) {
          return 'BasicInfo'; // Already completed account setup
        }
        return currentStep;
      }

      // Otherwise, determine from data progression
      if (!data.age) return 'BasicInfo';
      if (!data.primaryGoal) return 'Goals';

      // WomenHealth - check if we've completed it (any of the fields set)
      const hasWomenHealthData =
        data.isTrackingCycle !== undefined ||
        data.isPregnant !== undefined ||
        data.isBreastfeeding !== undefined;
      if (!hasWomenHealthData) return 'WomenHealth';

      // DietaryPreferences
      if (
        !data.dietaryRestrictions &&
        !data.cuisinePreferences &&
        !data.otherAllergies
      ) {
        return 'DietaryPreferences';
      }

      // Lifestyle
      if (!data.mealFrequency) return 'Lifestyle';

      // MedicalInfo
      if (data.medicalConditions === undefined && !data.medications) {
        return 'MedicalInfo';
      }

      return 'OnboardingComplete';
    };

    const nextScreen = determineNextScreen();
    if (nextScreen === 'Welcome') return;

    hasNavigated.current = true;
    navigation.reset({
      index: 0,
      routes: [{ name: nextScreen as keyof RootStackParamList }],
    });
  }, [authCheckStatus, isDataLoaded, data, currentStep, navigation]);

  return null;
};
