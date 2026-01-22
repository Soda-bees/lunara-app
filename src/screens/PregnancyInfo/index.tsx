import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getPregnancyStatus,
  updatePregnancyInfo,
  PregnancyStatusResponse,
} from '../../services/api';
import moment from 'moment';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PregnancyInfo() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [lastMenstrualPeriod, setLastMenstrualPeriod] = useState<Date | null>(null);
  const [showLMPPicker, setShowLMPPicker] = useState(false);
  const [pregnancyNotes, setPregnancyNotes] = useState('');

  const fetchPregnancyData = async () => {
    try {
      setLoading(true);
      const response = await getPregnancyStatus();
      // Allow editing even if not currently pregnant (for users becoming pregnant)
      if (response.success) {
        if (response.data.isPregnant) {
          setPregnancyStatus(response.data);
        }
        if (response.data.dueDate) {
          setDueDate(new Date(response.data.dueDate));
        }
        if (response.data.lastMenstrualPeriod) {
          setLastMenstrualPeriod(new Date(response.data.lastMenstrualPeriod));
        }
        setPregnancyNotes(response.data.pregnancyNotes || '');
      }
    } catch (error: any) {
      console.error('Error fetching pregnancy data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load pregnancy information. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPregnancyData();
    }, []),
  );

  const handleDueDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDueDatePicker(false);
    }
    if (date) {
      setDueDate(date);
      // Auto-calculate LMP if not set
      if (!lastMenstrualPeriod) {
        const lmp = new Date(date);
        lmp.setDate(lmp.getDate() - 280);
        setLastMenstrualPeriod(lmp);
      }
    }
  };

  const handleLMPChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowLMPPicker(false);
    }
    if (date) {
      setLastMenstrualPeriod(date);
      // Auto-calculate due date if not set
      if (!dueDate) {
        const calculatedDue = new Date(date);
        calculatedDue.setDate(calculatedDue.getDate() + 280);
        setDueDate(calculatedDue);
      }
    }
  };

  const handleSave = async () => {
    // If user is not currently pregnant but providing dates, set isPregnant to true
    const shouldActivatePregnancy = !pregnancyStatus?.isPregnant && (dueDate || lastMenstrualPeriod);
    
    if (shouldActivatePregnancy && !dueDate && !lastMenstrualPeriod) {
      Alert.alert('Error', 'Please enter either a due date or last menstrual period to activate pregnancy mode');
      return;
    }

    // If already pregnant, at least one date should be provided for updates
    if (pregnancyStatus?.isPregnant && !dueDate && !lastMenstrualPeriod && !pregnancyNotes) {
      Alert.alert('Info', 'No changes to save');
      return;
    }

    try {
      setSaving(true);
      const response = await updatePregnancyInfo({
        dueDate: dueDate?.toISOString(),
        lastMenstrualPeriod: lastMenstrualPeriod?.toISOString(),
        pregnancyNotes: pregnancyNotes.trim() || undefined,
        isPregnant: shouldActivatePregnancy ? true : undefined,
      });

      if (response.success) {
        Alert.alert(
          'Success',
          shouldActivatePregnancy
            ? 'Pregnancy mode activated! Your cycle history is preserved and visible in Cycle Insights.'
            : 'Pregnancy information updated successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                if (shouldActivatePregnancy) {
                  // Navigate to Pregnancy Dashboard after activating
                  navigation.navigate('PregnancyDashboard');
                } else {
                  navigation.goBack();
                }
              },
            },
          ],
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <BackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Update Pregnancy Information</Text>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDueDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
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
                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
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

          {/* Last Menstrual Period */}
          <View style={styles.section}>
            <Text style={styles.label}>Last Menstrual Period (LMP) (Optional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowLMPPicker(true)}
            >
              <Text style={styles.dateButtonText}>
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
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about your pregnancy..."
              value={pregnancyNotes}
              onChangeText={setPregnancyNotes}
              multiline
              numberOfLines={6}
              placeholderTextColor={colors.darkGrey}
              textAlignVertical="top"
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


