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
import { colors, radius, spacing } from '../../constants/colors';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import type { MeasurementSystem } from '../../utils/measurement';
import {
  bodyWeightKgFromInput,
  cmToInches,
  DEFAULT_MEASUREMENT_SYSTEM,
  heightCmFromInchesInput,
  heightCmFromMetricInput,
  kgToLb,
  round1,
} from '../../utils/measurement';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BasicInfo' | 'YoureDoingGreat'
>;

function initialMeasurementSystem(d: {
  measurementSystem?: MeasurementSystem;
}): MeasurementSystem {
  return d.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;
}

export const BasicInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [measurementSystem, setMeasurementSystem] =
    useState<MeasurementSystem>(() => initialMeasurementSystem(data));

  const [age, setAge] = useState(data.age || '');

  const [heightCmText, setHeightCmText] = useState(() => {
    if (data.heightCm != null) {
      return String(Math.round(data.heightCm));
    }
    return data.height ?? '';
  });
  const [weightKgText, setWeightKgText] = useState(() => {
    if (data.weightKg != null) {
      return String(round1(data.weightKg));
    }
    return data.weight ?? '';
  });

  const [heightInchesText, setHeightInchesText] = useState(() => {
    if (data.measurementSystem === 'imperial' && data.heightCm != null) {
      return String(round1(cmToInches(data.heightCm)));
    }
    return '';
  });
  const [weightLbText, setWeightLbText] = useState(() => {
    if (data.measurementSystem === 'imperial' && data.weightKg != null) {
      return String(round1(kgToLb(data.weightKg)));
    }
    return '';
  });

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

  const toggleMeasurementSystem = () => {
    if (measurementSystem === 'metric') {
      const cm = heightCmFromMetricInput(heightCmText);
      const kg = bodyWeightKgFromInput(weightKgText, 'metric');
      if (cm != null) {
        setHeightInchesText(String(round1(cmToInches(cm))));
      }
      if (kg != null) {
        setWeightLbText(String(round1(kgToLb(kg))));
      }
      setMeasurementSystem('imperial');
    } else {
      const cm = heightCmFromInchesInput(heightInchesText);
      const kg = bodyWeightKgFromInput(weightLbText, 'imperial');
      if (cm != null) {
        setHeightCmText(String(Math.round(cm)));
      }
      if (kg != null) {
        setWeightKgText(String(round1(kg)));
      }
      setMeasurementSystem('metric');
    }
  };

  const heightWeightValid =
    measurementSystem === 'metric'
      ? heightCmFromMetricInput(heightCmText) != null &&
        bodyWeightKgFromInput(weightKgText, 'metric') != null
      : heightCmFromInchesInput(heightInchesText) != null &&
        bodyWeightKgFromInput(weightLbText, 'imperial') != null;

  const canProceed = age && heightWeightValid && activityLevel;

  const handleContinue = () => {
    if (!canProceed) {
      return;
    }
    const heightCm =
      measurementSystem === 'metric'
        ? heightCmFromMetricInput(heightCmText)
        : heightCmFromInchesInput(heightInchesText);
    const weightKg =
      measurementSystem === 'metric'
        ? bodyWeightKgFromInput(weightKgText, 'metric')
        : bodyWeightKgFromInput(weightLbText, 'imperial');
    if (heightCm == null || weightKg == null) {
      return;
    }
    updateData(
      {
        age,
        heightCm,
        weightKg,
        measurementSystem,
        activityLevel: activityLevel || undefined,
      },
      'YoureDoingGreat',
    );
    navigation.navigate('YoureDoingGreat');
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

          <View style={styles.unitRow}>
            <Text style={styles.label}>Units</Text>
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitPill,
                  measurementSystem === 'metric' && styles.unitPillActive,
                ]}
                onPress={() => {
                  if (measurementSystem !== 'metric') {
                    toggleMeasurementSystem();
                  }
                }}
              >
                <Text
                  style={[
                    styles.unitPillText,
                    measurementSystem === 'metric' && styles.unitPillTextActive,
                  ]}
                >
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitPill,
                  measurementSystem === 'imperial' && styles.unitPillActive,
                ]}
                onPress={() => {
                  if (measurementSystem !== 'imperial') {
                    toggleMeasurementSystem();
                  }
                }}
              >
                <Text
                  style={[
                    styles.unitPillText,
                    measurementSystem === 'imperial' &&
                      styles.unitPillTextActive,
                  ]}
                >
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {measurementSystem === 'metric' ? (
            <>
              <View>
                <Text style={styles.label}>What&apos;s your height? (cm)</Text>
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="cm"
                  placeholderTextColor={colors.placeholder}
                  value={heightCmText}
                  onChangeText={setHeightCmText}
                />
              </View>
              <View>
                <Text style={styles.label}>
                  What&apos;s your current weight? (kg)
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="kg"
                  placeholderTextColor={colors.placeholder}
                  value={weightKgText}
                  onChangeText={setWeightKgText}
                />
                <Text style={styles.subtitleStyle}>
                  Don&apos;t worry, this is just for calculations. You&apos;re
                  beautiful at any size
                </Text>
              </View>
            </>
          ) : (
            <>
              <View>
                <Text style={styles.label}>
                  What&apos;s your height? (inches)
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="Total inches"
                  placeholderTextColor={colors.placeholder}
                  value={heightInchesText}
                  onChangeText={setHeightInchesText}
                />
                <Text style={styles.subtitleStyle}>
                  Enter total inches only — for example, 65 in is about 5 ft 5 in.
                </Text>
              </View>
              <View>
                <Text style={styles.label}>
                  What&apos;s your current weight? (lb)
                </Text>
                <TextInput
                  keyboardType="decimal-pad"
                  style={styles.input}
                  placeholder="lb"
                  placeholderTextColor={colors.placeholder}
                  value={weightLbText}
                  onChangeText={setWeightLbText}
                />
                <Text style={styles.subtitleStyle}>
                  Don&apos;t worry, this is just for calculations. You&apos;re
                  beautiful at any size
                </Text>
              </View>
            </>
          )}

          <View>
            <Text style={styles.label}>How active are you?</Text>
            <Text style={styles.subtitleStyle}>
              Be honest - we&apos;re here to help, not judge!
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
        <Text style={styles.bottomText}>Every step forward counts!</Text>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },

  card: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },

  unitRow: {
    gap: spacing.sm,
  },

  unitToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  unitPill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  unitPillActive: {
    borderColor: colors.heading + '80',
    backgroundColor: colors.headingLight,
  },

  unitPillText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textMuted,
  },

  unitPillTextActive: {
    color: colors.heading,
  },

  label: {
    color: colors.black,
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
    borderColor: colors.heading + '80',
    backgroundColor: colors.headingLight,
  },

  optionTitle: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  optionTitleSelected: {
    color: colors.heading,
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
