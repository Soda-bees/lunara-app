import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import {
  getWeeklyPlanning,
  type WeeklyMealPlanning,
  type WeeklyMealPlanDay,
} from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import BackButton from '../../components/BackButton';
import WeeklyMealPlanEmptyCard from '../../components/WeeklyMealPlanEmptyCard';
import type { WeeklyPlanningStatus } from '../../utils/weeklyNutritionDisplay';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WeeklyMealOverview'
>;

export default function WeeklyMealOverviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<WeeklyMealPlanning | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWeeklyPlanning();
      setPlan(res.data.weeklyPlan);
    } catch (e: any) {
      setError(e?.message || 'Unable to load weekly meal plan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasWeeklyPlan = plan?.status === 'generated';

  const planningStatus: WeeklyPlanningStatus = useMemo(() => {
    if (plan?.status === 'generated') return 'generated';
    if (plan?.status === 'skipped') return 'skipped';
    return 'none';
  }, [plan?.status]);

  const weekLabel = useMemo(() => {
    if (!plan?.weekStart || !plan?.weekEnd) return '';
    return `${new Date(plan.weekStart).toDateString()} - ${new Date(
      plan.weekEnd,
    ).toDateString()}`;
  }, [plan?.weekStart, plan?.weekEnd]);

  const renderDay = (day: WeeklyMealPlanDay) => {
    return (
      <View key={day.date} style={styles.dayCard}>
        <Text style={styles.dayTitle}>
          {new Date(day.date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        {(day.timeSlots || []).map(slot => {
          const active =
            slot.options?.[slot.selectedOptionIndex] || slot.options?.[0];
          if (!active) return null;
          return (
            <View key={`${day.date}_${slot.time}`} style={styles.slotRow}>
              <Text style={styles.slotTime}>
                {slot.time} - {slot.label}
              </Text>
              <Text style={styles.slotMeal}>{active.title}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Weekly Meal Plan Overview</Text>
        {!!weekLabel && hasWeeklyPlan && (
          <Text style={styles.subTitle}>{weekLabel}</Text>
        )}

        {hasWeeklyPlan ? (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('WeeklyMealPlanning')}
            >
              <Text style={styles.actionText}>Regenerate Plan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('GroceryList')}
            >
              <Text style={styles.actionText}>Open Grocery List</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {loading ? <ActivityIndicator color={colors.heading} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!loading && !error && !hasWeeklyPlan ? (
          <WeeklyMealPlanEmptyCard
            planningStatus={planningStatus}
            onPlanPress={() => navigation.navigate('WeeklyMealPlanning')}
          />
        ) : null}

        {!loading && hasWeeklyPlan
          ? (plan?.days || []).map(renderDay)
          : null}

        {!loading && hasWeeklyPlan ? (
          <TouchableOpacity
            style={[styles.actionBtn, styles.groceryLink]}
            onPress={() => navigation.navigate('GroceryList')}
          >
            <Text style={styles.actionText}>Open Grocery List</Text>
          </TouchableOpacity>
        ) : null}
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
    marginTop: 4,
    marginBottom: 12,
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },
  actions: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF8EB',
  },
  actionText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  groceryLink: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  dayCard: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dayTitle: {
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 8,
  },
  slotRow: { marginBottom: 7 },
  slotTime: { fontFamily: 'Inter-Medium', color: colors.green, fontSize: 12 },
  slotMeal: { fontFamily: 'Inter-Regular', color: colors.black, fontSize: 12 },
  error: { color: '#C62828', fontFamily: 'Inter-Regular' },
});
