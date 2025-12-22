import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';

type Props = NativeStackScreenProps<RootStackParamList, 'Goals'>;

export const GoalsScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(
    data.primaryGoal || null,
  );
  const [targetWeight, setTargetWeight] = useState(data.targetWeight || '');
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const goals = [
    {
      value: 'weight_loss',
      label: 'Lose Weight',
      emoji: '🎯',
      description: 'Create a sustainable calorie deficit',
    },
    {
      value: 'weight_gain',
      label: 'Gain Weight',
      emoji: '💪',
      description: 'Build healthy mass gradually',
    },
    {
      value: 'maintenance',
      label: 'Maintain Weight',
      emoji: '⚖️',
      description: 'Keep your current healthy weight',
    },
    {
      value: 'muscle_gain',
      label: 'Build Muscle',
      emoji: '🏋️',
      description: 'Gain strength and definition',
    },
    {
      value: 'health',
      label: 'Overall Health',
      emoji: '🌱',
      description: 'Focus on wellness and vitality',
    },
  ];

  const canProceed = primaryGoal !== null;

  const handleContinue = () => {
    if (canProceed) {
      updateData(
        {
          primaryGoal: primaryGoal || undefined,
          targetWeight: targetWeight || undefined,
        },
        'UniqueJourney',
      );
      // navigation.navigate('WomenHealth');
      navigation.navigate('UniqueJourney');
    }
  };

  return (
    <ScreenContainer>
      <OnboardingHeader
        title="What's your goal?"
        subtitle="We'll create a plan tailored to help you achieve it"
        currentStep={3}
        totalSteps={8}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={46}
      >
        <View style={styles.card}>
          <Text style={styles.encouragement}>
            Remember: Your journey is unique, and every small step matters! 💫
          </Text>

          {goals.map(goal => {
            const selected = primaryGoal === goal.value;
            return (
              <TouchableOpacity
                key={goal.value}
                style={[styles.goalCard, selected && styles.goalCardSelected]}
                onPress={() => setPrimaryGoal(goal.value)}
              >
                <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{goal.label}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {(primaryGoal === 'weight_loss' || primaryGoal === 'weight_gain') && (
            <View style={styles.section}>
              <Text style={styles.label}>
                What's your target weight? (optional)
              </Text>
              <TextInput
                keyboardType="number-pad"
                style={styles.input}
                placeholder="kg"
                placeholderTextColor={colors.placeholder}
                value={targetWeight}
                onChangeText={setTargetWeight}
                onFocus={() => {
                  requestAnimationFrame(() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd(true);
                    }, 150);
                  });
                }}
              />
              <Text style={styles.helper}>
                Setting a goal helps us track your progress. You can change this
                anytime!
              </Text>
            </View>
          )}
        </View>

        <EmpatheticButton
          title="Continue"
          onPress={handleContinue}
          disabled={!canProceed}
        />
        <Text style={styles.bottomText}>
          You're doing amazing! Keep going! 🌸
        </Text>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },

  card: {
    gap: spacing.sm,
    marginBottom: sizes.screenHeight * 0.055,
  },

  encouragement: {
    color: colors.textMuted,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
    borderRadius: radius.sm,
    textAlign: 'center',
    padding: spacing.sm,
  },

  goalCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },

  goalCardSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  goalEmoji: { fontSize: 24 },
  goalTitle: {
    color: colors.text,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },

  goalDescription: {
    color: colors.textMuted,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  section: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  label: {
    // fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: '#F8FAFC',
    color: '#000000',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  helper: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
});
