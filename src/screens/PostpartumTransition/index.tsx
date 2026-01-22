import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import { colors } from '../../constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { transitionToPostpartum } from '../../services/api';
import moment from 'moment';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PostpartumTransition() {
  const navigation = useNavigation<NavigationProp>();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [resumeCycleTracking, setResumeCycleTracking] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setBirthDate(date);
    }
  };

  const handleSubmit = async () => {
    if (!birthDate) {
      Alert.alert('Error', 'Please enter the birth date');
      return;
    }

    try {
      setSaving(true);
      const response = await transitionToPostpartum({
        birthDate: birthDate.toISOString(),
        resumeCycleTracking,
      });

      if (response.success) {
        Alert.alert('Success', 'Successfully transitioned to postpartum', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to home or cycle tracking screen
              navigation.navigate('TabNavigator');
            },
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete transition. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          <Text style={styles.title}>Postpartum Transition</Text>
          <Text style={styles.subtitle}>
            Congratulations on your new arrival! Let's update your profile.
          </Text>

          {/* Birth Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {birthDate
                  ? moment(birthDate).format('MMM D, YYYY')
                  : 'Select birth date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate || new Date()}
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

          {/* Resume Cycle Tracking */}
          <View style={styles.section}>
            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <Text style={styles.label}>Resume Cycle Tracking</Text>
                <Text style={styles.helperText}>
                  Start tracking your cycle again after pregnancy
                </Text>
              </View>
              <Switch
                value={resumeCycleTracking}
                onValueChange={setResumeCycleTracking}
                trackColor={{
                  false: '#d4d0d0ff',
                  true: colors.primary,
                }}
                thumbColor={resumeCycleTracking ? colors.lightPrimary : '#FFFFFF'}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, saving && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={saving || !birthDate}
          >
            <Text style={styles.submitButtonText}>
              {saving ? 'Processing...' : 'Complete Transition'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


