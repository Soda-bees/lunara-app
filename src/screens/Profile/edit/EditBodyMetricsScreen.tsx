import React, { useEffect, useState } from 'react';
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/BackButton';
import Button from '../../../components/Button';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import { getMe, updateProfile } from '../../../services/api';
import {
  bodyWeightKgFromInput,
  cmToInches,
  DEFAULT_MEASUREMENT_SYSTEM,
  formatHeight,
  formatWeight,
  heightCmFromInchesInput,
  heightCmFromMetricInput,
  kgToLb,
  round1,
  targetWeightKgFromInput,
  type MeasurementSystem,
} from '../../../utils/measurement';
import { colors } from '../../../constants/colors';
import styles from './editStyles';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfileBody'>;

export default function EditBodyMetricsScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState<MeasurementSystem>(
    DEFAULT_MEASUREMENT_SYSTEM,
  );
  const [heightCmText, setHeightCmText] = useState('');
  const [weightKgText, setWeightKgText] = useState('');
  const [heightInchesText, setHeightInchesText] = useState('');
  const [weightLbText, setWeightLbText] = useState('');
  const [targetInput, setTargetInput] = useState('');

  useEffect(() => {
    getMe()
      .then(res => {
        if (!res.success || !res.user) {
          return;
        }
        const user = res.user;
        const sys = user.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;
        setMeasurementSystem(sys);
        if (user.heightCm != null) {
          setHeightCmText(String(Math.round(user.heightCm)));
          setHeightInchesText(String(round1(cmToInches(user.heightCm))));
        }
        if (user.weightKg != null) {
          setWeightKgText(String(round1(user.weightKg)));
          setWeightLbText(String(round1(kgToLb(user.weightKg))));
        }
        if (user.targetWeightKg != null) {
          setTargetInput(
            sys === 'imperial'
              ? String(round1(kgToLb(user.targetWeightKg)))
              : String(round1(user.targetWeightKg)),
          );
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Could not load your profile.');
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleMeasurementSystem = (next: MeasurementSystem) => {
    if (next === measurementSystem) {
      return;
    }
    if (next === 'imperial') {
      const cm = heightCmFromMetricInput(heightCmText);
      const kg = bodyWeightKgFromInput(weightKgText, 'metric');
      if (cm != null) {
        setHeightInchesText(String(round1(cmToInches(cm))));
      }
      if (kg != null) {
        setWeightLbText(String(round1(kgToLb(kg))));
      }
      if (targetInput.trim()) {
        const targetKg = targetWeightKgFromInput(targetInput, 'metric');
        if (targetKg != null) {
          setTargetInput(String(round1(kgToLb(targetKg))));
        }
      }
    } else {
      const cm = heightCmFromInchesInput(heightInchesText);
      const kg = bodyWeightKgFromInput(weightLbText, 'imperial');
      if (cm != null) {
        setHeightCmText(String(Math.round(cm)));
      }
      if (kg != null) {
        setWeightKgText(String(round1(kg)));
      }
      if (targetInput.trim()) {
        const targetKg = targetWeightKgFromInput(targetInput, 'imperial');
        if (targetKg != null) {
          setTargetInput(String(round1(targetKg)));
        }
      }
    }
    setMeasurementSystem(next);
  };

  const handleSave = async () => {
    const heightCm =
      measurementSystem === 'metric'
        ? heightCmFromMetricInput(heightCmText)
        : heightCmFromInchesInput(heightInchesText);
    const weightKg =
      measurementSystem === 'metric'
        ? bodyWeightKgFromInput(weightKgText, 'metric')
        : bodyWeightKgFromInput(weightLbText, 'imperial');

    if (heightCm == null || weightKg == null) {
      Alert.alert(
        'Check your entries',
        'Enter valid height and weight within the supported range.',
      );
      return;
    }

    let targetWeightKg: number | undefined;
    if (targetInput.trim() !== '') {
      const parsed = targetWeightKgFromInput(targetInput, measurementSystem);
      if (parsed == null) {
        Alert.alert(
          'Check target weight',
          measurementSystem === 'imperial'
            ? 'Enter a valid target weight in pounds.'
            : 'Enter a valid target weight in kilograms.',
        );
        return;
      }
      targetWeightKg = parsed;
    }

    setSaving(true);
    try {
      const res = await updateProfile({
        measurementSystem,
        heightCm,
        weightKg,
        targetWeightKg,
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
        <Text style={styles.title}>Body Metrics</Text>
        <Text style={styles.subtitle}>
          Update your height, weight, and preferred units.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Units</Text>
          <View style={styles.unitRow}>
            {(['metric', 'imperial'] as MeasurementSystem[]).map(unit => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitPill,
                  measurementSystem === unit && styles.unitPillActive,
                ]}
                onPress={() => toggleMeasurementSystem(unit)}
              >
                <Text
                  style={[
                    styles.unitPillText,
                    measurementSystem === unit && styles.unitPillTextActive,
                  ]}
                >
                  {unit === 'metric' ? 'Metric' : 'Imperial'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {measurementSystem === 'metric' ? (
            <>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={heightCmText}
                onChangeText={setHeightCmText}
                placeholder="cm"
                placeholderTextColor={colors.placeHolderGray}
              />
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={weightKgText}
                onChangeText={setWeightKgText}
                placeholder="kg"
                placeholderTextColor={colors.placeHolderGray}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Height (inches)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={heightInchesText}
                onChangeText={setHeightInchesText}
                placeholder="Total inches"
                placeholderTextColor={colors.placeHolderGray}
              />
              <Text style={styles.label}>Weight (lb)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={weightLbText}
                onChangeText={setWeightLbText}
                placeholder="lb"
                placeholderTextColor={colors.placeHolderGray}
              />
            </>
          )}

          <Text style={styles.label}>Target weight (optional)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={targetInput}
            onChangeText={setTargetInput}
            placeholder={measurementSystem === 'imperial' ? 'lb' : 'kg'}
            placeholderTextColor={colors.placeHolderGray}
          />
        </View>

        <Button title="Save Changes" onPress={handleSave} loader={saving} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export function formatBodySummary(
  heightCm?: number | null,
  weightKg?: number | null,
  sys: MeasurementSystem = DEFAULT_MEASUREMENT_SYSTEM,
): string {
  const parts: string[] = [];
  if (heightCm != null) {
    parts.push(formatHeight(heightCm, sys));
  }
  if (weightKg != null) {
    parts.push(formatWeight(weightKg, sys));
  }
  return parts.length ? parts.join(' · ') : 'Not set';
}
