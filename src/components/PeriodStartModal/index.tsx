import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import images from '../../constants/images/cycle';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { colors as themeColors } from '../../constants/theme/theme';
import { Period } from '../../services/api';

export interface PeriodLogData {
  startDate: Date;
  endDate?: Date;
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

interface PeriodStartModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: PeriodLogData) => void;
  editingPeriod?: Period | null;
  focusOnEndDate?: boolean; // If true, automatically show end date section
  endDateOptional?: boolean; // Controls whether UI labels show end date as optional
  loading?: boolean; // Loading state for period logging
}

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Common period symptoms (same as WomenHealthScreen)
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

const MAX_PAST_DAYS = 90;
const MAX_PERIOD_LENGTH_DAYS = 14;

const PeriodStartModal: React.FC<PeriodStartModalProps> = ({
  visible,
  onClose,
  onConfirm,
  editingPeriod,
  focusOnEndDate = false,
  endDateOptional = true,
  loading = false,
}) => {
  // Initialize state from editingPeriod if provided
  const getInitialStartDate = () => {
    if (editingPeriod?.startDate) {
      return new Date(editingPeriod.startDate);
    }
    return new Date();
  };

  const getInitialSelectedStart = () => {
    if (editingPeriod?.startDate) {
      const start = new Date(editingPeriod.startDate);
      return start.getDate();
    }
    return null;
  };

  const getInitialSelectedEnd = () => {
    if (editingPeriod?.endDate) {
      const end = new Date(editingPeriod.endDate);
      return end.getDate();
    }
    return null;
  };

  const [currentDate, setCurrentDate] = useState(getInitialStartDate());
  const [selectedStart, setSelectedStart] = useState<number | null>(
    getInitialSelectedStart(),
  );
  const [selectedStartMonth, setSelectedStartMonth] = useState<number | null>(
    editingPeriod?.startDate
      ? new Date(editingPeriod.startDate).getMonth()
      : null,
  );
  const [selectedStartYear, setSelectedStartYear] = useState<number | null>(
    editingPeriod?.startDate
      ? new Date(editingPeriod.startDate).getFullYear()
      : null,
  );
  const [selectedEnd, setSelectedEnd] = useState<number | null>(
    getInitialSelectedEnd(),
  );
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | null>(
    editingPeriod?.endDate ? new Date(editingPeriod.endDate).getMonth() : null,
  );
  const [selectedEndYear, setSelectedEndYear] = useState<number | null>(
    editingPeriod?.endDate
      ? new Date(editingPeriod.endDate).getFullYear()
      : null,
  );
  const [showEndDate, setShowEndDate] = useState(
    editingPeriod?.endDate ? true : false,
  );
  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | undefined>(
    editingPeriod?.flow || 'medium',
  );
  const [symptoms, setSymptoms] = useState<string[]>(
    editingPeriod?.symptoms || [],
  );
  const [notes, setNotes] = useState(editingPeriod?.notes || '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editingPeriod changes
  React.useEffect(() => {
    if (visible) {
      if (editingPeriod) {
        const start = new Date(editingPeriod.startDate);
        setCurrentDate(start);
        setSelectedStart(start.getDate());
        setSelectedStartMonth(start.getMonth());
        setSelectedStartYear(start.getFullYear());
        if (editingPeriod.endDate) {
          const end = new Date(editingPeriod.endDate);
          setSelectedEnd(end.getDate());
          setSelectedEndMonth(end.getMonth());
          setSelectedEndYear(end.getFullYear());
          setShowEndDate(true);
        } else {
          setSelectedEnd(null);
          setSelectedEndMonth(null);
          setSelectedEndYear(null);
          // Auto-show end date section if focusOnEndDate is true
          setShowEndDate(focusOnEndDate);
        }
        setFlow(editingPeriod.flow || 'medium');
        setSymptoms(editingPeriod.symptoms || []);
        setNotes(editingPeriod.notes || '');
      } else {
        // Reset for new period
        setCurrentDate(new Date());
        setSelectedStart(null);
        setSelectedStartMonth(null);
        setSelectedStartYear(null);
        setSelectedEnd(null);
        setSelectedEndMonth(null);
        setSelectedEndYear(null);
        setShowEndDate(false);
        setFlow('medium');
        setSymptoms([]);
        setNotes('');
      }
      setError(null);
      setIsSubmitting(false); // Reset submitting state when modal opens/closes
    }
  }, [visible, editingPeriod, focusOnEndDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minStartDate = new Date(today);
  minStartDate.setDate(minStartDate.getDate() - MAX_PAST_DAYS);

  const monthStartFor = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

  const goPrevMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);
    if (monthStartFor(prevMonth) >= monthStartFor(minStartDate)) {
      setCurrentDate(prevMonth);
    }
  };

  const goNextMonth = () => {
    const nextMonth = new Date(year, month + 1, 1);
    if (monthStartFor(nextMonth) <= monthStartFor(today)) {
      setCurrentDate(nextMonth);
    }
  };

  const isWithinAllowedWindow = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= minStartDate && d <= today;
  };

  const getMonthGrid = () => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let grid: { empty?: boolean; day?: number }[] = [];

    for (let i = 0; i < firstDay; i++) grid.push({ empty: true });
    for (let i = 1; i <= totalDays; i++) grid.push({ day: i });

    return grid;
  };

  const grid = getMonthGrid();

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom],
    );
  };

  const handleStartDateSelect = (day: number) => {
    const candidate = new Date(year, month, day);
    if (!isWithinAllowedWindow(candidate)) {
      setError(
        `You can only log periods from the last ${MAX_PAST_DAYS} days up to today.`,
      );
      return;
    }

    setError(null);
    setSelectedStart(day);
    setSelectedStartMonth(month);
    setSelectedStartYear(year);
    // If end date is before the new start date, clear it
    if (selectedEnd) {
      const endDate = selectedEndMonth !== null && selectedEndYear !== null
        ? new Date(selectedEndYear, selectedEndMonth, selectedEnd)
        : new Date(year, month, selectedEnd);
      if (endDate < candidate) {
        setSelectedEnd(null);
        setSelectedEndMonth(null);
        setSelectedEndYear(null);
      }
    }
  };

  const handleEndDateSelect = (day: number) => {
    if (!selectedStart || selectedStartMonth === null || selectedStartYear === null) return;

    const startLocal = new Date(selectedStartYear, selectedStartMonth, selectedStart);
    const endLocal = new Date(year, month, day);

    if (endLocal > today) {
      setError('End date cannot be in the future.');
      return;
    }

    if (endLocal < startLocal) {
      setError('End date must be on or after start date.');
      return;
    }

    const diffMs = endLocal.getTime() - startLocal.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > MAX_PERIOD_LENGTH_DAYS) {
      setError(
        `Period length seems too long. Max allowed is ${MAX_PERIOD_LENGTH_DAYS} days.`,
      );
      return;
    }

    setError(null);
    setSelectedEnd(day);
    setSelectedEndMonth(month);
    setSelectedEndYear(year);
  };

  const handleConfirm = async () => {
    if (selectedStart === null || selectedStartMonth === null || selectedStartYear === null) return;
    if (loading || isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true); // Set local loading state immediately

    // Use stored month/year for start date, not current month
    const startDate = new Date(selectedStartYear, selectedStartMonth, selectedStart);
    startDate.setHours(0, 0, 0, 0);
    
    // Use stored month/year for end date if available, otherwise use current month
    const endDate =
      selectedEnd !== null
        ? new Date(
            selectedEndYear !== null ? selectedEndYear : year,
            selectedEndMonth !== null ? selectedEndMonth : month,
            selectedEnd
          )
        : undefined;
    
    if (endDate) {
      endDate.setHours(0, 0, 0, 0);
    }

    const periodData: PeriodLogData = {
      startDate,
      endDate,
      flow,
      symptoms: symptoms.length > 0 ? symptoms : undefined,
      notes: notes.trim() || undefined,
    };

    try {
      // Call onConfirm and await if it returns a promise
      // This keeps the button in loading state during the async operation
      const result = onConfirm(periodData);
      if (result && typeof result.then === 'function') {
        await result;
      }
      // Form will be reset automatically by useEffect when modal closes (visible becomes false)
      // The parent component handles closing the modal after success
    } catch (error) {
      // Don't reset form on error - let user see what they entered
      console.error('Error in period log:', error);
      setIsSubmitting(false); // Reset on error so user can try again
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Text style={styles.title}>
              {editingPeriod ? 'Edit Period' : 'Log Period'}
            </Text>
            <TouchableOpacity
              onPress={() => onClose()}
              style={styles.crossButtonStyle}
              activeOpacity={0.8}
            >
              <Image source={images.crossButton} style={styles.crossStyle} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Start Date Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Start Date</Text>
              <Text style={styles.subText}>
                Select the date your period started
              </Text>
              <Text style={styles.helperText}>
                You can log periods from the last {MAX_PAST_DAYS} days up to
                today.
              </Text>

              <View style={styles.monthHeader}>
                <TouchableOpacity onPress={goPrevMonth}>
                  <Image
                    source={images.rightArrow}
                    style={[
                      styles.arrow,
                      { transform: [{ rotate: '180deg' }] },
                    ]}
                  />
                </TouchableOpacity>

                <Text style={styles.monthText}>
                  {currentDate.toLocaleString('default', { month: 'long' })}{' '}
                  {year}
                </Text>

                <TouchableOpacity onPress={goNextMonth}>
                  <Image source={images.rightArrow} style={styles.arrow} />
                </TouchableOpacity>
              </View>

              <View style={styles.weekRow}>
                {days.map(d => (
                  <Text key={d} style={styles.weekText}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={styles.grid}>
                {grid.map((item, index) =>
                  item.empty ? (
                    <View key={index} style={styles.emptyCell} />
                  ) : (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayCell,
                        selectedStart === item.day && styles.selectedCell,
                        selectedEnd !== null &&
                          item.day! >= selectedStart! &&
                          item.day! <= selectedEnd &&
                          styles.rangeCell,
                      ]}
                      onPress={() => handleStartDateSelect(item.day!)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          selectedStart === item.day && styles.selectedText,
                          selectedEnd !== null &&
                            item.day! >= selectedStart! &&
                            item.day! <= selectedEnd &&
                            styles.rangeText,
                        ]}
                      >
                        {item.day}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>

              {selectedStart !== null && (
                <TouchableOpacity
                  style={styles.addEndDateButton}
                  onPress={() => setShowEndDate(!showEndDate)}
                >
                  <Text style={styles.addEndDateText}>
                    {selectedEnd !== null
                      ? 'Change end date'
                      : endDateOptional
                        ? '+ Add end date (optional)'
                        : '+ Add end date'}
                  </Text>
                </TouchableOpacity>
              )}

              {showEndDate && selectedStart !== null && (
                <View style={styles.endDateSection}>
                  <Text style={styles.sectionTitle}>
                    {endDateOptional ? 'End Date (Optional)' : 'End Date'}
                  </Text>
                  <View style={styles.grid}>
                    {grid.map((item, index) =>
                      item.empty ? (
                        <View key={index} style={styles.emptyCell} />
                      ) : (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.dayCell,
                            selectedEnd === item.day && styles.selectedEndCell,
                            selectedStart !== null &&
                              item.day! >= selectedStart &&
                              item.day! <= (selectedEnd || selectedStart) &&
                              styles.rangeCell,
                          ]}
                          onPress={() => handleEndDateSelect(item.day!)}
                          disabled={
                            selectedStart !== null && item.day! < selectedStart
                          }
                        >
                          <Text
                            style={[
                              styles.dayText,
                              selectedEnd === item.day && styles.selectedText,
                              selectedStart !== null &&
                                item.day! < selectedStart &&
                                styles.disabledText,
                              selectedStart !== null &&
                                item.day! >= selectedStart &&
                                item.day! <= (selectedEnd || selectedStart) &&
                                styles.rangeText,
                            ]}
                          >
                            {item.day}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              )}
              {error && (
                <Text style={[styles.helperText, { color: colors.errorRed }]}>
                  {error}
                </Text>
              )}
            </View>

            {/* Flow Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Flow</Text>
              <View style={styles.buttonRow}>
                {(['light', 'medium', 'heavy'] as const).map(f => {
                  const selected = flow === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.optionButton,
                        selected && styles.optionButtonSelected,
                      ]}
                      onPress={() => setFlow(f)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          selected && styles.optionButtonTextSelected,
                        ]}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Symptoms Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Symptoms (Optional)</Text>
              <Text style={styles.helperText}>
                Select any symptoms you experienced
              </Text>
              <View style={styles.buttonRow}>
                {commonSymptoms.map(symptom => {
                  const selected = symptoms.includes(symptom);
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
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any additional notes..."
                placeholderTextColor={themeColors.textMuted}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.confirmBtn,
              (selectedStart === null || loading || isSubmitting) && styles.confirmBtnDisabled,
            ]}
            onPress={handleConfirm}
            disabled={selectedStart === null || loading || isSubmitting}
          >
            {(loading || isSubmitting) ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.confirmText}>
                {editingPeriod ? 'Update Period' : 'Log Period'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  title: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.text,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 6,
  },

  subText: {
    color: colors.green,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  helperText: {
    color: themeColors.textMuted,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
  },

  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  monthText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  weekText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 15,
  },

  dayCell: {
    width: `${100 / 7}%`,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },

  selectedCell: {
    backgroundColor: '#E4AF5D',
    borderRadius: sizes.screenWidth * 0.02,
  },

  selectedEndCell: {
    backgroundColor: '#E799AD',
    borderRadius: sizes.screenWidth * 0.02,
  },

  rangeCell: {
    backgroundColor: '#FFF4E3',
  },

  dayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
  },

  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },

  rangeText: {
    color: colors.text,
  },

  disabledText: {
    color: colors.textMuted,
    opacity: 0.4,
  },

  emptyCell: {
    width: `${100 / 7}%`,
    height: 40,
  },

  addEndDateButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },

  addEndDateText: {
    color: colors.primary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },

  endDateSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },

  optionButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
    backgroundColor: '#fff',
  },

  optionButtonSelected: {
    backgroundColor: colors.heading,
    borderColor: colors.heading,
  },

  optionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },

  optionButtonTextSelected: {
    color: '#fff',
  },

  notesInput: {
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text,
    minHeight: 80,
    marginTop: 8,
  },

  confirmBtn: {
    backgroundColor: '#E4AF5D',
    paddingVertical: 12,
    borderRadius: 12,
  },

  confirmBtnDisabled: {
    // backgroundColor: colors.border,
    opacity: 0.6,
  },

  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  arrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },

  crossStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.03,
    height: sizes.screenWidth * 0.03,
  },

  crossButtonStyle: {
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PeriodStartModal;
