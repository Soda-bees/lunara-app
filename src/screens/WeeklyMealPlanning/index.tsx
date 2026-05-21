import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import {
  generateWeeklyPlanning,
  skipWeeklyPlanning,
  type WeeklyMealStructure,
} from '../../services/api';
import { CacheKeys, removeCachedData } from '../../services/cache';
import {
  getMondayOfWeek,
  toLocalYyyyMmDd,
} from '../../utils/weeklyNutritionDisplay';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import BackButton from '../../components/BackButton';

const options: Array<{ id: WeeklyMealStructure; label: string }> = [
  { id: '3_meals', label: '3 meals' },
  { id: '3_meals_1_snack', label: '3 meals + 1 snack' },
  { id: '3_meals_2_snacks', label: '3 meals + 2 snacks' },
];

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WeeklyMealPlanning'
>;

export default function WeeklyMealPlanningScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selected, setSelected] =
    useState<WeeklyMealStructure>('3_meals_2_snacks');
  const [loading, setLoading] = useState(false);

  const weekLabel = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const delta = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + delta);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return `${monday.toDateString()} - ${sunday.toDateString()}`;
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateWeeklyPlanning({ mealStructure: selected });
      const weekStart = toLocalYyyyMmDd(getMondayOfWeek());
      await removeCachedData(CacheKeys.weeklyNutritionPlan(weekStart));
      navigation.replace('WeeklyMealOverview');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to generate weekly plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setLoading(true);
      await skipWeeklyPlanning();
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Unable to skip weekly planning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Weekly Meal Planning</Text>
        <Text style={styles.subTitle}>Week: {weekLabel}</Text>

        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[styles.card, selected === option.id && styles.cardActive]}
            onPress={() => setSelected(option.id)}
            disabled={loading}
          >
            <Text style={styles.cardText}>{option.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Generating...' : 'Generate Weekly Plan'}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={handleSkip}
          disabled={loading}
          style={styles.skipBtn}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16 },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  subTitle: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardActive: {
    borderColor: colors.heading,
    backgroundColor: '#FFF8EB',
  },
  cardText: { color: colors.black, fontFamily: 'Inter-Medium' },
  button: {
    marginTop: 18,
    backgroundColor: colors.heading,
    borderRadius: sizes.screenWidth * 0.03,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontFamily: 'Inter-SemiBold' },
  skipBtn: { marginTop: 16, alignSelf: 'center' },
  skipText: { color: colors.darkGrey, fontFamily: 'Inter-Medium' },
});
