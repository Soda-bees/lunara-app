import React, { useRef, useState } from 'react';
import { View, Text, Alert, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { signup, storeToken } from '../../services/api';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';
import LottieView from 'lottie-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingComplete'>;

export const OnboardingCompleteScreen: React.FC<Props> = ({ navigation }) => {
  const ref = useRef<LottieView>(null);

  const { data, resetData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!data.fullName || !data.email || !data.password) {
      Alert.alert(
        'Error',
        'Missing required account information. Please start over.',
      );
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare signup payload
      const signupData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        age: data.age,
        height: data.height,
        weight: data.weight,
        activityLevel: data.activityLevel,
        primaryGoal: data.primaryGoal,
        targetWeight: data.targetWeight,
        isTrackingCycle: data.isTrackingCycle,
        cycleLength: data.cycleLength,
        periodLength: data.periodLength,
        isPregnant: data.isPregnant,
        trimester: data.trimester,
        isBreastfeeding: data.isBreastfeeding,
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

      const response = await signup(signupData);

      if (response.success && response.token) {
        // Store auth token
        await storeToken(response.token);

        // Clear onboarding data
        resetData();

        // Navigate to home
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
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
          <Text style={styles.title}>You're All Set!</Text>
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
    paddingVertical: spacing.xl,
  },

  mainView: {
    alignSelf: 'center',
    marginBottom: sizes.screenHeight * 0.05,
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
    width: sizes.screenWidth * 0.55,
    height: sizes.screenWidth * 0.55,
    alignSelf: 'center',
    // marginTop: sizes.screenHeight * 0.13,
    // backgroundColor:'red'
  },
});
