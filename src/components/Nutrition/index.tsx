import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import {
  DailyMealPlan,
  NutritionTimeSlot,
  getDailyNutritionPlan,
  getWeeklyNutritionPlan,
  setMealCompletedApi,
  swapMealOptionApi,
} from '../../services/api';

type WeeklyPlan = {
  isoDate: string;
  label: string;
  isToday: boolean;
  plan: DailyMealPlan | null;
};

const formatDateLabel = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const getDayName = (date: Date) => {
  return date.toLocaleDateString(undefined, { weekday: 'long' });
};

export default function Nutrition() {
  const [expandedDay, setExpandedDay] = useState<string>('');
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  const loadWeek = useCallback(async (skipLoadingState: boolean = false) => {
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      setError(null);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = formatDateLabel(today);

      // Fetch all 5 days in a single batch call
      const res = await getWeeklyNutritionPlan(startDate);

      if (!res.success || !res.data || !Array.isArray(res.data)) {
        throw new Error('Invalid response from server');
      }

      const week: WeeklyPlan[] = res.data.map((plan, index) => {
        const d = new Date(today);
        d.setDate(today.getDate() + index);
        const isoDate = formatDateLabel(d);

        return {
          isoDate,
          label: getDayName(d),
          isToday: d.getTime() === today.getTime(),
          plan: plan,
        };
      });

      setWeeklyPlans(week);
      
      // Only set expandedDay on initial load
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

  useEffect(() => {
    loadWeek();
  }, [loadWeek]); // Only run on mount, not when expandedDay changes

  const handleToggleMealCheck = async (
    day: WeeklyPlan,
    slot: NutritionTimeSlot,
    slotIndex: number,
  ) => {
    const newCompleted = !slot.completed;
    // Optimistic update
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
      await setMealCompletedApi(day.isoDate, {
        time: slot.time,
        completed: newCompleted,
      });
    } catch {
      // Revert on failure
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

  const handleSwap = async (day: WeeklyPlan, slot: NutritionTimeSlot, slotIndex: number) => {
    // Optimistic update: cycle selected option locally
    setWeeklyPlans(prev =>
      prev.map(d => {
        if (d.isoDate !== day.isoDate || !d.plan) {
          return d;
        }
        const updatedSlots = d.plan.timeSlots.map((s, idx) => {
          if (idx !== slotIndex) return s;
          if (!s.options || s.options.length === 0) return s;
          const nextIndex = (s.selectedOptionIndex + 1) % s.options.length;
          return { ...s, selectedOptionIndex: nextIndex };
        });
        return { ...d, plan: { ...d.plan, timeSlots: updatedSlots } };
      }),
    );

    try {
      await swapMealOptionApi(day.isoDate, { time: slot.time });
    } catch {
      // On failure, reload that day's plan
      try {
        const res = await getDailyNutritionPlan(day.isoDate);
        setWeeklyPlans(prev =>
          prev.map(d =>
            d.isoDate === day.isoDate ? { ...d, plan: res.data } : d,
          ),
        );
      } catch {
        // swallow; UI already shows something reasonable
      }
    }
  };

  const todayPhaseLabel = useMemo(() => {
    const todayPlan = weeklyPlans.find(d => d.isToday && d.plan)?.plan;
    if (!todayPlan) return "Today's Nutrition";
    
    // Check pregnancy/breastfeeding/postpartum status first (these take priority)
    if (todayPlan.isPregnant) return 'Nourishing You & Baby';
    if (todayPlan.isBreastfeeding) return 'Breastfeeding Nutrition';
    if (todayPlan.isPostpartum) return 'Postpartum Recovery Nutrition';
    
    // Fall back to cycle phase labels
    const phase = todayPlan.phase;
    if (phase === 'follicular') return 'Follicular Phase Focus';
    if (phase === 'menstrual') return 'Menstrual Phase Support';
    if (phase === 'ovulatory') return 'Ovulatory Phase Glow';
    if (phase === 'luteal') return 'Luteal Phase Nourish';
    return 'Cycle-Aware Nutrition';
  }, [weeklyPlans]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* <View style={styles.topContainer}>
        <View style={styles.iconCircle}>
          <Image source={images.mindfulIcon} style={styles.icon} />
        </View>

        <View style={{ marginLeft: 7 }}>
          <Text style={styles.heading}>Synced to 21-Day Detox Challenge</Text>
          <Text style={styles.subHeading}>
            Your meals are optimized for Day 8 • Week 2
          </Text>
        </View>
      </View> */}

      <View style={styles.todayContainer}>
        <View style={styles.todayHeader}>
          <Image source={images.nutritionApple} style={styles.appleIcon} />
          <Text style={styles.todayHeading}>Today’s Nutrition</Text>
        </View>

        <View style={styles.todayInnerBox}>
          <Text style={styles.heading}>{todayPhaseLabel}</Text>
          <Text
            style={[styles.subHeading, { color: colors.green, marginTop: 4 }]}
          >
            Personalized meal plan based on your cycle, goals, and preferences.
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle]}>Weekly Meal Plan</Text>

      {loading && (
        <Text style={styles.subHeading}>Loading your meal plan...</Text>
      )}
      {error && !loading && (
        <Text style={[styles.subHeading, { color: 'red' }]}>{error}</Text>
      )}

      {weeklyPlans.map(day => (
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                    <TouchableOpacity
                      style={styles.swapMainView}
                      onPress={() => handleSwap(day, slot, i)}
                    >
                      <Image source={images.swapIcon} style={styles.swapIcon}/>
                      <Text style={styles.swapText}>Swap</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.mealTitle}>{active.title}</Text>
                  <Text style={styles.mealDesc}>{active.description}</Text>

                  <Text style={styles.macroText}>
                    P: {active.protein}g&nbsp;&nbsp;C:{active.carbs}g&nbsp;&nbsp;F:{' '}
                    {active.fat}g
                  </Text>
                </View>
                  );
                })}
              </View>
            )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    flexDirection: 'row',
    height: sizes.screenHeight * 0.09,
    alignItems: 'center',
    paddingLeft: 7,
    marginTop: 20,
  },

  iconCircle: {
    backgroundColor: '#F9EBD6',
    width: 30,
    height: 30,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 14,
    height: 14,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },
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

  swapMainView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between', 
    width:sizes.screenWidth * 0.14,
  },

  swapIcon:{
    resizeMode:'contain',
    width:sizes.screenWidth * 0.035,
    height:sizes.screenWidth * 0.035
  },

  swapText: {
    fontSize: 13,
    color: colors.black,
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
