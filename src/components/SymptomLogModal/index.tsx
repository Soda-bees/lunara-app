import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import images from '../../constants/images/cycle';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  ALL_CYCLE_SYMPTOMS,
  CATEGORY_ORDER,
  defaultScale,
  getScaleOptions,
  supportsManualScale,
  SYMPTOM_CATEGORIES,
  type CycleSymptomSeverity,
  type CycleSymptomType,
} from '../../constants/cycleSymptoms';
import {
  logCycleSymptom,
  getCycleSymptoms,
  CycleSymptom,
  LogCycleSymptomRequest,
} from '../../services/api';

export interface SymptomLogData {
  date: Date;
  symptoms: Array<{
    symptom: CycleSymptomType;
    severity: CycleSymptomSeverity;
  }>;
  note?: string;
}

interface SymptomLogModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void; // Called after successful save
  selectedDate?: Date; // Optional pre-selected date
}

const SymptomLogModal: React.FC<SymptomLogModalProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedDate,
}) => {
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Set<CycleSymptomType>
  >(new Set());
  const [symptomSeverities, setSymptomSeverities] = useState<
    Record<string, CycleSymptomSeverity>
  >({});
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingSymptoms, setExistingSymptoms] = useState<CycleSymptom[]>([]);
  const [fetchingExisting, setFetchingExisting] = useState(false);

  // Fetch existing symptoms for the selected date when date changes
  useEffect(() => {
    if (visible && date) {
      fetchExistingSymptoms();
    }
  }, [visible, date]);

  const fetchExistingSymptoms = async () => {
    try {
      setFetchingExisting(true);
      const dateStr = moment(date).format('YYYY-MM-DD');
      const response = await getCycleSymptoms(dateStr, dateStr);

      if (response.success && response.data) {
        setExistingSymptoms(response.data);
        // Pre-fill form with existing symptoms
        const symptomsSet = new Set<CycleSymptomType>();
        const severities: Record<string, CycleSymptomSeverity> = {};

        response.data.forEach(symptom => {
          if (!ALL_CYCLE_SYMPTOMS.includes(symptom.symptom)) {
            return;
          }
          symptomsSet.add(symptom.symptom);
          severities[symptom.symptom] = symptom.severity;
        });

        setSelectedSymptoms(symptomsSet);
        setSymptomSeverities(severities);

        // Set note if all symptoms have the same note
        const uniqueNotes = [
          ...new Set(response.data.map(s => s.notes).filter(n => n)),
        ];
        if (uniqueNotes.length === 1) {
          setNote(uniqueNotes[0] || '');
        } else {
          setNote('');
        }
      }
    } catch (error: any) {
      console.error('Error fetching existing symptoms:', error);
    } finally {
      setFetchingExisting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const toggleSymptom = (symptom: CycleSymptomType) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptom)) {
      newSelected.delete(symptom);
      const newSeverities = { ...symptomSeverities };
      delete newSeverities[symptom];
      setSymptomSeverities(newSeverities);
    } else {
      newSelected.add(symptom);
      // Default to the configured first scale option for that symptom.
      if (!symptomSeverities[symptom]) {
        setSymptomSeverities({
          ...symptomSeverities,
          [symptom]: defaultScale(symptom),
        });
      }
    }
    setSelectedSymptoms(newSelected);
  };

  const setSeverity = (
    symptom: CycleSymptomType,
    severity: CycleSymptomSeverity,
  ) => {
    setSymptomSeverities({
      ...symptomSeverities,
      [symptom]: severity,
    });
  };

  const handleSave = async () => {
    if (selectedSymptoms.size === 0) {
      Alert.alert(
        'No Symptoms Selected',
        'Please select at least one symptom.',
      );
      return;
    }

    // Validate all selected symptoms have severity
    for (const symptom of selectedSymptoms) {
      if (!symptomSeverities[symptom]) {
        Alert.alert(
          'Missing Severity',
          `Please select severity for ${symptom}.`,
        );
        return;
      }
    }

    try {
      setLoading(true);

      // Delete existing symptoms for this date first (if any)
      if (existingSymptoms.length > 0) {
        // We'll replace all symptoms, so we need to delete old ones
        // For now, we'll just add new ones and let the backend handle duplicates
        // In a production app, you might want to update instead of delete+create
      }

      // Save each symptom
      const savePromises = Array.from(selectedSymptoms).map(symptom => {
        const request: LogCycleSymptomRequest = {
          date: moment(date).format('YYYY-MM-DD'),
          symptom,
          severity: symptomSeverities[symptom] || defaultScale(symptom),
          notes: note.trim() || undefined,
        };
        return logCycleSymptom(request);
      });

      await Promise.all(savePromises);

      Alert.alert('Success', 'Symptoms logged successfully!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            onConfirm();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error saving symptoms:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to save symptoms. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(selectedDate || new Date());
    setSelectedSymptoms(new Set());
    setSymptomSeverities({});
    setNote('');
    setExistingSymptoms([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getSeverityColor = (severity: CycleSymptomSeverity) => {
    switch (severity) {
      // Physical symptoms
      case 'mild':
        return '#5DBB63';
      case 'moderate':
        return '#E68C3A';
      case 'severe':
        return '#E85C5C';
      // Energy
      case 'low':
        return '#E85C5C';
      case 'medium':
        return '#E68C3A';
      case 'high':
        return '#5DBB63';
      // Mood/Focus
      case 'poor':
        return '#E85C5C';
      case 'neutral':
      case 'fair':
        return '#E68C3A';
      case 'good':
        return '#5DBB63';
      case 'normal':
        return '#E68C3A';
      case 'none':
        return '#9AA0A6';
      case 'dry':
        return '#C48C58';
      case 'sticky':
        return '#6A96C8';
      case 'egg-white':
      case 'indicator':
        return '#8A4676';
      default:
        return colors.black;
    }
  };

  const getSeverityLabel = (severity: CycleSymptomSeverity) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Symptoms</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Date Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {moment(date).format('MMM D, YYYY')}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
              {Platform.OS === 'ios' && showDatePicker && (
                <TouchableOpacity
                  style={styles.datePickerDone}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>

            {fetchingExisting && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.green} />
                <Text style={styles.loadingText}>Loading existing data...</Text>
              </View>
            )}

            {/* Symptom Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Select Symptoms</Text>
              <View style={styles.symptomGrid}>
                {CATEGORY_ORDER.map(categoryKey => (
                  <View key={categoryKey} style={styles.categorySection}>
                    <Text style={styles.categoryTitle}>
                      {SYMPTOM_CATEGORIES[categoryKey].label}
                    </Text>
                    {SYMPTOM_CATEGORIES[categoryKey].symptoms.map(symptom => {
                      const isSelected = selectedSymptoms.has(symptom);
                      const scaleOptions = getScaleOptions(symptom);
                      return (
                        <View key={symptom} style={styles.symptomItem}>
                          <TouchableOpacity
                            style={[
                              styles.symptomButton,
                              isSelected && styles.symptomButtonSelected,
                            ]}
                            onPress={() => toggleSymptom(symptom)}
                          >
                            <Text
                              style={[
                                styles.symptomButtonText,
                                isSelected && styles.symptomButtonTextSelected,
                              ]}
                            >
                              {symptom}
                            </Text>
                          </TouchableOpacity>

                          {isSelected && (
                            <View style={styles.severityContainer}>
                              <Text style={styles.severityLabel}>
                                {supportsManualScale(symptom)
                                  ? 'Intensity:'
                                  : 'Indicator only'}
                              </Text>
                              {supportsManualScale(symptom) && (
                                <View style={styles.severityButtons}>
                                  {scaleOptions.map(option => {
                                    const isSelectedSeverity =
                                      symptomSeverities[symptom] ===
                                      option.value;
                                    return (
                                      <TouchableOpacity
                                        key={option.value}
                                        style={[
                                          styles.severityButton,
                                          isSelectedSeverity &&
                                            styles.severityButtonSelected,
                                          {
                                            backgroundColor: isSelectedSeverity
                                              ? getSeverityColor(option.value) +
                                                '20'
                                              : 'transparent',
                                            borderColor: isSelectedSeverity
                                              ? getSeverityColor(option.value)
                                              : colors.borderColor,
                                          },
                                        ]}
                                        onPress={() =>
                                          setSeverity(symptom, option.value)
                                        }
                                      >
                                        <Text
                                          style={[
                                            styles.severityButtonText,
                                            {
                                              color: isSelectedSeverity
                                                ? getSeverityColor(option.value)
                                                : colors.black,
                                            },
                                          ]}
                                        >
                                          {option.label}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  })}
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>

            {/* Note Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Quick Note (Optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note about how you're feeling..."
                placeholderTextColor={colors.gray}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading || selectedSymptoms.size === 0}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: sizes.screenWidth * 0.05,
    borderTopRightRadius: sizes.screenWidth * 0.05,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.black,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.02,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  calendarIcon: {
    fontSize: 18,
  },
  datePickerDone: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  datePickerDoneText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.gray,
  },
  symptomGrid: {
    gap: 12,
  },
  categorySection: {
    gap: 8,
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    marginBottom: 2,
  },
  symptomItem: {
    marginBottom: 12,
  },
  symptomButton: {
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.02,
  },
  symptomButtonSelected: {
    backgroundColor: colors.heading + '10',
    borderColor: colors.heading,
  },
  symptomButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  symptomButtonTextSelected: {
    fontFamily: 'Inter-Medium',
    color: colors.heading,
  },
  severityContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColorLight,
  },
  severityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.gray,
    marginBottom: 8,
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
  },
  severityButtonSelected: {
    borderWidth: 1,
  },
  severityButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  noteInput: {
    padding: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.02,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  saveButton: {
    backgroundColor: colors.heading,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default SymptomLogModal;
