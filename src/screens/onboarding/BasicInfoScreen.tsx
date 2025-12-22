import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BasicInfo' | 'YoureDoingGreat'
>;

export const BasicInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [age, setAge] = useState(data.age || '');
  const [height, setHeight] = useState(data.height || '');
  const [weight, setWeight] = useState(data.weight || '');
  const [activityLevel, setActivityLevel] = useState<string | null>(
    data.activityLevel || null,
  );

  const activityLevels = [
    {
      value: 'sedentary',
      label: 'Sedentary',
      description: 'Little to no exercise',
    },
    {
      value: 'light',
      label: 'Lightly Active',
      description: 'Light exercise 1-3 days/week',
    },
    {
      value: 'moderate',
      label: 'Moderately Active',
      description: 'Moderate exercise 3-5 days/week',
    },
    {
      value: 'active',
      label: 'Very Active',
      description: 'Hard exercise 6-7 days/week',
    },
  ];

  const canProceed = age && height && weight && activityLevel;

  const handleContinue = () => {
    if (canProceed) {
      updateData(
        { age, height, weight, activityLevel: activityLevel || undefined },
        'YoureDoingGreat',
      );
      // navigation.navigate('Goals');
      navigation.navigate('YoureDoingGreat');
    }
  };

  return (
    <ScreenContainer>
      <OnboardingHeader
        title="Tell us about yourself"
        subtitle="This helps us personalize your experience"
        currentStep={2}
        totalSteps={8}
      />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <View style={styles.card}>
          <View style={{ gap: 3 }}>
            <Text style={styles.label}>How old are you?</Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.input}
              placeholder="Enter your age"
              placeholderTextColor={colors.placeholder}
              value={age}
              onChangeText={setAge}
            />
            <Text style={styles.subtitleStyle}>
              Your age helps us calculate your nutritional needs accurately
            </Text>
          </View>
          <View>
            <Text style={styles.label}>What's your height? (cm)</Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.input}
              placeholder="cm"
              placeholderTextColor={colors.placeholder}
              value={height}
              onChangeText={setHeight}
            />
          </View>
          <View>
            <Text style={styles.label}>What's your current weight? (kg)</Text>
            <TextInput
              keyboardType="number-pad"
              style={styles.input}
              placeholder="kg"
              placeholderTextColor={colors.placeholder}
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.subtitleStyle}>
              Don't worry, this is just for calculations. You're beautiful at
              any size! ✨
            </Text>
          </View>
          <View>
            <Text style={styles.label}>How active are you?</Text>
            <Text style={styles.subtitleStyle}>
              Be honest - we're here to help, not judge!
            </Text>
          </View>
          <View style={styles.options}>
            {activityLevels.map(level => {
              const selected = activityLevel === level.value;
              return (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.optionCard,
                    selected && styles.optionCardSelected,
                  ]}
                  onPress={() => setActivityLevel(level.value)}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <EmpatheticButton
          title="Continue"
          onPress={handleContinue}
          disabled={!canProceed}
        />
        <Text style={styles.bottomText}>Every step forward counts! 🌟</Text>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    // gap: spacing.md,
  },

  card: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },

  label: {
    color: colors.text,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  options: {
    gap: spacing.sm,
  },

  optionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  optionTitle: {
    color: colors.text,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  optionTitleSelected: {
    color: colors.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  optionDescription: {
    color: colors.textMuted,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  subtitleStyle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
});
