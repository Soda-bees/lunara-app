import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_STORAGE_KEY = '@lunara_onboarding_data';
const ONBOARDING_STEP_KEY = '@lunara_onboarding_step';

export interface OnboardingData {
  // Account setup
  fullName?: string;
  email?: string;
  password?: string;

  // Basic info
  age?: string;
  height?: string;
  weight?: string;
  activityLevel?: string;

  // Goals
  primaryGoal?: string;
  targetWeight?: string;

  // Women's health
  isTrackingCycle?: boolean;
  cycleLength?: string;
  periodLength?: string;
  lastPeriodStartDate?: string; // ISO date string
  lastPeriodEndDate?: string; // ISO date string
  isPregnant?: boolean;
  trimester?: 1 | 2 | 3 | null;
  isBreastfeeding?: boolean;

  // Dietary preferences
  dietaryRestrictions?: {
    vegetarian: boolean;
    vegan: boolean;
    pescatarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    nutAllergy: boolean;
  };
  otherAllergies?: string;
  cuisinePreferences?: string[];
  dislikedFoods?: string;
  favoriteFoods?: string;

  // Lifestyle
  mealFrequency?: string;
  cookingSkill?: string;
  mealPrepPreference?: string;
  budgetRange?: string;

  // Medical info
  medicalConditions?: string[];
  medications?: string;
}

export type OnboardingStep =
  | 'AccountSetup'
  | 'BasicInfo'
  | 'Goals'
  | 'WomenHealth'
  | 'DietaryPreferences'
  | 'Lifestyle'
  | 'MedicalInfo'
  | 'OnboardingComplete'
  | 'LetsGetStarted'
  | 'YoureDoingGreat'
  | 'UniqueJourney'
  | 'FuelAndJoy'
  | 'DailyLifeMatters'
  | 'HealthStory'
  | 'AlmostThere';

interface OnboardingContextType {
  data: OnboardingData;
  currentStep: OnboardingStep | null;
  updateData: (updates: Partial<OnboardingData>, step?: OnboardingStep) => void;
  resetData: () => void;
  loadPersistedData: () => Promise<void>;
  isDataLoaded: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persist data whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      persistData();
    }
  }, [data, currentStep, isDataLoaded]);

  const persistData = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
      if (currentStep) {
        await AsyncStorage.setItem(ONBOARDING_STEP_KEY, currentStep);
      }
    } catch (error) {
      console.error('Error persisting onboarding data:', error);
    }
  };

  const loadPersistedData = async () => {
    try {
      const [savedData, savedStep] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_STORAGE_KEY),
        AsyncStorage.getItem(ONBOARDING_STEP_KEY),
      ]);

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      }

      if (savedStep) {
        setCurrentStep(savedStep as OnboardingStep);
      }

      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading persisted onboarding data:', error);
      setIsDataLoaded(true);
    }
  };

  const updateData = (
    updates: Partial<OnboardingData>,
    step?: OnboardingStep,
  ) => {
    setData(prev => {
      const newData = { ...prev, ...updates };
      return newData;
    });
    if (step) {
      setCurrentStep(step);
    }
  };

  const resetData = async () => {
    setData({});
    setCurrentStep(null);
    try {
      await AsyncStorage.multiRemove([
        ONBOARDING_STORAGE_KEY,
        ONBOARDING_STEP_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        currentStep,
        updateData,
        resetData,
        loadPersistedData,
        isDataLoaded,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
