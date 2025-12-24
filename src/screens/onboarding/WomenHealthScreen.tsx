import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';
import PeriodStartModal from '../../components/PeriodStartModal';

type Props = NativeStackScreenProps<RootStackParamList, 'WomenHealth'>;

export const WomenHealthScreen: React.FC<Props> = ({ navigation }) => {
  const { updateData, data } = useOnboarding();
  const [isTrackingCycle, setIsTrackingCycle] = useState(
    data.isTrackingCycle || false,
  );
  const [cycleLength, setCycleLength] = useState(data.cycleLength || '');
  const [periodLength, setPeriodLength] = useState(data.periodLength || '');
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState<Date | null>(
    data.lastPeriodStartDate ? new Date(data.lastPeriodStartDate) : null,
  );
  const [lastPeriodEndDate, setLastPeriodEndDate] = useState<Date | null>(
    data.lastPeriodEndDate ? new Date(data.lastPeriodEndDate) : null,
  );
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [periodModalType, setPeriodModalType] = useState<'start' | 'end'>(
    'start',
  );
  const [isPregnant, setIsPregnant] = useState(data.isPregnant || false);
  const [trimester, setTrimester] = useState<1 | 2 | 3 | null>(
    data.trimester || null,
  );
  const [isBreastfeeding, setIsBreastfeeding] = useState(
    data.isBreastfeeding || false,
  );

  // Validation: Check if all cycle tracking fields are filled
  const isCycleTrackingValid = () => {
    if (!isTrackingCycle) return true; // Not required if tracking is disabled

    return (
      cycleLength !== '' &&
      periodLength !== '' &&
      lastPeriodStartDate !== null &&
      lastPeriodEndDate !== null &&
      lastPeriodEndDate >= lastPeriodStartDate // End date should be >= start date
    );
  };

  const handleContinue = () => {
    // Validate cycle tracking fields if enabled
    if (isTrackingCycle && !isCycleTrackingValid()) {
      // You could show an alert here, but for now we'll just prevent navigation
      return;
    }

    updateData(
      {
        isTrackingCycle,
        cycleLength: cycleLength || undefined,
        periodLength: periodLength || undefined,
        lastPeriodStartDate: lastPeriodStartDate?.toISOString() || undefined,
        lastPeriodEndDate: lastPeriodEndDate?.toISOString() || undefined,
        isPregnant,
        trimester: trimester || undefined,
        isBreastfeeding,
      },
      'FuelAndJoy',
    );
    // navigation.navigate('DietaryPreferences');
    navigation.navigate('FuelAndJoy');
  };

  const handlePeriodDateSelect = (date: Date) => {
    if (periodModalType === 'start') {
      setLastPeriodStartDate(date);
      // If end date is before the new start date, clear it
      if (lastPeriodEndDate && lastPeriodEndDate < date) {
        setLastPeriodEndDate(null);
      }
    } else {
      setLastPeriodEndDate(date);
    }
    setShowPeriodModal(false);
  };

  const openPeriodModal = (type: 'start' | 'end') => {
    setPeriodModalType(type);
    setShowPeriodModal(true);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScreenContainer>
      <OnboardingHeader
        title="Women's Health"
        subtitle="Help us understand your unique needs"
        currentStep={4}
        totalSteps={8}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.card}>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🌸</Text>
            <Text style={styles.infoText}>
              Your body's needs change throughout your cycle. Tracking helps us
              personalize your nutrition and workouts!
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Track menstrual cycle?</Text>
                <Text style={styles.helper}>
                  We'll adjust your plan based on your cycle phase
                </Text>
              </View>
              <Switch
                value={isTrackingCycle}
                onValueChange={setIsTrackingCycle}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={isTrackingCycle ? colors.lightPrimary : '#FFFFFF'}
              />
            </View>

            {isTrackingCycle && (
              <View style={styles.subSection}>
                <Text style={styles.subLabel}>Average cycle length</Text>
                <View style={styles.buttonRow}>
                  {[18, 20, 21, 22, 24, 26, 28, 30, 32, 35, 38, 40].map(
                    days => {
                      const selected = cycleLength === String(days);
                      return (
                        <TouchableOpacity
                          key={days}
                          style={[
                            styles.optionButton,
                            selected && styles.optionButtonSelected,
                          ]}
                          onPress={() => setCycleLength(String(days))}
                        >
                          <Text
                            style={[
                              styles.optionButtonText,
                              selected && styles.optionButtonTextSelected,
                            ]}
                          >
                            {days} days
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>

                <Text style={styles.subLabel}>Average period length</Text>
                <View style={styles.buttonRow}>
                  {[3, 4, 5, 6, 7].map(days => {
                    const selected = periodLength === String(days);
                    return (
                      <TouchableOpacity
                        key={days}
                        style={[
                          styles.optionButton,
                          selected && styles.optionButtonSelected,
                        ]}
                        onPress={() => setPeriodLength(String(days))}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            selected && styles.optionButtonTextSelected,
                          ]}
                        >
                          {days} days
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.subLabel}>Last period start date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    lastPeriodStartDate && styles.dateButtonSelected,
                  ]}
                  onPress={() => openPeriodModal('start')}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      lastPeriodStartDate && styles.dateButtonTextSelected,
                    ]}
                  >
                    {lastPeriodStartDate
                      ? formatDate(lastPeriodStartDate)
                      : 'Select start date'}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.subLabel}>Last period end date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateButton,
                    lastPeriodEndDate && styles.dateButtonSelected,
                    !lastPeriodStartDate && styles.dateButtonDisabled,
                  ]}
                  onPress={() => openPeriodModal('end')}
                  disabled={!lastPeriodStartDate}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      lastPeriodEndDate && styles.dateButtonTextSelected,
                      !lastPeriodStartDate && styles.dateButtonTextDisabled,
                    ]}
                  >
                    {lastPeriodEndDate
                      ? formatDate(lastPeriodEndDate)
                      : lastPeriodStartDate
                      ? 'Select end date'
                      : 'Select start date first'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Are you currently pregnant?</Text>
                <Text style={styles.helper}>
                  We'll adjust nutrition for you and baby
                </Text>
              </View>
              <Switch
                value={isPregnant}
                onValueChange={setIsPregnant}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={isTrackingCycle ? colors.lightPrimary : '#FFFFFF'}
              />
            </View>

            {isPregnant && (
              <View style={styles.subSection}>
                <Text style={styles.subLabel}>Which trimester?</Text>
                <View style={styles.buttonRow}>
                  {[1, 2, 3].map(tri => {
                    const selected = trimester === tri;
                    return (
                      <TouchableOpacity
                        key={tri}
                        style={[
                          styles.optionCard,
                          selected && styles.optionCardSelected,
                        ]}
                        onPress={() => setTrimester(tri as 1 | 2 | 3)}
                      >
                        <Text
                          style={[
                            styles.optionCardText,
                            selected && styles.optionCardTextSelected,
                          ]}
                        >
                          {tri === 1 ? 'First' : tri === 2 ? 'Second' : 'Third'}{' '}
                          Trimester
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Are you breastfeeding?</Text>
                <Text style={styles.helper}>
                  We'll increase calories and hydration recommendations
                </Text>
              </View>
              <Switch
                value={isBreastfeeding}
                onValueChange={setIsBreastfeeding}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={isTrackingCycle ? colors.lightPrimary : '#FFFFFF'}
              />
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 4 }}>
          <EmpatheticButton
            title="Continue"
            onPress={handleContinue}
            disabled={isTrackingCycle && !isCycleTrackingValid()}
          />
          <Text style={styles.bottomText}>Your body is amazing! 🌺</Text>
        </View>
      </ScrollView>

      <PeriodStartModal
        visible={showPeriodModal}
        onClose={() => setShowPeriodModal(false)}
        onSelectDate={handlePeriodDateSelect}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    justifyContent: 'space-between',
    flexGrow: 1,
  },

  card: {
    gap: spacing.md,
    marginBottom: sizes.screenHeight * 0.055,
  },

  infoCard: {
    flexDirection: 'row',
    gap: spacing.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
    borderRadius: radius.sm,
    textAlign: 'center',
    padding: spacing.sm,
  },

  infoEmoji: {
    fontSize: 24,
  },

  infoText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },

  section: {
    gap: spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  label: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  helper: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  subSection: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  subLabel: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  optionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  optionButtonSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  optionButtonText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  optionButtonTextSelected: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  optionCard: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },

  optionCardSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  optionCardText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  optionCardTextSelected: {
    color: colors.primary,
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

  dateButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },

  dateButtonSelected: {
    borderColor: colors.primary + '80',
    backgroundColor: colors.lightPrimary,
  },

  dateButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  dateButtonTextSelected: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },

  dateButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.surface,
  },

  dateButtonTextDisabled: {
    color: colors.textMuted,
    opacity: 0.5,
  },
});
