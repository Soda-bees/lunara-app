import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../../constants/colors';

interface FastingGoalEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (targetDurationMinutes: number) => void;
  currentGoalMinutes: number | null | undefined;
  startTime: string;
  loading?: boolean;
}

const PRESET_DURATIONS = [
  { label: '8 hours', minutes: 8 * 60 },
  { label: '10 hours', minutes: 10 * 60 },
  { label: '12 hours', minutes: 12 * 60 },
  { label: '14 hours', minutes: 14 * 60 },
  { label: '16 hours', minutes: 16 * 60 },
  { label: '18 hours', minutes: 18 * 60 },
  { label: '20 hours', minutes: 20 * 60 },
  { label: '24 hours', minutes: 24 * 60 },
];

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const padMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${padMinutes} ${ampm}`;
};

const formatDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const FastingGoalEditor: React.FC<FastingGoalEditorProps> = ({
  visible,
  onClose,
  onSave,
  currentGoalMinutes,
  startTime,
  loading = false,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(
    currentGoalMinutes || 12 * 60,
  );

  useEffect(() => {
    if (visible && currentGoalMinutes) {
      setSelectedMinutes(currentGoalMinutes);
    }
  }, [visible, currentGoalMinutes]);

  const handleSave = () => {
    onSave(selectedMinutes);
  };

  const calculateEndTime = (durationMinutes: number): Date => {
    const start = new Date(startTime);
    return new Date(start.getTime() + durationMinutes * 60 * 1000);
  };

  const endTime = calculateEndTime(selectedMinutes);
  const endTimeFormatted = formatTime(endTime.toISOString());
  const endDateFormatted = formatDate(endTime);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        <View style={styles.handle} />
        <Text style={styles.title}>Edit Fasting Goal</Text>

        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>Fast Ending</Text>
          <Text style={styles.previewTime}>
            {endDateFormatted}, {endTimeFormatted}
          </Text>
        </View>

        <ScrollView style={styles.presetsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.presetsLabel}>Select Duration</Text>
          {PRESET_DURATIONS.map(preset => {
            const isSelected = selectedMinutes === preset.minutes;
            return (
              <TouchableOpacity
                key={preset.label}
                style={[styles.presetButton, isSelected && styles.presetButtonSelected]}
                onPress={() => setSelectedMinutes(preset.minutes)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.presetButtonText,
                    isSelected && styles.presetButtonTextSelected,
                  ]}
                >
                  {preset.label}
                </Text>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  previewLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewTime: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#111827',
  },
  presetsContainer: {
    maxHeight: 300,
  },
  presetsLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  presetButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  presetButtonSelected: {
    borderColor: colors.primary || '#E4AF5D',
    backgroundColor: '#FFFBF0',
  },
  presetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#111827',
  },
  presetButtonTextSelected: {
    color: colors.primary || '#E4AF5D',
  },
  checkmark: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: colors.primary || '#E4AF5D',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: colors.primary || '#E4AF5D',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
