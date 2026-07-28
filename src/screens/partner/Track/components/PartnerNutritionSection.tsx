import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import images from '../../../../constants/images';
import { colors } from '../../../../constants/colors';
import {
  fetchWeeklyNutritionPlansForWeek,
  getMondayOfWeek,
  toLocalYyyyMmDd,
  weeklyPlanRowsForNutritionUi,
  type WeeklyPlanRow,
  type WeeklyPlanningStatus,
} from '../../../../utils/weeklyNutritionDisplay';
import { partnerTrackStyles as styles } from '../style';

type Props = {
  partnerName: string;
  partnerNamePossessive: string;
  refreshToken?: number;
};

export default function PartnerNutritionSection({
  partnerName,
  partnerNamePossessive,
  refreshToken = 0,
}: Props) {
  const [expandedDay, setExpandedDay] = useState('');
  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanRow[]>([]);
  const [planningStatus, setPlanningStatus] =
    useState<WeeklyPlanningStatus>('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);
  const hasCompletedInitialLoad = useRef(false);

  const hasWeeklyPlan = planningStatus === 'generated';

  const loadWeek = useCallback(async (skipLoadingState = false) => {
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      setError(null);

      const monday = getMondayOfWeek();
      const legacyWeekStartIso = toLocalYyyyMmDd(monday);
      const result = await fetchWeeklyNutritionPlansForWeek(legacyWeekStartIso);

      setPlanningStatus(result.planningStatus);

      const week = weeklyPlanRowsForNutritionUi(result.data, result.weekKey);
      setWeeklyPlans(week);

      if (!hasInitialized.current && week.length > 0) {
        const todayEntry = week.find(d => d.isToday)?.label || week[0].label;
        setExpandedDay(todayEntry);
        hasInitialized.current = true;
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Unable to load nutrition plan.';
      setError(message);
    } finally {
      if (!skipLoadingState) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const skipLoadingState = hasCompletedInitialLoad.current;
      hasCompletedInitialLoad.current = true;
      loadWeek(skipLoadingState).catch(() => {});
    }, [loadWeek]),
  );

  React.useEffect(() => {
    if (refreshToken > 0) {
      loadWeek(true).catch(() => {});
    }
  }, [refreshToken, loadWeek]);

  const todayPhaseLabel = useMemo(() => {
    if (!hasWeeklyPlan) {
      if (planningStatus === 'skipped') {
        return 'Weekly plan skipped';
      }
      return 'No meal plan this week';
    }
    const todayPlan = weeklyPlans.find(d => d.isToday && d.plan)?.plan;
    if (!todayPlan) return `${partnerNamePossessive} nutrition today`;

    if (todayPlan.isPregnant) return 'Nourishing parent & baby';
    if (todayPlan.isBreastfeeding) return 'Breastfeeding nutrition';
    if (todayPlan.isPostpartum) return 'Postpartum recovery nutrition';

    const phase = todayPlan.phase;
    if (phase === 'follicular') return 'Follicular phase focus';
    if (phase === 'menstrual') return 'Menstrual phase support';
    if (phase === 'ovulatory') return 'Ovulatory phase glow';
    if (phase === 'luteal') return 'Luteal phase nourish';
    return 'Cycle-aware nutrition';
  }, [weeklyPlans, hasWeeklyPlan, planningStatus, partnerNamePossessive]);

  const todaySubheading = useMemo(() => {
    if (!hasWeeklyPlan) {
      if (planningStatus === 'skipped') {
        return `${partnerName} skipped weekly meal planning this week.`;
      }
      return `${partnerName} hasn't set up a weekly meal plan yet.`;
    }
    return `Meals personalized for ${partnerNamePossessive} cycle and preferences.`;
  }, [hasWeeklyPlan, planningStatus, partnerName, partnerNamePossessive]);

  return (
    <View style={styles.sectionContent}>
      <View style={styles.container2}>
        <View style={styles.todayHeader}>
          <Image source={images.nutritionApple} style={styles.appleIcon} />
          <Text style={styles.todayHeading}>Today&apos;s Nutrition</Text>
        </View>
        <View style={styles.todayInnerBox}>
          <Text style={styles.phaseLabel}>{todayPhaseLabel}</Text>
          <Text style={styles.phaseSubheading}>{todaySubheading}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Weekly Meal Plan</Text>

      {loading ? (
        <Text style={styles.mutedText}>Loading meal plan...</Text>
      ) : null}
      {error && !loading ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {!loading && !error && !hasWeeklyPlan ? (
        <View style={styles.container2}>
          <Text style={styles.emptyBody}>{todaySubheading}</Text>
        </View>
      ) : null}

      {!loading && hasWeeklyPlan
        ? weeklyPlans.map(day => (
            <View
              key={day.isoDate}
              style={[
                styles.dayContainer,
                expandedDay === day.label && { borderColor: colors.heading },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  setExpandedDay(day.label === expandedDay ? '' : day.label)
                }
                style={styles.dayHeader}
                activeOpacity={0.7}
              >
                <View style={styles.dayHeaderLeftRow}>
                  <View>
                    <Text style={styles.dayTitle}>{day.label}</Text>
                    <Text style={styles.dateTitle}>{day.isoDate}</Text>
                  </View>
                  {day.isToday ? (
                    <View style={styles.todayTag}>
                      <Text style={styles.todayTagText}>Today</Text>
                    </View>
                  ) : null}
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
                day.plan.timeSlots.length > 0 &&
                day.plan.timeSlots.map((slot, i) => {
                  const active =
                    slot.options[slot.selectedOptionIndex] || slot.options[0];
                  if (!active) return null;
                  return (
                    <View key={`${slot.time}-${i}`} style={styles.mealCard}>
                      <View style={styles.mealRow}>
                        <Image
                          source={
                            slot.completed
                              ? images.orangeCheckBoxOn
                              : images.orangeCheckBoxOff
                          }
                          style={styles.dot}
                        />
                        <Text style={styles.mealTime}>{slot.time}</Text>
                      </View>
                      <Text style={styles.mealTitle}>{active.title}</Text>
                      <Text style={styles.mealDesc}>{active.description}</Text>
                      <Text style={styles.macroText}>
                        P: {active.protein}g&nbsp;&nbsp;C: {active.carbs}g
                        &nbsp;&nbsp;F: {active.fat}g
                      </Text>
                    </View>
                  );
                })}
            </View>
          ))
        : null}
    </View>
  );
}
