import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import PeriodStartModal, {
  PeriodLogData,
} from '../../../components/PeriodStartModal';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import { getMe, updateProfile } from '../../../services/api';
import { usePartnerMode } from '../../../context/PartnerModeContext';
import {
  DEFAULT_MEASUREMENT_SYSTEM,
  kgToLb,
  round1,
  targetWeightKgFromInput,
  type MeasurementSystem,
} from '../../../utils/measurement';
import { colors } from '../../../constants/colors';
import styles from './editStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfileGoals'>;

const GOALS = [
  { value: 'weight_loss', label: 'Lose Weight' },
  { value: 'weight_gain', label: 'Gain Weight' },
  { value: 'maintenance', label: 'Maintain Weight' },
  { value: 'muscle_gain', label: 'Build Muscle' },
  { value: 'health', label: 'Overall Health' },
];

const CYCLE_LENGTHS = [21, 24, 26, 28, 30, 32, 35];
const PERIOD_LENGTHS = [3, 4, 5, 6, 7];

export default function EditGoalsCycleScreen({ navigation }: Props) {
  const { isPartnerMode } = usePartnerMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [measurementSystem, setMeasurementSystem] =
    useState<MeasurementSystem>(DEFAULT_MEASUREMENT_SYSTEM);
  const [primaryGoal, setPrimaryGoal] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState('');
  const [isTrackingCycle, setIsTrackingCycle] = useState(false);
  const [cycleLength, setCycleLength] = useState('');
  const [periodLength, setPeriodLength] = useState('');
  const [lastPeriodStartDate, setLastPeriodStartDate] = useState<Date | null>(
    null,
  );
  const [lastPeriodEndDate, setLastPeriodEndDate] = useState<Date | null>(null);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [periodModalType, setPeriodModalType] = useState<'start' | 'end'>(
    'start',
  );

  useFocusEffect(
    useCallback(() => {
      if (isPartnerMode) {
        navigation.goBack();
      }
    }, [isPartnerMode, navigation]),
  );

  useEffect(() => {
    getMe()
      .then(res => {
        if (!res.success || !res.user) {
          return;
        }
        const user = res.user;
        const sys = user.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;
        setMeasurementSystem(sys);
        setPrimaryGoal(user.primaryGoal || null);
        if (user.targetWeightKg != null) {
          setTargetInput(
            sys === 'imperial'
              ? String(round1(kgToLb(user.targetWeightKg)))
              : String(round1(user.targetWeightKg)),
          );
        }
        setIsTrackingCycle(Boolean(user.isTrackingCycle));
        setCycleLength(user.cycleLength || '');
        setPeriodLength(user.periodLength || '');
        if (user.lastPeriodStartDate) {
          setLastPeriodStartDate(new Date(user.lastPeriodStartDate));
        }
        if (user.lastPeriodEndDate) {
          setLastPeriodEndDate(new Date(user.lastPeriodEndDate));
        }
      })
      .catch(() => Alert.alert('Error', 'Could not load your profile.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const handlePeriodLog = (data: PeriodLogData) => {
    if (data.startDate) {
      setLastPeriodStartDate(data.startDate);
    }
    if (data.endDate) {
      setLastPeriodEndDate(data.endDate);
    }
    setShowPeriodModal(false);
  };

  const handleSave = async () => {
    if (!primaryGoal) {
      Alert.alert('Select a goal', 'Choose your primary wellness goal.');
      return;
    }

    const needsTarget =
      primaryGoal === 'weight_loss' || primaryGoal === 'weight_gain';
    let targetWeightKg: number | undefined;
    if (needsTarget && targetInput.trim() !== '') {
      const parsed = targetWeightKgFromInput(targetInput, measurementSystem);
      if (parsed == null) {
        Alert.alert('Check target weight', 'Enter a valid target weight.');
        return;
      }
      targetWeightKg = parsed;
    }

    if (isTrackingCycle) {
      if (
        !cycleLength ||
        !periodLength ||
        !lastPeriodStartDate ||
        !lastPeriodEndDate
      ) {
        Alert.alert(
          'Cycle details required',
          'Fill in cycle length, period length, and last period dates.',
        );
        return;
      }
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        primaryGoal,
        targetWeightKg: needsTarget ? targetWeightKg : undefined,
        isTrackingCycle,
        cycleLength: isTrackingCycle ? cycleLength : undefined,
        periodLength: isTrackingCycle ? periodLength : undefined,
        lastPeriodStartDate: isTrackingCycle
          ? lastPeriodStartDate?.toISOString()
          : undefined,
        lastPeriodEndDate: isTrackingCycle
          ? lastPeriodEndDate?.toISOString()
          : undefined,
      });
      if (res.success) {
        navigation.goBack();
        return;
      }
      Alert.alert('Error', 'Could not save your changes.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not save your changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <BackButton />
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <BackButton />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
      >
        <Text style={styles.title}>Goals & Cycle</Text>
        <Text style={styles.subtitle}>
          Update your wellness goal and cycle tracking settings.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Primary goal</Text>
          {GOALS.map(goal => {
            const selected = primaryGoal === goal.value;
            return (
              <TouchableOpacity
                key={goal.value}
                style={[styles.optionCard, selected && styles.optionCardSelected]}
                onPress={() => setPrimaryGoal(goal.value)}
              >
                <Text
                  style={[
                    styles.optionTitle,
                    selected && styles.optionTitleSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {(primaryGoal === 'weight_loss' || primaryGoal === 'weight_gain') && (
            <>
              <Text style={styles.label}>Target weight (optional)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={targetInput}
                onChangeText={setTargetInput}
                placeholder={measurementSystem === 'imperial' ? 'lb' : 'kg'}
                placeholderTextColor={colors.placeHolderGray}
              />
            </>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Track menstrual cycle</Text>
              <Text style={styles.helper}>
                Personalize nutrition and movement by cycle phase
              </Text>
            </View>
            <Switch
              value={isTrackingCycle}
              onValueChange={setIsTrackingCycle}
              trackColor={{ false: '#E8E8E8', true: colors.heading }}
              thumbColor="#fff"
            />
          </View>

          {isTrackingCycle && (
            <>
              <Text style={styles.label}>Average cycle length</Text>
              <View style={styles.chipRow}>
                {CYCLE_LENGTHS.map(days => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.chip,
                      cycleLength === String(days) && styles.chipSelected,
                    ]}
                    onPress={() => setCycleLength(String(days))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        cycleLength === String(days) && styles.chipTextSelected,
                      ]}
                    >
                      {days}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Average period length</Text>
              <View style={styles.chipRow}>
                {PERIOD_LENGTHS.map(days => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.chip,
                      periodLength === String(days) && styles.chipSelected,
                    ]}
                    onPress={() => setPeriodLength(String(days))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        periodLength === String(days) && styles.chipTextSelected,
                      ]}
                    >
                      {days}d
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Last period start</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setPeriodModalType('start');
                  setShowPeriodModal(true);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {lastPeriodStartDate
                    ? formatDate(lastPeriodStartDate)
                    : 'Select start date'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label}>Last period end</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setPeriodModalType('end');
                  setShowPeriodModal(true);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {lastPeriodEndDate
                    ? formatDate(lastPeriodEndDate)
                    : 'Select end date'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Button title="Save Changes" onPress={handleSave} loader={saving} />
      </KeyboardAwareScrollView>

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
                flow: 'medium',
                symptoms: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as any)
            : null
        }
      />
    </SafeAreaView>
  );
}

export function formatGoalLabel(goal?: string | null): string {
  const match = GOALS.find(g => g.value === goal);
  return match?.label ?? 'Not set';
}
