import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { OnboardingHeader } from '../../components/OnboardingHeader/OnboardingHeader';
import { colors, radius, spacing } from '../../constants/theme/theme';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import EmpatheticButton from '../../components/EmpatheticButton/EmpatheticButton';
import { sizes } from '../../constants/sizes';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';

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
  const [lastPeriodFlow, setLastPeriodFlow] = useState<
    'light' | 'medium' | 'heavy' | undefined
  >(data.lastPeriodFlow || 'medium');
  const [lastPeriodSymptoms, setLastPeriodSymptoms] = useState<string[]>(
    data.lastPeriodSymptoms || [],
  );
  const [lastPeriodNotes, setLastPeriodNotes] = useState<string>(
    data.lastPeriodNotes || '',
  );
  const [isPregnant, setIsPregnant] = useState(data.isPregnant || false);
  const [trimester, setTrimester] = useState<1 | 2 | 3 | null>(
    data.trimester || null,
  );
  const [isBreastfeeding, setIsBreastfeeding] = useState(
    data.isBreastfeeding || false,
  );
  const [dueDate, setDueDate] = useState<Date | null>(
    data.dueDate ? new Date(data.dueDate) : null,
  );
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState<Date | null>(
    data.lastMenstrualPeriod ? new Date(data.lastMenstrualPeriod) : null,
  );
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showLMPPicker, setShowLMPPicker] = useState(false);
  const [autoCalculatedField, setAutoCalculatedField] = useState<'dueDate' | 'lmp' | null>(null);

  // Validation: Check if at least one option is selected (cycle tracking or pregnancy)
  const isAtLeastOneSelected = () => {
    return isTrackingCycle || isPregnant;
  };

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

  // Common period symptoms
  const commonSymptoms = [
    'Cramps',
    'Bloating',
    'Headache',
    'Fatigue',
    'Mood swings',
    'Back pain',
    'Nausea',
    'Breast tenderness',
    'Acne',
    'Food cravings',
    'Insomnia',
    'Dizziness',
  ];

  // Handler for cycle tracking toggle - make it mutually exclusive with pregnancy
  const handleCycleTrackingChange = (value: boolean) => {
    setIsTrackingCycle(value);
    if (value && isPregnant) {
      setIsPregnant(false);
      setTrimester(null);
    }
  };

  // Toggle symptom selection
  const toggleSymptom = (symptom: string) => {
    setLastPeriodSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom],
    );
  };

  // Handler for pregnancy toggle - make it mutually exclusive with cycle tracking
  const handlePregnancyChange = (value: boolean) => {
    setIsPregnant(value);
    if (value && isTrackingCycle) {
      setIsTrackingCycle(false);
      // Clear cycle tracking data when switching to pregnancy
      setCycleLength('');
      setPeriodLength('');
      setLastPeriodStartDate(null);
      setLastPeriodEndDate(null);
    }
    if (!value) {
      // Clear pregnancy data when toggling off
      setDueDate(null);
      setLastMenstrualPeriod(null);
      setTrimester(null);
      setAutoCalculatedField(null);
    }
  };

  // Handle due date change with smart auto-calculation of LMP
  const handleDueDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDueDatePicker(false);
    }
    if (date) {
      setDueDate(date);
      // Auto-calculate LMP only if LMP is empty or was previously auto-calculated
      if (!lastMenstrualPeriod || autoCalculatedField === 'lmp') {
        const lmp = new Date(date);
        lmp.setDate(lmp.getDate() - 280);
        setLastMenstrualPeriod(lmp);
        setAutoCalculatedField('lmp');
      } else {
        // User has manually set LMP, don't override it
        if (autoCalculatedField === 'dueDate') {
          setAutoCalculatedField(null);
        }
      }
    }
  };

  // Handle LMP change with smart auto-calculation of due date
  const handleLMPChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowLMPPicker(false);
    }
    if (date) {
      setLastMenstrualPeriod(date);
      // Auto-calculate due date only if due date is empty or was previously auto-calculated
      if (!dueDate || autoCalculatedField === 'dueDate') {
        const calculatedDue = new Date(date);
        calculatedDue.setDate(calculatedDue.getDate() + 280);
        setDueDate(calculatedDue);
        setAutoCalculatedField('dueDate');
      } else {
        // User has manually set due date, don't override it
        if (autoCalculatedField === 'lmp') {
          setAutoCalculatedField(null);
        }
      }
    }
  };

  // Handle manual editing of auto-calculated fields
  const handleManualDueDateEdit = () => {
    if (autoCalculatedField === 'dueDate') {
      setAutoCalculatedField(null);
    }
  };

  const handleManualLMPEdit = () => {
    if (autoCalculatedField === 'lmp') {
      setAutoCalculatedField(null);
    }
  };

  const handleContinue = () => {
    // Validate that at least one option is selected
    if (!isAtLeastOneSelected()) {
      return;
    }

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
        lastPeriodFlow: lastPeriodFlow || undefined,
        lastPeriodSymptoms:
          lastPeriodSymptoms.length > 0 ? lastPeriodSymptoms : undefined,
        lastPeriodNotes: lastPeriodNotes || undefined,
        isPregnant,
        trimester: trimester || undefined,
        isBreastfeeding,
        dueDate: dueDate?.toISOString() || undefined,
        lastMenstrualPeriod: lastMenstrualPeriod?.toISOString() || undefined,
      },
      'FuelAndJoy',
    );
    // navigation.navigate('DietaryPreferences');
    navigation.navigate('FuelAndJoy');
  };

  const handlePeriodLog = (data: PeriodLogData) => {
    // Always update start date if provided
    if (data.startDate) {
      setLastPeriodStartDate(data.startDate);
      // If end date is before the new start date, clear it
      if (lastPeriodEndDate && lastPeriodEndDate < data.startDate) {
        setLastPeriodEndDate(null);
      }
    }

    // Always update end date if provided
    if (data.endDate) {
      setLastPeriodEndDate(data.endDate);
    } else if (periodModalType === 'end') {
      // If modal was opened for end date but no end date was selected, clear it
      setLastPeriodEndDate(null);
    }

    // Also update other period data if provided
    if (data.flow) {
      setLastPeriodFlow(data.flow);
    }
    if (data.symptoms) {
      setLastPeriodSymptoms(data.symptoms);
    }
    if (data.notes !== undefined) {
      setLastPeriodNotes(data.notes);
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
                onValueChange={handleCycleTrackingChange}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={isTrackingCycle ? colors.lightPrimary : '#FFFFFF'}
                disabled={isPregnant}
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

                <Text style={styles.subLabel}>Flow</Text>
                <View style={styles.buttonRow}>
                  {(['light', 'medium', 'heavy'] as const).map(flow => {
                    const selected = lastPeriodFlow === flow;
                    return (
                      <TouchableOpacity
                        key={flow}
                        style={[
                          styles.optionButton,
                          selected && styles.optionButtonSelected,
                        ]}
                        onPress={() => setLastPeriodFlow(flow)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            selected && styles.optionButtonTextSelected,
                          ]}
                        >
                          {flow.charAt(0).toUpperCase() + flow.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.subLabel}>Symptoms</Text>
                <Text style={styles.helperText}>
                  Select any symptoms you experienced during your last period
                </Text>
                <View style={styles.buttonRow}>
                  {commonSymptoms.map(symptom => {
                    const selected = lastPeriodSymptoms.includes(symptom);
                    return (
                      <TouchableOpacity
                        key={symptom}
                        style={[
                          styles.optionButton,
                          selected && styles.optionButtonSelected,
                        ]}
                        onPress={() => toggleSymptom(symptom)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            selected && styles.optionButtonTextSelected,
                          ]}
                        >
                          {symptom}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.subLabel}>Notes (optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add any additional notes about your last period..."
                  placeholderTextColor={colors.textMuted}
                  value={lastPeriodNotes}
                  onChangeText={setLastPeriodNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
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
                onValueChange={handlePregnancyChange}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={isPregnant ? colors.lightPrimary : '#FFFFFF'}
                disabled={isTrackingCycle}
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

                {/* Due Date Picker */}
                <View style={styles.subSection}>
                  <Text style={styles.subLabel}>Due Date (Optional)</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      dueDate && styles.dateButtonSelected,
                    ]}
                    onPress={() => {
                      handleManualDueDateEdit();
                      setShowDueDatePicker(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateButtonText,
                        dueDate && styles.dateButtonTextSelected,
                      ]}
                    >
                      {dueDate
                        ? moment(dueDate).format('MMM D, YYYY')
                        : 'Select due date'}
                    </Text>
                  </TouchableOpacity>
                  {showDueDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      minimumDate={new Date()}
                      maximumDate={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 1),
                        )
                      }
                      onChange={handleDueDateChange}
                    />
                  )}
                  {Platform.OS === 'ios' && showDueDatePicker && (
                    <TouchableOpacity
                      style={styles.datePickerDone}
                      onPress={() => setShowDueDatePicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Last Menstrual Period Picker */}
                <View style={styles.subSection}>
                  <Text style={styles.subLabel}>
                    Last Menstrual Period (LMP) (Optional)
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      lastMenstrualPeriod && styles.dateButtonSelected,
                    ]}
                    onPress={() => {
                      handleManualLMPEdit();
                      setShowLMPPicker(true);
                    }}
                  >
                    <Text
                      style={[
                        styles.dateButtonText,
                        lastMenstrualPeriod && styles.dateButtonTextSelected,
                      ]}
                    >
                      {lastMenstrualPeriod
                        ? moment(lastMenstrualPeriod).format('MMM D, YYYY')
                        : 'Select LMP date'}
                    </Text>
                  </TouchableOpacity>
                  {showLMPPicker && (
                    <DateTimePicker
                      value={lastMenstrualPeriod || new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      maximumDate={new Date()}
                      onChange={handleLMPChange}
                    />
                  )}
                  {Platform.OS === 'ios' && showLMPPicker && (
                    <TouchableOpacity
                      style={styles.datePickerDone}
                      onPress={() => setShowLMPPicker(false)}
                    >
                      <Text style={styles.datePickerDoneText}>Done</Text>
                    </TouchableOpacity>
                  )}
                  {dueDate && lastMenstrualPeriod && autoCalculatedField && (
                    <Text style={styles.helperText}>
                      {autoCalculatedField === 'dueDate'
                        ? 'Due date was auto-calculated from LMP. You can update it manually if needed.'
                        : 'LMP was auto-calculated from due date. You can update it manually if needed.'}
                    </Text>
                  )}
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
                thumbColor={isBreastfeeding ? colors.lightPrimary : '#FFFFFF'}
              />
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 4 }}>
          <EmpatheticButton
            title="Continue"
            onPress={handleContinue}
            disabled={
              !isAtLeastOneSelected() ||
              (isTrackingCycle && !isCycleTrackingValid())
            }
          />
          <Text style={styles.bottomText}>Your body is amazing! 🌺</Text>
        </View>
      </ScrollView>

      <PeriodStartModal
        visible={showPeriodModal}
        onClose={() => setShowPeriodModal(false)}
        onConfirm={handlePeriodLog}
        focusOnEndDate={periodModalType === 'end'}
        endDateOptional={false}
        editingPeriod={
          lastPeriodStartDate || lastPeriodEndDate
            ? ({
                _id: '',
                user: '',
                startDate: lastPeriodStartDate
                  ? lastPeriodStartDate.toISOString()
                  : new Date().toISOString(),
                endDate: lastPeriodEndDate
                  ? lastPeriodEndDate.toISOString()
                  : undefined,
                flow: lastPeriodFlow || 'medium',
                symptoms: lastPeriodSymptoms || [],
                notes: lastPeriodNotes || undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as any)
            : null
        }
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

  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginBottom: spacing.xs,
  },

  notesInput: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
  },
  datePickerDone: {
    marginTop: spacing.sm,
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  datePickerDoneText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
  },
});
