import React, { useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import images from '../../constants/images/track';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  NutritionTimeSlot,
  setMealCompletedApi,
} from '../../services/api';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import {
  fetchWeeklyNutritionPlansForWeek,
  getMondayOfWeek,
  toLocalYyyyMmDd,
  weeklyPlanRowsForNutritionUi,
  type WeeklyPlanRow,
  type WeeklyPlanningStatus,
} from '../../utils/weeklyNutritionDisplay';
import { CacheKeys, removeCachedData } from '../../services/cache';
import WeeklyMealPlanEmptyCard from '../WeeklyMealPlanEmptyCard';

type WeeklyPlan = WeeklyPlanRow;

export default function Nutrition() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [expandedDay, setExpandedDay] = useState<string>('');
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [planningStatus, setPlanningStatus] =
    useState<WeeklyPlanningStatus>('none');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const hasCompletedInitialLoad = useRef(false);

  const hasWeeklyPlan = planningStatus === 'generated';

  const loadWeek = useCallback(async (skipLoadingState: boolean = false) => {
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      setError(null);

      const monday = getMondayOfWeek();
      const legacyWeekStartIso = toLocalYyyyMmDd(monday);

      const result = await fetchWeeklyNutritionPlansForWeek(
        legacyWeekStartIso,
      );

      setPlanningStatus(result.planningStatus);

      const week: WeeklyPlan[] = weeklyPlanRowsForNutritionUi(
        result.data,
        result.weekKey,
      );

      setWeeklyPlans(week);

      if (!hasInitialized.current && week.length > 0) {
        const todayEntry =
          week.find(d => d.isToday)?.label || week[0].label;
        setExpandedDay(todayEntry);
        hasInitialized.current = true;
      }
    } catch (e: any) {
      setError(e?.message || 'Unable to load nutrition plan.');
    } finally {
      if (!skipLoadingState) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWeek(true);
  }, [loadWeek]);

  useFocusEffect(
    useCallback(() => {
      const skipLoadingState = hasCompletedInitialLoad.current;
      hasCompletedInitialLoad.current = true;
      loadWeek(skipLoadingState).catch(() => {});
    }, [loadWeek]),
  );

  const handleToggleMealCheck = async (
    day: WeeklyPlan,
    slot: NutritionTimeSlot,
    slotIndex: number,
  ) => {
    const newCompleted = !slot.completed;
    setWeeklyPlans(prev =>
      prev.map(d => {
        if (d.isoDate !== day.isoDate || !d.plan) {
          return d;
        }
        const updatedSlots = d.plan.timeSlots.map((s, idx) =>
          idx === slotIndex ? { ...s, completed: newCompleted } : s,
        );
        return { ...d, plan: { ...d.plan, timeSlots: updatedSlots } };
      }),
    );

    try {
      const res = await setMealCompletedApi(day.isoDate, {
        time: slot.time,
        completed: newCompleted,
      });
      if (res.fastingAutoEnded) {
        Alert.alert(
          'Fast ended',
          'Your fast ended because you logged a meal.',
        );
      }
      const cacheMonday = toLocalYyyyMmDd(getMondayOfWeek());
      await removeCachedData(CacheKeys.weeklyNutritionPlan(cacheMonday));
    } catch {
      setWeeklyPlans(prev =>
        prev.map(d => {
          if (d.isoDate !== day.isoDate || !d.plan) {
            return d;
          }
          const updatedSlots = d.plan.timeSlots.map((s, idx) =>
            idx === slotIndex ? { ...s, completed: !newCompleted } : s,
          );
          return { ...d, plan: { ...d.plan, timeSlots: updatedSlots } };
        }),
      );
    }
  };

  const todayPhaseLabel = useMemo(() => {
    if (!hasWeeklyPlan) {
      return planningStatus === 'skipped'
        ? 'Weekly plan not set up'
        : 'Plan your week to get started';
    }
    const todayPlan = weeklyPlans.find(d => d.isToday && d.plan)?.plan;
    if (!todayPlan) return "Today's Nutrition";

    if (todayPlan.isPregnant) return 'Nourishing You & Baby';
    if (todayPlan.isBreastfeeding) return 'Breastfeeding Nutrition';
    if (todayPlan.isPostpartum) return 'Postpartum Recovery Nutrition';

    const phase = todayPlan.phase;
    if (phase === 'follicular') return 'Follicular Phase Focus';
    if (phase === 'menstrual') return 'Menstrual Phase Support';
    if (phase === 'ovulatory') return 'Ovulatory Phase Glow';
    if (phase === 'luteal') return 'Luteal Phase Nourish';
    return 'Cycle-Aware Nutrition';
  }, [weeklyPlans, hasWeeklyPlan, planningStatus]);

  const todaySubheading = useMemo(() => {
    if (!hasWeeklyPlan) {
      return planningStatus === 'skipped'
        ? 'Generate a weekly plan to see cycle-aware meals for each day.'
        : 'Your personalized Mon–Sun meal plan and grocery list start here.';
    }
    return 'Personalized meal plan based on your cycle, goals, and preferences.';
  }, [hasWeeklyPlan, planningStatus]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <Image source={images.nutritionApple} style={styles.appleIcon} />
          <Text style={styles.todayHeading}>Today’s Nutrition</Text>
        </View>

        <View style={styles.todayInnerBox}>
          <Text style={styles.heading}>{todayPhaseLabel}</Text>
          <Text style={[styles.subHeading, styles.subHeadingGreen]}>
            {todaySubheading}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Weekly Meal Plan</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('WeeklyMealOverview')}
        >
          <Text style={styles.actionBtnText}>Weekly Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('GroceryList')}
        >
          <Text style={styles.actionBtnText}>Grocery List</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <Text style={styles.subHeading}>Loading your meal plan...</Text>
      )}
      {error && !loading && (
        <Text style={[styles.subHeading, styles.errorText]}>{error}</Text>
      )}

      {!loading && !error && !hasWeeklyPlan ? (
        <WeeklyMealPlanEmptyCard
          planningStatus={planningStatus}
          onPlanPress={() => navigation.navigate('WeeklyMealPlanning')}
        />
      ) : null}

      {!loading && hasWeeklyPlan
        ? weeklyPlans.map(day => (
            <View
              key={day.isoDate}
              style={
                expandedDay === day.label
                  ? [styles.dayContainer, { borderColor: colors.heading }]
                  : styles.dayContainer
              }
            >
              <TouchableOpacity
                onPress={() =>
                  setExpandedDay(day.label === expandedDay ? '' : day.label)
                }
                style={styles.dayHeader}
              >
                <View style={styles.dayHeaderLeftRow}>
                  <View>
                    <Text style={styles.dayTitle}>{day.label}</Text>
                    <Text style={styles.dateTitle}>{day.isoDate}</Text>
                  </View>
                  {day.isToday && (
                    <View style={styles.todayTag}>
                      <Text style={styles.todayTagText}>Today</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.dayCount}>
                  {day.plan
                    ? day.plan.timeSlots.filter(s => s.completed).length
                    : 0}
                  / {day.plan ? day.plan.timeSlots.length : 0}
                </Text>
              </TouchableOpacity>

              {expandedDay === day.label &&
                day.plan &&
                day.plan.timeSlots.length > 0 && (
                  <View>
                    {day.plan.timeSlots.map((slot, i) => {
                      const active =
                        slot.options[slot.selectedOptionIndex] ||
                        slot.options[0];
                      if (!active) return null;
                      return (
                        <View key={slot.time} style={styles.mealCard}>
                          <View style={styles.rowBetween}>
                            <View style={styles.row}>
                              <TouchableOpacity
                                style={styles.dotTextMainView}
                                onPress={() =>
                                  handleToggleMealCheck(day, slot, i)
                                }
                              >
                                <Image
                                  source={
                                    slot.completed
                                      ? images.orangeCheckBoxOn
                                      : images.orangeCheckBoxOff
                                  }
                                  style={styles.dot}
                                />
                                <Text style={styles.mealTime}>{slot.time}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          <Text style={styles.mealTitle}>{active.title}</Text>
                          <Text style={styles.mealDesc}>
                            {active.description}
                          </Text>

                          <Text style={styles.macroText}>
                            P: {active.protein}g&nbsp;&nbsp;C:{active.carbs}g
                            &nbsp;&nbsp;F: {active.fat}g
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
            </View>
          ))
        : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appleIcon: {
    width: 22,
    height: 22,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  subHeading: {
    color: colors.disabledText,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  subHeadingGreen: {
    color: colors.green,
    marginTop: 4,
  },
  errorText: {
    color: '#C62828',
  },

  todayContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 15,
    borderRadius: 12,
    marginVertical: 18,
  },

  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  todayHeading: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  todayInnerBox: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8EB',
  },
  actionBtnText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  dayContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginTop: 12,
    overflow: 'hidden',
  },

  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  dayHeaderLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dayTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    flex: 1,
  },

  dateTitle: {
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.green,
    flex: 1,
  },

  todayTag: {
    backgroundColor: colors.heading,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },

  todayTagText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
  },

  dayCount: {
    color: colors.black,
    fontSize: 12,
    fontFamily: 'PlayfairDisplay-Medium',
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 3,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: colors.borderColor,
  },

  mealCard: {
    padding: 15,
    borderWidth: 1,
    marginVertical: 7,
    width: sizes.screenWidth * 0.85,
    alignSelf: 'center',
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.04,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 12,
    height: 12,
    marginRight: 6,
    resizeMode: 'contain',
  },

  dotTextMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  mealTime: {
    color: colors.heading,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  mealTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginTop: 5,
    width: sizes.screenWidth * 0.6,
  },

  mealDesc: {
    fontSize: 12,
    color: colors.green,
    marginTop: 3,
    fontFamily: 'Inter-Regular',
  },

  macroText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 6,
  },
});
