import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { colors, radius, spacing } from '../../constants/theme/theme';
import {
  signup,
  storeToken,
  googleAuth,
  createPeriod,
  type SignupRequest,
} from '../../services/api';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import LottieView from 'lottie-react-native';
import GradientText from '../../components/GradientText';
import { DEFAULT_MEASUREMENT_SYSTEM } from '../../utils/measurement';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingComplete'>;

export const OnboardingCompleteScreen: React.FC<Props> = ({ navigation }) => {
  const { data, resetData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<LottieView>(null);

  const handleGetStarted = async () => {
    if (!data.fullName || !data.email) {
      Alert.alert(
        'Error',
        'Missing required account information. Please start over.',
      );
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      return;
    }

    // Check if this is a Google user (no password but has Google ID token)
    const isGoogleUser = !data.password && data.googleIdToken;

    if (!isGoogleUser && !data.password) {
      Alert.alert(
        'Error',
        'Missing required account information. Please start over.',
      );
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare onboarding data
      const onboardingData = {
        age: data.age,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        targetWeightKg: data.targetWeightKg,
        measurementSystem:
          data.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM,
        activityLevel: data.activityLevel,
        primaryGoal: data.primaryGoal,
        isTrackingCycle: data.isTrackingCycle,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength,
        lastPeriodStartDate: data.lastPeriodStartDate,
        lastPeriodEndDate: data.lastPeriodEndDate,
        isPregnant: data.isPregnant,
        trimester: data.trimester,
        isBreastfeeding: data.isBreastfeeding,
        dueDate: data.dueDate,
        lastMenstrualPeriod: data.lastMenstrualPeriod,
        pregnancyStartDate: data.isPregnant
          ? new Date().toISOString()
          : undefined,
        dietaryRestrictions: data.dietaryRestrictions,
        otherAllergies: data.otherAllergies,
        cuisinePreferences: data.cuisinePreferences,
        dislikedFoods: data.dislikedFoods,
        favoriteFoods: data.favoriteFoods,
        mealFrequency: data.mealFrequency,
        cookingSkill: data.cookingSkill,
        mealPrepPreference: data.mealPrepPreference,
        budgetRange: data.budgetRange,
        medicalConditions: data.medicalConditions,
        medications: data.medications,
      };

      let response;

      if (isGoogleUser && data.googleIdToken) {
        // Google user - call Google auth with onboarding data
        response = await googleAuth({
          idToken: data.googleIdToken,
          email: data.email,
          name: data.fullName,
          ...onboardingData,
        });
      } else {
        // Regular signup - password is guaranteed to exist due to check above
        if (!data.password) {
          throw new Error('Password is required for signup');
        }
        const signupData: SignupRequest = {
          fullName: data.fullName!,
          email: data.email!,
          password: data.password,
          ...onboardingData,
        };
        response = await signup(signupData);
      }

      if (response.success && response.token) {
        // Store auth token
        await storeToken(response.token);

        // Create first period if cycle tracking is enabled and we have start/end dates
        if (
          data.isTrackingCycle &&
          data.lastPeriodStartDate &&
          data.lastPeriodEndDate
        ) {
          try {
            await createPeriod({
              startDate: data.lastPeriodStartDate,
              endDate: data.lastPeriodEndDate,
              flow: data.lastPeriodFlow || 'medium',
              symptoms: data.lastPeriodSymptoms || [],
              notes: data.lastPeriodNotes || '',
            });
          } catch (periodError: any) {
            // Log error but don't block signup completion
            console.error('Error creating first period:', periodError);
          }
        }

        // Clear onboarding data
        resetData();

        // Navigate to TabNavigator
        navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
      } else {
        Alert.alert(
          'Signup Failed',
          response.message || 'Unable to create account. Please try again.',
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message ||
          'Something went wrong. Please check your connection and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer color="#FFE4E8">
      <View style={styles.container}>
        <View style={styles.mainView}>
          {/* <Image
            source={images.celebrationIcon}
            style={styles.prettyLadyStyle}
          /> */}
          <View style={styles.prettyLadyView}>
            <LottieView
              source={require('../../assets/animations/Almostthere.json')}
              autoPlay
              loop={true}
              style={StyleSheet.absoluteFill}
              ref={ref}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
            }}
          >
            <GradientText
              fontFamily="PlayfairDisplay-SemiBold"
              style={styles.title}
            >
              You're All Set!
            </GradientText>
          </View>

          <Text style={styles.body}>
            We've created a personalized plan just for you
          </Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              🍽️ Personalized nutrition plans{'\n'}
              {'\n'}💪️ Customized workout routines{'\n'}
              {'\n'}🌸️ Cycle-aware recommendations{'\n'}
              {'\n'}📊 Progress tracking & insights
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardDescription}>
              Your wellness journey starts now! We're here to support you every
              step of the way. Remember, small consistent steps lead to big
              transformations. You've got this! 💪✨
            </Text>
          </View>
        </View>
        <View>
          <EmpatheticButton
            title={isLoading ? 'Creating your account...' : 'Start My Journey'}
            onPress={handleGetStarted}
            disabled={isLoading}
          />
          <Text style={styles.bottomText}>Let's make today amazing! 🌟</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },

  mainView: {
    alignSelf: 'center',
  },

  title: {
    fontSize: 34,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },

  body: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },

  prettyLadyStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.25,
    height: sizes.screenWidth * 0.25,
    alignSelf: 'center',
  },

  card: {
    backgroundColor: '#FFF7F5',
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginTop: 20,
    width: sizes.screenWidth * 0.85,
    alignSelf: 'center',
  },

  cardTitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginVertical: 10,
  },

  cardDescription: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 5,
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },

  prettyLadyView: {
    width: sizes.screenWidth * 0.53,
    height: sizes.screenWidth * 0.53,
    alignSelf: 'center',
    // marginTop: sizes.screenHeight * 0.13,
    // backgroundColor: 'red',
  },
});
