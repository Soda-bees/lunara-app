import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import images from '../../constants/images/cycle';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { colors as themeColors } from '../../constants/theme/theme';

export interface PregnancyPromptData {
  isPregnant: boolean;
  dueDate?: Date;
  lastMenstrualPeriod?: Date;
  trimester?: 1 | 2 | 3 | null;
}

interface PregnancyPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: PregnancyPromptData) => void;
  loading?: boolean;
}

const PregnancyPromptModal: React.FC<PregnancyPromptModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const [isPregnant, setIsPregnant] = useState(false);
  const [trimester, setTrimester] = useState<1 | 2 | 3 | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState<Date | null>(
    null,
  );
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showLMPPicker, setShowLMPPicker] = useState(false);
  // Track which field was auto-calculated
  const [autoCalculatedField, setAutoCalculatedField] = useState<
    'dueDate' | 'lmp' | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset submitting state when modal visibility changes
  useEffect(() => {
    if (!visible) {
      setIsSubmitting(false);
    }
  }, [visible]);

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

  const handleConfirm = async () => {
    if (loading || isSubmitting) return;
    setIsSubmitting(true);

    const payload: PregnancyPromptData = {
      isPregnant,
      dueDate: dueDate || undefined,
      lastMenstrualPeriod: lastMenstrualPeriod || undefined,
      trimester: trimester || undefined,
    };

    try {
      const result = onConfirm(payload);
      if (result && typeof (result as any).then === 'function') {
        await (result as any);
      }
      // Parent is responsible for closing modal and resetting state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (loading || isSubmitting) return;
    onConfirm({
      isPregnant: false,
    });
    // Parent will handle closing modal; we don't force-reset here
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
            <Text style={styles.title}>Are you pregnant?</Text>
            <TouchableOpacity
              onPress={onClose}
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
            <Text style={styles.subText}>
              Your period is overdue. If you're pregnant, we can help you track
              your pregnancy journey!
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isPregnant && styles.optionButtonSelected,
                ]}
                onPress={() => setIsPregnant(true)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isPregnant && styles.optionButtonTextSelected,
                  ]}
                >
                  Yes, I'm pregnant
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isPregnant === false && styles.optionButtonSelected,
                ]}
                onPress={() => setIsPregnant(false)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isPregnant === false && styles.optionButtonTextSelected,
                  ]}
                >
                  No, not pregnant
                </Text>
              </TouchableOpacity>
            </View>

            {isPregnant && (
              <View style={styles.pregnancySection}>
                {/* Trimester Selection */}
                <View style={styles.subSection}>
                  <Text style={styles.subLabel}>Which trimester?</Text>
                  <View style={styles.buttonRow}>
                    {[1, 2, 3].map(tri => {
                      const selected = trimester === tri;
                      return (
                        <TouchableOpacity
                          key={tri}
                          style={[
                            styles.optionButton,
                            selected && styles.optionButtonSelected,
                          ]}
                          onPress={() => setTrimester(tri as 1 | 2 | 3)}
                        >
                          <Text
                            style={[
                              styles.optionButtonText,
                              selected && styles.optionButtonTextSelected,
                            ]}
                          >
                            {tri === 1
                              ? 'First'
                              : tri === 2
                                ? 'Second'
                                : 'Third'}{' '}
                            Trimester
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Due Date Picker */}
                <View style={styles.subSection}>
                  <Text style={styles.subLabel}>Due Date (Optional)</Text>
                  <TouchableOpacity
                    style={[
                      styles.dateButton,
                      dueDate && styles.dateButtonSelected,
                      autoCalculatedField === 'dueDate' &&
                        styles.dateButtonAutoCalculated,
                    ]}
                    onPress={() => {
                      handleManualDueDateEdit();
                      setShowDueDatePicker(true);
                    }}
                  >
                    <View style={styles.dateButtonContent}>
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
                      {autoCalculatedField === 'dueDate' && (
                        <Text style={styles.autoCalcIndicator}>
                          Auto-calculated
                        </Text>
                      )}
                    </View>
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
                  {autoCalculatedField === 'dueDate' && (
                    <Text style={styles.helperText}>
                      Due date calculated from LMP. You can edit it manually.
                    </Text>
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
                      autoCalculatedField === 'lmp' &&
                        styles.dateButtonAutoCalculated,
                    ]}
                    onPress={() => {
                      handleManualLMPEdit();
                      setShowLMPPicker(true);
                    }}
                  >
                    <View style={styles.dateButtonContent}>
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
                      {autoCalculatedField === 'lmp' && (
                        <Text style={styles.autoCalcIndicator}>
                          Auto-calculated
                        </Text>
                      )}
                    </View>
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
                  {autoCalculatedField === 'lmp' && (
                    <Text style={styles.helperText}>
                      LMP calculated from due date. You can edit it manually.
                    </Text>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.confirmBtn, styles.primaryButton]}
              onPress={handleConfirm}
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.confirmText}>
                  {isPregnant ? 'Confirm Pregnancy' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, styles.secondaryButton]}
              onPress={handleCancel}
              disabled={loading || isSubmitting}
            >
              <Text style={[styles.confirmText, styles.secondaryText]}>
                Skip
              </Text>
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

  subText: {
    color: themeColors.textMuted,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  optionButtonSelected: {
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
  },

  optionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.darkGrey,
  },

  optionButtonTextSelected: {
    color: colors.heading,
  },

  pregnancySection: {
    marginTop: 10,
  },

  subSection: {
    marginBottom: 20,
  },

  subLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    marginBottom: 8,
  },

  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateButtonSelected: {
    borderColor: colors.heading,
    backgroundColor: '#FFF4E3',
  },

  dateButtonAutoCalculated: {
    borderColor: colors.heading + '80',
    backgroundColor: '#FFF8EB',
  },

  dateButtonText: {
    color: themeColors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  dateButtonTextSelected: {
    color: colors.heading,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },

  autoCalcIndicator: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: colors.heading + 'CC',
    marginTop: 2,
    fontStyle: 'italic',
  },

  helperText: {
    color: themeColors.textMuted,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },

  datePickerDone: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  datePickerDoneText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
  },

  buttonContainer: {
    gap: 10,
    marginTop: 10,
  },

  confirmBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  primaryButton: {
    backgroundColor: colors.heading,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
  },

  confirmText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  secondaryText: {
    color: colors.darkGrey,
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

export default PregnancyPromptModal;
