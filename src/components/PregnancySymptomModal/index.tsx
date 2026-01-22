import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { logPregnancySymptom } from '../../services/api';
import moment from 'moment';

interface PregnancySymptomModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const commonSymptoms = [
  'Nausea',
  'Fatigue',
  'Back pain',
  'Headaches',
  'Heartburn',
  'Swelling',
  'Constipation',
  'Shortness of breath',
  'Braxton Hicks contractions',
  'Mood swings',
  'Food cravings',
  'Food aversions',
  'Breast tenderness',
  'Frequent urination',
  'Sleep problems',
  'Round ligament pain',
  'Other',
];

const severityOptions = [
  { label: 'Mild', value: 'mild' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Severe', value: 'severe' },
];

const PregnancySymptomModal: React.FC<PregnancySymptomModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [customSymptom, setCustomSymptom] = useState('');

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSymptom) {
      Alert.alert('Error', 'Please select a symptom');
      return;
    }

    const symptomToLog = selectedSymptom === 'Other' ? customSymptom : selectedSymptom;
    if (selectedSymptom === 'Other' && !customSymptom.trim()) {
      Alert.alert('Error', 'Please enter a symptom name');
      return;
    }

    try {
      setLoading(true);
      const response = await logPregnancySymptom({
        date: selectedDate.toISOString(),
        symptom: symptomToLog,
        severity,
        notes: notes.trim() || undefined,
      });

      if (response.success) {
        Alert.alert('Success', 'Symptom logged successfully');
        // Reset form
        setSelectedDate(new Date());
        setSelectedSymptom('');
        setSeverity('mild');
        setNotes('');
        setCustomSymptom('');
        onSuccess();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log symptom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate(new Date());
    setSelectedSymptom('');
    setSeverity('mild');
    setNotes('');
    setCustomSymptom('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Log Pregnancy Symptom</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Date Picker */}
            <View style={styles.section}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {moment(selectedDate).format('MMM D, YYYY')}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
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

            {/* Symptom Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Symptom</Text>
              <View style={styles.symptomGrid}>
                {commonSymptoms.map((symptom) => (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomChip,
                      selectedSymptom === symptom && styles.symptomChipSelected,
                    ]}
                    onPress={() => setSelectedSymptom(symptom)}
                  >
                    <Text
                      style={[
                        styles.symptomChipText,
                        selectedSymptom === symptom && styles.symptomChipTextSelected,
                      ]}
                    >
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {selectedSymptom === 'Other' && (
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter symptom name"
                  value={customSymptom}
                  onChangeText={setCustomSymptom}
                  placeholderTextColor={colors.darkGrey}
                />
              )}
            </View>

            {/* Severity Selection */}
            <View style={styles.section}>
              <Text style={styles.label}>Severity</Text>
              <View style={styles.severityContainer}>
                {severityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.severityButton,
                      severity === option.value && styles.severityButtonSelected,
                    ]}
                    onPress={() => setSeverity(option.value as 'mild' | 'moderate' | 'severe')}
                  >
                    <Text
                      style={[
                        styles.severityButtonText,
                        severity === option.value && styles.severityButtonTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Add any additional details..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholderTextColor={colors.darkGrey}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Logging...' : 'Log Symptom'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: sizes.screenHeight * 0.9,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading,
  },
  closeButton: {
    fontSize: 24,
    color: colors.darkGrey,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
  datePickerDone: {
    marginTop: 12,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  datePickerDoneText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
  },
  symptomChipSelected: {
    backgroundColor: colors.heading,
    borderColor: colors.heading,
  },
  symptomChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
  symptomChipTextSelected: {
    color: colors.white,
  },
  customInput: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  severityButtonSelected: {
    backgroundColor: colors.heading,
    borderColor: colors.heading,
  },
  severityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
  },
  severityButtonTextSelected: {
    color: colors.white,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: colors.heading,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
});

export default PregnancySymptomModal;


