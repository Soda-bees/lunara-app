import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/colors';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';

type Props = NativeStackScreenProps<RootStackParamList, 'Lifestyle'>;

export const LifestyleScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [mealFrequency, setMealFrequency] = useState<string | null>(
    data.mealFrequency === 'intermittent_fasting'
      ? null
      : data.mealFrequency || null,
  );
  const [cookingSkill, setCookingSkill] = useState<string | null>(
    data.cookingSkill || null,
  );
  const [mealPrepPreference, setMealPrepPreference] = useState<string | null>(
    data.mealPrepPreference || null,
  );
  const [budgetRange, setBudgetRange] = useState<string | null>(
    data.budgetRange || null,
  );

  const mealFrequencies = [
    {
      value: '3_meals',
      label: '3 Meals',
      description: 'Breakfast, Lunch, Dinner',
    },
    { value: '4_meals', label: '4 Meals', description: '3 meals + 1 snack' },
    { value: '5_meals', label: '5 Meals', description: '3 meals + 2 snacks' },
  ];

  const cookingSkills = [
    { value: 'beginner', label: 'Beginner', emoji: '🌱' },
    { value: 'intermediate', label: 'Intermediate', emoji: '👩‍🍳' },
    { value: 'advanced', label: 'Advanced', emoji: '🌟' },
  ];

  const mealPrepOptions = [
    { value: 'daily', label: 'Daily', description: 'Cook fresh each day' },
    { value: 'weekly', label: 'Weekly', description: 'Meal prep on weekends' },
    { value: 'no_prep', label: 'No Prep', description: 'Quick & easy recipes' },
  ];

  const budgetOptions = [
    { value: 'low', label: 'Budget-Friendly', emoji: '💰' },
    { value: 'medium', label: 'Moderate', emoji: '💵' },
    { value: 'high', label: 'Premium', emoji: '💎' },
  ];

  const canProceed =
    mealFrequency && cookingSkill && mealPrepPreference && budgetRange;

  return (
    <ScreenContainer>
      <OnboardingHeader
        title="Lifestyle Preferences"
        subtitle="Tell us about your daily routine"
        currentStep={6}
        totalSteps={8}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>How many meals per day?</Text>
            {mealFrequencies.map(freq => {
              const selected = mealFrequency === freq.value;
              return (
                <TouchableOpacity
                  key={freq.value}
                  style={[
                    styles.optionCard,
                    selected && styles.optionCardSelected,
                  ]}
                  onPress={() => setMealFrequency(freq.value)}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {freq.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {freq.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cooking Skill Level</Text>
            <View style={styles.skillsGrid}>
              {cookingSkills.map(skill => {
                const selected = cookingSkill === skill.value;
                return (
                  <TouchableOpacity
                    key={skill.value}
                    style={[
                      styles.skillCard,
                      selected && styles.optionCardSelected,
                    ]}
                    onPress={() => setCookingSkill(skill.value)}
                  >
                    <Text style={styles.skillEmoji}>{skill.emoji}</Text>
                    <Text
                      style={[
                        styles.skillLabel,
                        selected && styles.skillLabelSelected,
                      ]}
                    >
                      {skill.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Meal Prep Preference</Text>
            {mealPrepOptions.map(option => {
              const selected = mealPrepPreference === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionCard,
                    selected && styles.optionCardSelected,
                  ]}
                  onPress={() => setMealPrepPreference(option.value)}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      selected && styles.optionTitleSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      selected && styles.optionDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Budget Range</Text>
            <View style={styles.budgetGrid}>
              {budgetOptions.map(option => {
                const selected = budgetRange === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.budgetCard,
                      selected && styles.optionCardSelected,
                    ]}
                    onPress={() => setBudgetRange(option.value)}
                  >
                    <Text style={styles.budgetEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.budgetLabel,
                        selected && styles.budgetLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <EmpatheticButton
          title="Continue"
          onPress={() => {
            updateData(
              {
                mealFrequency: mealFrequency || undefined,
                cookingSkill: cookingSkill || undefined,
                mealPrepPreference: mealPrepPreference || undefined,
                budgetRange: budgetRange || undefined,
              },
              'HealthStory',
            );
            navigation.navigate('HealthStory');
          }}
          disabled={!canProceed}
        />
        <Text style={styles.bottomText}>
          Almost there! You're doing great! ✨
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    //  gap: spacing.md
  },
  card: {
    gap: spacing.md,
    marginBottom: sizes.screenHeight * 0.055,
  },

  section: {
    // gap: spacing.sm,
  },

  label: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },

  optionCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },

  optionCardSelected: {
    borderColor: colors.heading + '80',
    backgroundColor: colors.headingLight,
  },

  optionTitle: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  optionTitleSelected: {
    color: colors.heading,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  optionDescription: {
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  optionDescriptionSelected: {
    color: colors.heading,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  skillsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  skillCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  // skillCardSelected: {
  //   borderColor: colors.heading + '80',
  //   backgroundColor: colors.headingLight,
  // },
  skillEmoji: { fontSize: 20 },

  skillLabel: {
    marginTop: 4,
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  skillLabelSelected: {
    color: colors.heading,
    // fontWeight: '700',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  budgetGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  budgetCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  // budgetCardSelected: {
  //   borderColor: colors.heading + '80',
  //   backgroundColor: colors.headingLight,
  // },

  budgetEmoji: { fontSize: 20 },

  budgetLabel: {
    marginTop: 4,
    color: colors.black,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  budgetLabelSelected: {
    color: colors.heading,
    // fontWeight: '700',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
});
