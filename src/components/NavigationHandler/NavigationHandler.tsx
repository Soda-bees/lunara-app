import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStep, useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const NavigationHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data, currentStep, isDataLoaded } = useOnboarding();
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (!isDataLoaded || hasNavigated.current) return;

    // Determine which screen to navigate to based on saved data
    const determineNextScreen = (): OnboardingStep | 'Welcome' => {
      // If no data at all, start from Welcome
      if (!data.fullName && !data.email) {
        return 'Welcome';
      }

      // If we have a saved step, use it (but verify it makes sense)
      if (currentStep) {
        // Verify the step is valid based on data
        if (currentStep === 'AccountSetup' && data.fullName && data.email) {
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
      if (!data.dietaryRestrictions && !data.cuisinePreferences && !data.otherAllergies) {
        return 'DietaryPreferences';
      }
      // Lifestyle
      if (!data.mealFrequency) return 'Lifestyle';
      // MedicalInfo
      if (data.medicalConditions === undefined && !data.medications) return 'MedicalInfo';
      return 'OnboardingComplete';
    };

    const nextScreen = determineNextScreen();

    if (nextScreen !== 'Welcome') {
      hasNavigated.current = true;
      // Small delay to ensure navigation is ready
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: nextScreen as keyof RootStackParamList }],
        });
      }, 100);
    }
  }, [isDataLoaded, data, currentStep, navigation]);

  return null;
};

