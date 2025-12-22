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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'MedicalInfo' | 'OnboardingComplete'
>;

export const MedicalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [medicalConditions, setMedicalConditions] = useState<string[]>(
    data.medicalConditions || [],
  );
  const [medications, setMedications] = useState(data.medications || '');
  const [skipMedical, setSkipMedical] = useState(
    !data.medicalConditions && !data.medications ? true : false,
  );

  const commonConditions = [
    'PCOS',
    'Diabetes',
    'Thyroid Issues',
    'IBS',
    'Endometriosis',
    'Anemia',
    'High Blood Pressure',
    'Other',
  ];

  const toggleCondition = (condition: string) => {
    setMedicalConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition],
    );
  };

  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);

  const handleMedicationsFocus = () => {
    // Scroll to bottom smoothly when TextInput is focused
    requestAnimationFrame(() => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd(true);
      }, 150);
    });
  };

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={50}
      >
        <OnboardingHeader
          title="Medical Information"
          subtitle="Optional - helps us provide better recommendations"
          currentStep={7}
          totalSteps={8}
        />

        <View style={styles.card}>
          <View
          // style={styles.infoCard}
          >
            {/* <Text style={styles.infoEmoji}>🔒</Text> */}
            <Text style={styles.infoText}>
              🔒 Your medical information is completely private and secure. We
              use it only to personalize your nutrition and fitness plans.
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setSkipMedical(prev => !prev)}
              style={styles.skipRow}
            >
              <View
                style={[styles.checkbox, skipMedical && styles.checkboxChecked]}
              >
                {skipMedical && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.skipText}>
                Skip this step (you can add this later)
              </Text>
            </TouchableOpacity>
          </View>

          {!skipMedical && (
            <>
              <View style={styles.section}>
                <View>
                  <Text style={styles.label}>Medical Conditions (if any)</Text>
                  <Text style={styles.helper}>
                    Select any that apply to you
                  </Text>
                </View>
                <View style={styles.conditionsGrid}>
                  {commonConditions.map(condition => {
                    const selected = medicalConditions.includes(condition);
                    return (
                      <TouchableOpacity
                        key={condition}
                        style={[
                          styles.conditionCard,
                          selected && styles.conditionCardSelected,
                        ]}
                        onPress={() => toggleCondition(condition)}
                      >
                        <Text
                          style={[
                            styles.conditionText,
                            selected && styles.conditionTextSelected,
                          ]}
                        >
                          {condition}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Current Medications (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  placeholder="List any medications you're currently taking..."
                  placeholderTextColor={colors.placeholder}
                  value={medications}
                  onChangeText={setMedications}
                  onFocus={handleMedicationsFocus}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Text style={styles.helper}>
                  This helps us avoid any food interactions
                </Text>
              </View>
            </>
          )}
        </View>

        <EmpatheticButton
          title="Continue"
          onPress={() => {
            updateData(
              {
                medicalConditions: skipMedical
                  ? undefined
                  : medicalConditions.length > 0
                  ? medicalConditions
                  : undefined,
                medications: skipMedical ? undefined : medications || undefined,
              },
              'OnboardingComplete',
            );
            navigation.navigate('OnboardingComplete');
          }}
        />
        <Text style={styles.bottomText}>You're almost done! 🎉</Text>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    // gap: spacing.md
  },

  card: {
    gap: spacing.md,
    marginBottom: sizes.screenHeight * 0.055,
  },

  // infoCard: {
  // flexDirection: 'row',
  // gap: spacing.sm,

  // backgroundColor: '#EFF6FF',
  // borderRadius: radius.md,
  // padding: spacing.md,
  // },

  infoEmoji: {
    fontSize: 24,
  },

  infoText: {
    color: colors.text,
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  section: {
    gap: spacing.sm,
  },

  label: {
    color: colors.text,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },

  helper: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  skipRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxTick: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  skipText: {
    color: colors.text,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  conditionCard: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  conditionCardSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  conditionText: {
    color: colors.textMuted,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  conditionTextSelected: {
    color: colors.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    // backgroundColor: '#F8FAFC',
    color: '#000000',
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  textarea: {
    minHeight: 120,
  },

  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 5,
  },
});
