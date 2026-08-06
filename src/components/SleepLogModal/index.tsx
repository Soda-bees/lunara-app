import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import { logSleep } from '../../services/api';
import images from '../../constants/images/sleep';
import { colors } from '../../constants/colors';
import sleepStyles from '../../screens/SleepTracker/style';

export interface SleepLogModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate?: Date;
}

const SleepLogModal: React.FC<SleepLogModalProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedDate,
}) => {
  const initialDate = useMemo(() => selectedDate || new Date(), [selectedDate]);

  const [quality, setQuality] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [bedTime, setBedTime] = useState<string>('');
  const [bedPeriod, setBedPeriod] = useState<'AM' | 'PM'>('PM');
  const [wakeTime, setWakeTime] = useState<string>('');
  const [wakePeriod, setWakePeriod] = useState<'AM' | 'PM'>('AM');
  const [date, setDate] = useState<Date>(initialDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [totalSleepHours, setTotalSleepHours] = useState<number | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const format12HourTime = (text: string) => {
    // Remove non-numbers except colon
    const cleaned = text.replace(/[^0-9:]/g, '');

    // If user is deleting, allow partial input
    if (cleaned.length === 0) {
      return '';
    }

    // Remove existing colons and rebuild
    const numbersOnly = cleaned.replace(/:/g, '');

    // Limit to 4 digits
    const limited = numbersOnly.slice(0, 4);

    // Auto insert colon after 2 digits
    if (limited.length > 2) {
      return limited.slice(0, 2) + ':' + limited.slice(2, 4);
    }

    // If user has typed 1-2 digits, return as is
    return limited;
  };

  // Reset form values whenever modal opens.
  useEffect(() => {
    if (!visible) return;
    setQuality(3);
    setNotes('');
    setBedTime('');
    setBedPeriod('PM');
    setWakeTime('');
    setWakePeriod('AM');
    setDate(initialDate);
    setShowDatePicker(false);
    setTotalSleepHours(null);
    setSaving(false);
  }, [visible, initialDate]);

  // Calculate total sleep hours
  useEffect(() => {
    if (!bedTime || !wakeTime) {
      setTotalSleepHours(null);
      return;
    }

    try {
      // Handle both "HH:MM" and "HHMM" formats
      const bedParts = bedTime.includes(':')
        ? bedTime.split(':')
        : bedTime.length >= 2
        ? [bedTime.slice(0, 2), bedTime.slice(2, 4) || '0']
        : [bedTime, '0'];

      const wakeParts = wakeTime.includes(':')
        ? wakeTime.split(':')
        : wakeTime.length >= 2
        ? [wakeTime.slice(0, 2), wakeTime.slice(2, 4) || '0']
        : [wakeTime, '0'];

      const bedHour = parseInt(bedParts[0] || '0', 10);
      const bedMin = parseInt(bedParts[1] || '0', 10);
      const wakeHour = parseInt(wakeParts[0] || '0', 10);
      const wakeMin = parseInt(wakeParts[1] || '0', 10);

      // Validate hours (1-12) and minutes (0-59)
      if (
        bedHour < 1 ||
        bedHour > 12 ||
        bedMin < 0 ||
        bedMin > 59 ||
        wakeHour < 1 ||
        wakeHour > 12 ||
        wakeMin < 0 ||
        wakeMin > 59
      ) {
        setTotalSleepHours(null);
        return;
      }

      // Convert to 24-hour format
      let bed24 = bedHour;
      if (bedPeriod === 'PM' && bedHour !== 12) bed24 += 12;
      if (bedPeriod === 'AM' && bedHour === 12) bed24 = 0;

      let wake24 = wakeHour;
      if (wakePeriod === 'PM' && wakeHour !== 12) wake24 += 12;
      if (wakePeriod === 'AM' && wakeHour === 12) wake24 = 0;

      // Calculate total minutes
      const bedMinutes = bed24 * 60 + bedMin;
      let wakeMinutes = wake24 * 60 + wakeMin;

      // If wake time is before bed time, assume next day
      if (wakeMinutes <= bedMinutes) {
        wakeMinutes += 24 * 60;
      }

      const diffMinutes = wakeMinutes - bedMinutes;
      const hours = diffMinutes / 60;
      setTotalSleepHours(Math.round(hours * 10) / 10);
    } catch {
      setTotalSleepHours(null);
    }
  }, [bedTime, bedPeriod, wakeTime, wakePeriod]);

  const handleSave = async () => {
    // Validation
    if (!bedTime || !wakeTime) {
      // Keep message light; Home will handle refresh/retry.
      return;
    }

    if (!totalSleepHours || totalSleepHours <= 0) {
      return;
    }

    try {
      setSaving(true);

      // Parse bed and wake times (handle both "HH:MM" and "HHMM" formats)
      const bedParts = bedTime.includes(':')
        ? bedTime.split(':')
        : bedTime.length >= 2
        ? [bedTime.slice(0, 2), bedTime.slice(2, 4) || '0']
        : [bedTime, '0'];

      const wakeParts = wakeTime.includes(':')
        ? wakeTime.split(':')
        : wakeTime.length >= 2
        ? [wakeTime.slice(0, 2), wakeTime.slice(2, 4) || '0']
        : [wakeTime, '0'];

      const bedHour = parseInt(bedParts[0] || '0', 10);
      const bedMin = parseInt(bedParts[1] || '0', 10);
      const wakeHour = parseInt(wakeParts[0] || '0', 10);
      const wakeMin = parseInt(wakeParts[1] || '0', 10);

      // Validate (same rules as in the calculator)
      if (
        bedHour < 1 ||
        bedHour > 12 ||
        bedMin < 0 ||
        bedMin > 59 ||
        wakeHour < 1 ||
        wakeHour > 12 ||
        wakeMin < 0 ||
        wakeMin > 59
      ) {
        return;
      }

      let bed24 = bedHour;
      if (bedPeriod === 'PM' && bedHour !== 12) bed24 += 12;
      if (bedPeriod === 'AM' && bedHour === 12) bed24 = 0;

      let wake24 = wakeHour;
      if (wakePeriod === 'PM' && wakeHour !== 12) wake24 += 12;
      if (wakePeriod === 'AM' && wakeHour === 12) wake24 = 0;

      // Create date objects
      const sleepDate = new Date(date);
      sleepDate.setHours(0, 0, 0, 0);

      const bedDateTime = new Date(sleepDate);
      bedDateTime.setHours(bed24, bedMin, 0, 0);

      let wakeDateTime = new Date(sleepDate);
      wakeDateTime.setHours(wake24, wakeMin, 0, 0);

      // If wake time is before bed time, it's next day
      if (wakeDateTime <= bedDateTime) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1);
      }

      const response = await logSleep({
        date: sleepDate.toISOString(),
        bedTime: bedDateTime.toISOString(),
        wakeTime: wakeDateTime.toISOString(),
        quality,
        notes: notes.trim() || undefined,
      });

      if (response.success) {
        onConfirm();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.45}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={sleepStyles.modalWrapper}
    >
      <View style={sleepStyles.modalBox}>
        {/* Header */}
        <View style={sleepStyles.headerRow}>
          <View style={sleepStyles.row}>
            <Image source={images.btCycleActive} style={sleepStyles.smallIcon} />
            <Text style={sleepStyles.headerText}>Log Sleep</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <View style={{ marginBottom: 16 }}>
          <Text style={sleepStyles.timeLabel}>Date</Text>
          <TouchableOpacity
            style={sleepStyles.timeInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={sleepStyles.timeValue}>
              {moment(date).format('MMM D, YYYY')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event, nextDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (nextDate) setDate(nextDate);
                }}
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={sleepStyles.datePickerDone}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={sleepStyles.datePickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Bed + Wake Time */}
        <View style={sleepStyles.timeRow}>
          {/* Bed Time */}
          <View style={sleepStyles.timeBox}>
            <Text style={sleepStyles.timeLabel}>Bed Time</Text>
            <View style={sleepStyles.timeInput}>
              <TextInput
                style={sleepStyles.timeValue}
                placeholder="10:30"
                placeholderTextColor="#9C9C9C"
                keyboardType="numeric"
                maxLength={5}
                value={bedTime}
                onChangeText={t => setBedTime(format12HourTime(t))}
              />
              <TouchableOpacity
                onPress={() =>
                  setBedPeriod(bedPeriod === 'AM' ? 'PM' : 'AM')
                }
                style={sleepStyles.periodBtn}
              >
                <Text style={sleepStyles.periodText}>{bedPeriod}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wake Time */}
          <View style={sleepStyles.timeBox}>
            <Text style={sleepStyles.timeLabel}>Wake Time</Text>
            <View style={sleepStyles.timeInput}>
              <TextInput
                style={sleepStyles.timeValue}
                placeholder="07:00"
                placeholderTextColor="#9C9C9C"
                keyboardType="numeric"
                maxLength={5}
                value={wakeTime}
                onChangeText={t => setWakeTime(format12HourTime(t))}
              />
              <TouchableOpacity
                onPress={() =>
                  setWakePeriod(wakePeriod === 'PM' ? 'AM' : 'PM')
                }
                style={sleepStyles.periodBtn}
              >
                <Text style={sleepStyles.periodText}>{wakePeriod}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Total Sleep */}
        <View style={sleepStyles.totalSleepBox}>
          <Text style={sleepStyles.totalSleepLabel}>Total Sleep</Text>
          <Text style={sleepStyles.totalSleepHours}>
            {totalSleepHours !== null
              ? `${totalSleepHours.toFixed(1)} hours`
              : '-- hours'}
          </Text>
        </View>

        {/* Sleep Quality */}
        <Text style={sleepStyles.sectionLabel}>Sleep Quality</Text>
        <View style={sleepStyles.qualityRow}>
          {[1, 2, 3, 4, 5].map(num => (
            <TouchableOpacity
              key={num}
              style={[
                sleepStyles.qualityButton,
                quality === num && sleepStyles.qualityButtonActive,
              ]}
              onPress={() => setQuality(num)}
            >
              <Text
                style={[
                  sleepStyles.qualityText,
                  quality === num && sleepStyles.qualityTextActive,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={sleepStyles.qualityLabelsRow}>
          <Text style={sleepStyles.qualitySideLabel}>Poor</Text>
          <Text style={sleepStyles.qualitySideLabel}>Excellent</Text>
        </View>

        {/* Notes */}
        <Text style={sleepStyles.sectionLabel}>Notes (Optional)</Text>
        <TextInput
          style={sleepStyles.notesInput}
          placeholder="How did you feel?"
          placeholderTextColor={colors.green}
          multiline
          maxLength={500}
          value={notes}
          onChangeText={setNotes}
        />
        <Text style={sleepStyles.charCount}>{notes.length}/500 characters</Text>

        {/* Buttons */}
        <View style={sleepStyles.buttonRow}>
          <TouchableOpacity
            style={sleepStyles.cancelBtn}
            onPress={onClose}
            disabled={saving}
          >
            <Text style={sleepStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[sleepStyles.saveBtn, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={sleepStyles.saveText}>Save Sleep Log</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SleepLogModal;

