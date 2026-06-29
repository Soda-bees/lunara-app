import React, { JSX, useState, useEffect, useCallback } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../../components/Header';
import GradientWrapper from '../../../components/GradientWrapper';
import images from '../../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../../components/GradientText';
import { fontSize } from '../../../constants/fonts';
import CycleCalendar from '../../../components/CycleCalender';
import SymptomTrends from '../../../components/SymptomTrends';
import { colors } from '../../../constants/colors';
import PhaseGuide from '../../../components/PhaseGuide';
import CycleIndicatorCard from '../../../components/CycleIndicatorCard';
import {
  Period,
  getPregnancyStatus,
  PregnancyStatusResponse,
  getPregnancyHistory,
  PregnancySymptom,
  getWeeklyUpdatesByPhase,
  getDidYouKnowByPhase,
  getPersonalizedInsight,
  WeeklyUpdate,
  DidYouKnow,
} from '../../../services/api';
import moment from 'moment';
import { getPhaseDataStatus } from '../../../utils/cycleUtils';
import { getIconForType } from '../../../utils/phaseGuideUtils';
import { useCycleData } from '../../../context/CycleDataContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

const PHASE_NAMES: Record<string, string> = {
  menstrual: 'Menstrual Phase',
  follicular: 'Follicular Phase',
  ovulatory: 'Ovulatory Phase',
  luteal: 'Luteal Phase',
};

// Frontend fallback descriptions (used when backend doesn't provide)
const PHASE_DESCRIPTIONS: Record<string, string> = {
  menstrual:
    'This is your deep rest phase. Your body is shedding the uterine lining and working hard behind the scenes. Prioritize warmth, comfort, iron-rich foods, and gentle movement like stretching or slow walks.',
  follicular:
    'This is your time to shine! Estrogen is rising, bringing mental clarity, creativity, and increasing energy. Perfect for starting new projects, learning, and more intense workouts.',
  ovulatory:
    'You are at your peak energy and magnetism. Communication, social connection, and high-intensity workouts may feel especially natural and satisfying right now.',
  luteal:
    'Your body is shifting into a more reflective, inward phase. Progesterone is higher, and you may feel more sensitive or slower. Great time for nesting, organizing, and gentle strength or yoga.',
};

// Frontend fallback fertility taglines (used when backend doesn't provide)
const PHASE_TAGLINES: Record<string, string> = {
  menstrual: 'Low',
  follicular: 'Rising',
  ovulatory: 'High',
  luteal: 'Lower',
};

// Fallback data for weekly updates
const FALLBACK_WEEKLY_UPDATES: WeeklyUpdate[] = [
  {
    title: 'Energy Rising',
    message:
      'Your energy levels will continue increasing through day 14. Perfect for challenging workouts and social activities.',
    iconType: 'energy',
    color: '#FFF1DB',
    iconColor: '#000000', // Will be overridden by colors.heading in component
    order: 1,
  },
  {
    title: 'Mental Clarity Peak',
    message:
      'Days 10-14 bring peak cognitive function. Schedule important meetings and creative projects.',
    iconType: 'mental',
    color: '#E4EFFF',
    order: 2,
  },
  {
    title: 'Metabolism Boost',
    message:
      'Your metabolic rate is increasing. Great time for extended fasting windows (13-15h).',
    iconType: 'metabolism',
    color: '#FFDEE0',
    iconColor: '#D6757B',
    order: 3,
  },
];

// Fallback data for "Did You Know?"
const FALLBACK_DID_YOU_KNOW: DidYouKnow = {
  fact: 'Your basal body temperature naturally rises by 0.5-1°F after ovulation due to increased progesterone. Tracking this can help you understand your cycle patterns and optimize fertility awareness.',
  author: 'Dr. Jolene Brighten',
};

export default function PartnerCycleInsight() {
  const navigation = useNavigation<NavigationProp>();
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showCycleHistory, setShowCycleHistory] = useState(false);
  const [pregnancySymptoms, setPregnancySymptoms] = useState<
    PregnancySymptom[]
  >([]);
  const [weeklyUpdates, setWeeklyUpdates] = useState<WeeklyUpdate[]>([]);
  const [didYouKnow, setDidYouKnow] = useState<DidYouKnow | null>(null);
  const [personalizedInsight, setPersonalizedInsight] = useState<string | null>(
    null,
  );
  const [loadingWeeklyUpdates, setLoadingWeeklyUpdates] = useState(false);
  const [loadingDidYouKnow, setLoadingDidYouKnow] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { cycleStatus, periods, analytics, refreshCycleData } = useCycleData();
  const cycle = cycleStatus.data;
  const periodList = periods.data || [];
  const analyticsData = analytics.data;
  const loading = cycleStatus.loading || periods.loading || analytics.loading;
  const hasCycleData =
    !!cycle ||
    periodList.length > 0 ||
    !!analyticsData ||
    (isPregnant && pregnancyStatus);
  const latestPeriod = periodList.length > 0 ? periodList[0] : null;

  // Fetch cycle status, pregnancy status, and periods via shared store
  const fetchCycleData = useCallback(async () => {
    try {
      // Check pregnancy status first
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success && pregnancyResponse.data.isPregnant) {
        setIsPregnant(true);
        setPregnancyStatus(pregnancyResponse.data);
        // Still fetch symptoms for history
        const symptomsResponse = await getPregnancyHistory();
        if (symptomsResponse.success) {
          setPregnancySymptoms(symptomsResponse.data);
        }

        return;
      }
      setIsPregnant(false);
      setPregnancyStatus(null);

      await refreshCycleData();

      if (cycleStatus.data && cycleStatus.data.isTracking) {
        if (cycleStatus.data.lastPeriodStartDate) {
          setLastPeriodStart(new Date(cycleStatus.data.lastPeriodStartDate));
        }
        if (cycleStatus.data.phase) {
          fetchPhaseContent(cycleStatus.data.phase);
        }
      } else {
        setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
        setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      }
    } catch (error: any) {
      console.error('Error fetching cycle data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load cycle data. Please try again.',
      );
    }
  }, [refreshCycleData, cycleStatus.data]);

  // Background refresh on focus (only if stale) - silent, no loaders
  useFocusEffect(
    React.useCallback(() => {
      fetchCycleData();
    }, [fetchCycleData]),
  );

  // Pull-to-refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Refresh cycle data first
      await refreshCycleData({ force: true });

      // Also refresh pregnancy status
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success && pregnancyResponse.data.isPregnant) {
        setIsPregnant(true);
        setPregnancyStatus(pregnancyResponse.data);
        const symptomsResponse = await getPregnancyHistory();
        if (symptomsResponse.success) {
          setPregnancySymptoms(symptomsResponse.data);
        }
      } else {
        setIsPregnant(false);
        setPregnancyStatus(null);
      }

      // Refresh phase content using the cycle from context
      // The cycle variable is reactive and will be updated after refreshCycleData
      if (cycle && cycle.phase) {
        fetchPhaseContent(cycle.phase);
      }
    } catch (error) {
      console.error('Error refreshing cycle data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshCycleData, cycle]);

  // Fetch weekly updates and did you know based on current phase
  const fetchPhaseContent = async (phase: string) => {
    if (!phase || phase === 'unknown') {
      // Use fallback data
      setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      return;
    }

    try {
      setLoadingWeeklyUpdates(true);
      setLoadingDidYouKnow(true);

      // Fetch weekly updates, did you know, and personalized insight in parallel
      const [
        weeklyUpdatesResponse,
        didYouKnowResponse,
        personalizedInsightResponse,
      ] = await Promise.all([
        getWeeklyUpdatesByPhase(phase).catch(() => ({
          success: false,
          data: [],
        })),
        getDidYouKnowByPhase(phase).catch(() => ({
          success: false,
          data: FALLBACK_DID_YOU_KNOW,
        })),
        getPersonalizedInsight().catch(() => ({ success: false, data: null })),
      ]);

      // Set weekly updates
      if (
        weeklyUpdatesResponse.success &&
        weeklyUpdatesResponse.data.length > 0
      ) {
        setWeeklyUpdates(weeklyUpdatesResponse.data);
      } else {
        setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      }

      // Set personalized insight if available, otherwise use phase-specific fact
      if (
        personalizedInsightResponse.success &&
        personalizedInsightResponse.data?.insight
      ) {
        setPersonalizedInsight(personalizedInsightResponse.data.insight);
        setDidYouKnow(null);
      } else if (didYouKnowResponse.success && didYouKnowResponse.data.fact) {
        setPersonalizedInsight(null);
        setDidYouKnow(didYouKnowResponse.data);
      } else {
        setPersonalizedInsight(null);
        setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      }
    } catch (error) {
      console.error('Error fetching phase content:', error);
      // Use fallback data on error
      setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      setPersonalizedInsight(null);
    } finally {
      setLoadingWeeklyUpdates(false);
      setLoadingDidYouKnow(false);
    }
  };

  // Get phase display name
  const getPhaseDisplayName = (phase?: string): string => {
    if (!phase) return 'Unknown Phase';
    return (
      PHASE_NAMES[phase] ||
      phase.charAt(0).toUpperCase() + phase.slice(1) + ' Phase'
    );
  };

  // Get cycle day display text
  const getCycleDayText = (): string => {
    if (!cycle?.cycleDay) return 'Day 0';
    return `Day ${cycle.cycleDay}`;
  };

  // Get short fertility tagline (2–3 words) for quick insight
  // Priority: Backend fertilityLevel → Frontend fallback from phase → Default
  const getFertilityTagline = (phase?: string): string => {
    if (cycle?.fertilityLevel === 'high') return 'High';
    if (cycle?.fertilityLevel === 'medium') return 'Medium';
    if (cycle?.fertilityLevel === 'low') return 'Low';

    // Fallback to phase-based heuristic if fertilityLevel not provided
    if (phase && PHASE_TAGLINES[phase]) {
      return PHASE_TAGLINES[phase];
    }

    return 'Fertility awareness';
  };

  const getFertileWindowText = (): string => {
    // Prefer backend-provided fertile window dates
    if (cycle?.fertileWindowStart && cycle?.fertileWindowEnd) {
      const start = moment(cycle.fertileWindowStart).format('MMM D');
      const end = moment(cycle.fertileWindowEnd).format('MMM D');
      return `${start} – ${end}`;
    }

    // Fallback: estimate from lastPeriodStart and average cycle length
    if (!lastPeriodStart) return 'Fertile window not available';

    const fertileStart = moment(lastPeriodStart).clone().add(9, 'days');
    const fertileEnd = moment(lastPeriodStart).clone().add(14, 'days');

    return `${fertileStart.format('MMM D')} – ${fertileEnd.format('MMM D')}`;
  };

  const getFertilityDescription = (): string => {
    if (cycle?.fertilityDescription) {
      return cycle.fertilityDescription;
    }

    // Fallback based on phase if backend description not provided
    switch (cycle?.phase) {
      case 'menstrual':
        return 'Fertility is low while your body focuses on shedding the uterine lining and resetting for a new cycle.';
      case 'follicular':
        return 'Your fertile window is approaching. Hormones are rising and your body is preparing for ovulation.';
      case 'ovulatory':
        return 'You are near or at ovulation. This is typically the most fertile time of your cycle.';
      case 'luteal':
        return 'Ovulation has likely passed. Hormones shift toward progesterone, and fertility usually decreases.';
      default:
        return 'Track your cycle regularly to understand your unique fertile window and patterns.';
    }
  };

  // Get next period text
  const getNextPeriodText = (): string => {
    if (
      cycle?.daysUntilNextPeriod === null ||
      cycle?.daysUntilNextPeriod === undefined
    ) {
      return 'Unknown';
    }
    const days = cycle.daysUntilNextPeriod;
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const isOverdue =
    typeof cycle?.daysUntilNextPeriod === 'number' &&
    cycle.daysUntilNextPeriod < 0;

  const hasOngoingPeriod = !!(latestPeriod && !latestPeriod.endDate);

  const formatPeriodRange = (period: Period): string => {
    const start = moment(period.startDate).format('MMM D, YYYY');
    if (!period.endDate) {
      return `${start} – ongoing`;
    }
    const end = moment(period.endDate).format('MMM D, YYYY');
    return `${start} – ${end}`;
  };

  const getPeriodLengthLabel = (period: Period): string => {
    if (!period.endDate) return 'In progress';
    const start = moment(period.startDate).startOf('day');
    const end = moment(period.endDate).startOf('day');
    const days = end.diff(start, 'days') + 1;
    return `${days} day${days === 1 ? '' : 's'}`;
  };

  const getRegularityLabel = (): string => {
    if (!cycle?.regularityClassification) return '';
    const labels: Record<string, string> = {
      very_regular: 'Very Regular',
      regular: 'Regular',
      irregular: 'Irregular',
      very_irregular: 'Very Irregular',
      insufficient_data: 'Need More Data',
    };
    return labels[cycle?.regularityClassification || ''] || '';
  };

  const getDataQualityLabel = (): string => {
    if (!cycle?.dataQuality) return '';
    const labels: Record<string, string> = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      needs_improvement: 'Needs Improvement',
    };
    return labels[cycle?.dataQuality || ''] || '';
  };

  const getDataQualityColor = (): string => {
    if (!cycle?.dataQuality) return colors.darkGrey;
    const colors_map: Record<string, string> = {
      excellent: colors.green,
      good: '#4CAF50',
      fair: colors.heading,
      needs_improvement: '#F44336',
    };
    return colors_map[cycle?.dataQuality || ''] || colors.darkGrey;
  };

  // Show full-screen loader only on true cold start (no cached data yet)
  if (loading && !hasCycleData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header showBackButton />
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 10, color: colors.darkGrey }}>
            Loading cycle data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // If user is pregnant - show pregnancy dashboard + toggle for cycle history
  if (isPregnant && pregnancyStatus) {
    const getTrimesterText = (tri?: number) => {
      if (!tri) return '';
      switch (tri) {
        case 1:
          return 'First Trimester';
        case 2:
          return 'Second Trimester';
        case 3:
          return 'Third Trimester';
        default:
          return '';
      }
    };

    const getDaysText = (days: number | null | undefined) => {
      if (days === null || days === undefined) return '—';
      if (days > 0) return `${days} days to go`;
      if (days === 0) return 'Due date is today!';
      return `${Math.abs(days)} days past due date`;
    };

    const {
      pregnancyWeek = 0,
      trimester = 1,
      dueDate,
      daysUntilDueDate,
      babyDevelopment,
      trimesterInsights,
      progressPercentage = 0,
    } = pregnancyStatus;

    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header showBackButton />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 16 }}>
            <View style={styles.topContainer}>
              <Text style={styles.heading}>Insights</Text>
              <Text style={styles.subHeading}>
                Your complete health intelligence dashboard
              </Text>
            </View>

            {/* Pregnancy Dashboard Content */}
            <GradientWrapper variant="basic">
              <View style={styles.phaseBody}>
                <View style={styles.row}>
                  <Text style={styles.heading}>Pregnancy Progress</Text>
                </View>

                {/* Week and Trimester */}
                <View style={styles.cyclePhaseCard}>
                  <Text style={styles.spacedText}>PREGNANCY WEEK</Text>
                  <View style={styles.rowFull}>
                    <View style={styles.rowBottom}>
                      <GradientText fontSize={46} fontFamily="Inter-Regular">
                        {pregnancyWeek || '—'}
                      </GradientText>
                      <Text style={[styles.numberTextMedium, { top: 8 }]}>
                        {' '}
                        / 40
                      </Text>
                    </View>
                    <View style={styles.dayTextContainer}>
                      <Text style={styles.textBlackNormal}>
                        {getTrimesterText(trimester)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.progressIndicator}>
                    <LinearGradient
                      style={[
                        styles.progress,
                        {
                          width: `${progressPercentage}%`,
                        },
                      ]}
                      colors={['#E4AF5D', '#E799AD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  {dueDate && (
                    <Text style={styles.textDarkGrey}>
                      Due date: {moment(dueDate).format('MMMM D, YYYY')} (
                      {getDaysText(daysUntilDueDate)})
                    </Text>
                  )}
                </View>

                {/* Baby Development */}
                {babyDevelopment && (
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                    <Text style={styles.babySizeText}>
                      Size of a {babyDevelopment.size}
                    </Text>
                    <Text style={styles.textDarkGrey}>
                      {babyDevelopment.development}
                    </Text>
                  </View>
                )}

                {/* Trimester Insights */}
                {trimesterInsights && (
                  <>
                    {/* Nutrition */}
                    {trimesterInsights.nutrition &&
                      trimesterInsights.nutrition.length > 0 && (
                        <View style={styles.cyclePhaseCard}>
                          <Text style={styles.spacedText}>NUTRITION</Text>
                          {trimesterInsights.nutrition.map((item, index) => (
                            <Text key={index} style={styles.insightItem}>
                              • {item}
                            </Text>
                          ))}
                        </View>
                      )}

                    {/* Exercise */}
                    {trimesterInsights.exercise &&
                      trimesterInsights.exercise.length > 0 && (
                        <View style={styles.cyclePhaseCard}>
                          <Text style={styles.spacedText}>EXERCISE</Text>
                          {trimesterInsights.exercise.map((item, index) => (
                            <Text key={index} style={styles.insightItem}>
                              • {item}
                            </Text>
                          ))}
                        </View>
                      )}

                    {/* Common Symptoms */}
                    {trimesterInsights.symptoms &&
                      trimesterInsights.symptoms.length > 0 && (
                        <View style={styles.cyclePhaseCard}>
                          <Text style={styles.spacedText}>COMMON SYMPTOMS</Text>
                          {trimesterInsights.symptoms.map((item, index) => (
                            <Text key={index} style={styles.insightItem}>
                              • {item}
                            </Text>
                          ))}
                        </View>
                      )}

                    {/* What to Expect */}
                    {trimesterInsights.whatToExpect &&
                      trimesterInsights.whatToExpect.length > 0 && (
                        <View style={styles.cyclePhaseCard}>
                          <Text style={styles.spacedText}>WHAT TO EXPECT</Text>
                          {trimesterInsights.whatToExpect.map((item, index) => (
                            <Text key={index} style={styles.insightItem}>
                              {item}
                            </Text>
                          ))}
                        </View>
                      )}

                    {/* Warnings */}
                    {trimesterInsights.warnings &&
                      trimesterInsights.warnings.length > 0 && (
                        <View
                          style={[styles.cyclePhaseCard, styles.warningCard]}
                        >
                          <Text
                            style={[styles.spacedText, styles.warningTitle]}
                          >
                            WARNINGS
                          </Text>
                          {trimesterInsights.warnings.map((item, index) => (
                            <Text key={index} style={styles.warningItem}>
                              ⚠️ {item}
                            </Text>
                          ))}
                        </View>
                      )}
                  </>
                )}

              </View>
            </GradientWrapper>

            {/* Symptom History Section */}
            <View style={styles.symptomHistorySection}>
              <Text style={styles.symptomHistoryTitle}>Symptom History</Text>
              {pregnancySymptoms.length > 0 ? (
                <>
                  {pregnancySymptoms
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .slice(0, 3)
                    .map((symptom, index) => (
                      <View key={index} style={styles.symptomItem}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.symptomItemDate}>
                            {moment(symptom.date).format('MMM D, YYYY')}
                          </Text>
                          <Text style={styles.symptomItemName}>
                            {symptom.symptom}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.symptomSeverityBadge,
                            {
                              backgroundColor:
                                symptom.severity === 'mild'
                                  ? '#5BCE8B20'
                                  : symptom.severity === 'moderate'
                                  ? '#E7A16920'
                                  : '#D9770620',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.symptomSeverityText,
                              {
                                color:
                                  symptom.severity === 'mild'
                                    ? '#5BCE8B'
                                    : symptom.severity === 'moderate'
                                    ? '#E7A169'
                                    : '#D97706',
                              },
                            ]}
                          >
                            {symptom.severity.charAt(0).toUpperCase() +
                              symptom.severity.slice(1)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  <TouchableOpacity
                    style={styles.viewFullHistoryLink}
                    onPress={() => navigation.navigate('PregnancyHistory')}
                  >
                    <Text style={styles.viewFullHistoryLinkText}>
                      View Full History
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.noSymptomsText}>
                  No symptoms logged yet. Log your first symptom to start
                  tracking.
                </Text>
              )}
            </View>

            {/* Cycle History Section - Always Visible */}
            {periodList.length > 0 && (
              <>
                <View style={{ marginTop: 16, marginBottom: 8 }}>
                  <Text
                    style={[
                      styles.subHeading,
                      { textAlign: 'left', marginBottom: 8 },
                    ]}
                  >
                    Before pregnancy: Your cycle history
                  </Text>
                  <Text
                    style={[
                      styles.textDarkGrey,
                      { fontSize: 11, marginBottom: 12 },
                    ]}
                  >
                    You're in pregnancy mode. These insights are based on your
                    cycles before pregnancy.
                  </Text>
                </View>

                {/* Cycle History - Read Only */}
                {periodList.length > 0 && (
                  <View style={styles.historyCard}>
                    <View style={styles.headerRow}>
                      <Image
                        source={images.periodCalender}
                        style={styles.calenderImage}
                      />
                      <Text style={styles.cycleText}>Recent Cycle History</Text>
                    </View>
                    {periodList.slice(0, 5).map(period => (
                      <View
                        key={period._id}
                        style={[styles.historyRow, { opacity: 0.7 }]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.historyRangeText}>
                            {formatPeriodRange(period)}
                          </Text>
                          <Text style={styles.historyMetaText}>
                            {getPeriodLengthLabel(period)}
                            {period.flow ? ` • Flow: ${period.flow}` : ''}
                          </Text>
                        </View>
                      </View>
                    ))}
                    {periodList.length > 5 && (
                      <View style={styles.historyFooter}>
                        <Text style={styles.historyFooterText}>
                          Showing last 5 periods • Logged periods total:{' '}
                          {periodList.length}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('CycleHistory')}
                          style={styles.viewAllButton}
                        >
                          <Text style={styles.viewAllButtonText}>View All</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {periodList.length <= 5 && periodList.length > 0 && (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('CycleHistory')}
                        style={styles.viewAllButton}
                      >
                        <Text style={styles.viewAllButtonText}>View All</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {/* Analytics Section - Read Only */}
                {analyticsData &&
                  analyticsData.totalPeriods &&
                  analyticsData.totalPeriods > 0 && (
                    <View style={styles.analyticsCard}>
                      <View style={styles.headerRow}>
                        <Image
                          source={images.periodCalender}
                          style={styles.calenderImage}
                        />
                        <Text style={styles.cycleText}>Cycle Analytics</Text>
                      </View>
                      {/* Cycle Trend */}
                      {analyticsData.cycleTrend && analyticsData.cycleRange && (
                        <View style={styles.analyticsRow}>
                          <Text style={styles.analyticsLabel}>
                            Cycle Length Trend:
                          </Text>
                          <View style={styles.trendContainer}>
                            <Text
                              style={[
                                styles.trendText,
                                {
                                  color:
                                    analyticsData.cycleTrend === 'increasing'
                                      ? colors.heading
                                      : analyticsData.cycleTrend ===
                                        'decreasing'
                                      ? colors.maroonText
                                      : colors.green,
                                },
                              ]}
                            >
                              {analyticsData.cycleTrend === 'increasing'
                                ? '↑ Increasing'
                                : analyticsData.cycleTrend === 'decreasing'
                                ? '↓ Decreasing'
                                : '→ Stable'}
                            </Text>
                            {analyticsData.cycleRange.min &&
                              analyticsData.cycleRange.max &&
                              analyticsData.cycleRange.average && (
                                <Text style={styles.analyticsValue}>
                                  Range: {analyticsData.cycleRange.min}–
                                  {analyticsData.cycleRange.max} days
                                  {' • '}Avg: {analyticsData.cycleRange.average}{' '}
                                  days
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                      {/* Period Trend */}
                      {analyticsData.periodTrend &&
                        analyticsData.periodRange && (
                          <View style={styles.analyticsRow}>
                            <Text style={styles.analyticsLabel}>
                              Period Length Trend:
                            </Text>
                            <View style={styles.trendContainer}>
                              <Text
                                style={[
                                  styles.trendText,
                                  {
                                    color:
                                      analyticsData.periodTrend === 'increasing'
                                        ? colors.heading
                                        : analyticsData.periodTrend ===
                                          'decreasing'
                                        ? colors.maroonText
                                        : colors.green,
                                  },
                                ]}
                              >
                                {analyticsData.periodTrend === 'increasing'
                                  ? '↑ Increasing'
                                  : analyticsData.periodTrend === 'decreasing'
                                  ? '↓ Decreasing'
                                  : '→ Stable'}
                              </Text>
                              {analyticsData.periodRange.min &&
                                analyticsData.periodRange.max &&
                                analyticsData.periodRange.average && (
                                  <Text style={styles.analyticsValue}>
                                    Range: {analyticsData.periodRange.min}–
                                    {analyticsData.periodRange.max} days
                                    {' • '}Avg:{' '}
                                    {analyticsData.periodRange.average} days
                                  </Text>
                                )}
                            </View>
                          </View>
                        )}
                      {/* Top Symptoms */}
                      {analyticsData.topSymptoms &&
                        analyticsData.topSymptoms.length > 0 && (
                          <View style={styles.analyticsRow}>
                            <Text style={styles.analyticsLabel}>
                              Most Common Symptoms:
                            </Text>
                            <View style={styles.symptomsContainer}>
                              {analyticsData.topSymptoms.map((item, index) => (
                                <View key={index} style={styles.symptomTag}>
                                  <Text style={styles.symptomTagText}>
                                    {item.symptom} ({item.count})
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        )}
                    </View>
                  )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If cycle tracking is not enabled
  if (!cycle || !cycle.isTracking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header showBackButton />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 16 }}>
            <View style={styles.topContainer}>
              <Text style={styles.heading}>Cycle Insights</Text>
              <Text style={styles.subHeading}>
                Your complete hormonal intelligence dashboard
              </Text>
            </View>
            {/* "I'm Pregnant" CTA for existing cycle trackers */}
            {!isPregnant && cycle && cycle.isTracking && (
              <TouchableOpacity
                style={styles.pregnantCtaButton}
                onPress={() => navigation.navigate('PregnancyInfo')}
              >
                <Text style={styles.pregnantCtaText}>
                  Pregnant? Switch to pregnancy support
                </Text>
              </TouchableOpacity>
            )}
            <GradientWrapper variant="basic">
              <View style={styles.phaseBody}>
                <CycleIndicatorCard
                  loading={loading}
                  isTracking={false}
                  isPregnant={false}
                  widthMultiplier={0.9}
                  backgroundGradientColors={['#FBFAF8', '#DFE7F7']}
                />
                <View style={{ height: 10 }} />
                <Text style={styles.textDarkGrey}>
                  Cycle tracking is not enabled. Please enable it in your
                  profile settings.
                </Text>
              </View>
            </GradientWrapper>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Calculate if current phase data is predicted
  const phaseDataStatus = cycle
    ? getPhaseDataStatus(cycle, periodList)
    : { isPredicted: true, reason: 'not_tracking' };
  console.log(phaseDataStatus.isPredicted);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ marginBottom: 16 }}>
          <View style={styles.topContainer}>
            <Text style={styles.heading}>Cycle Insights</Text>
            <Text style={styles.subHeading}>
              Your complete hormonal intelligence dashboard
            </Text>
          </View>
          <CycleIndicatorCard
            loading={loading}
            isTracking={Boolean(cycle?.isTracking)}
            isPregnant={isPregnant}
            cycleDay={cycle?.cycleDay}
            averageCycleLength={cycle?.averageCycleLength || 28}
            phase={cycle?.phase}
            tagline={cycle?.tagline}
            widthMultiplier={0.9}
            backgroundGradientColors={['#FBFAF8', '#DFE7F7']}
          />
          {isOverdue && !isPregnant && (
            <View style={styles.overdueCard}>
              <Text style={styles.overdueTitle}>
                Period later than expected
              </Text>
              <Text style={styles.overdueText}>
                Your next period was predicted {getNextPeriodText()}. Are you
                possibly pregnant?
              </Text>
            </View>
          )}
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <LinearGradient
                    style={[styles.phaseImageView]}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Image
                      source={images.phasesImage}
                      style={styles.pregnanyHeartImage}
                    />
                  </LinearGradient>
                  <View style={styles.phasesView}>
                    <Text style={styles.numberTextMedium}>
                      {phaseDataStatus.isPredicted
                        ? 'Predicted to be in'
                        : 'Currently in'}
                    </Text>
                    <GradientText
                      fontSize={fontSize.large}
                      fontFamily="PlayfairDisplay-SemiBold"
                    >
                      {getPhaseDisplayName(cycle?.phase)}
                    </GradientText>
                    <Text style={styles.numberTextMedium}>
                      {getCycleDayText()}
                    </Text>
                  </View>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>
                    {cycle?.cycleDay ? `Day ${cycle.cycleDay}` : '—'}
                  </Text>
                </View>
              </View>
              <Text style={styles.textDarkGrey}>
                {cycle?.description ||
                  (cycle?.phase ? PHASE_DESCRIPTIONS[cycle.phase] : '') ||
                  'Your body is preparing for the next cycle phase.'}
              </Text>
              {/* Prediction Info Message */}

              {/* Regularity and Confidence Indicators */}
              {cycle?.regularityScore !== null &&
                cycle?.regularityScore !== undefined && (
                  <View style={styles.regularityContainer}>
                    <View style={styles.regularityRow}>
                      <Text style={styles.regularityLabel}>
                        Cycle Regularity:
                      </Text>
                      <View
                        style={[
                          styles.regularityBadge,
                          {
                            backgroundColor:
                              cycle?.regularityClassification === 'very_regular'
                                ? '#E6FFF5'
                                : cycle?.regularityClassification === 'regular'
                                ? '#FFF8EB'
                                : cycle?.regularityClassification ===
                                  'irregular'
                                ? '#FFF5F5'
                                : '#F5F5F5',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.regularityBadgeText,
                            {
                              color:
                                cycle?.regularityClassification ===
                                'very_regular'
                                  ? colors.green
                                  : cycle?.regularityClassification ===
                                    'regular'
                                  ? colors.heading
                                  : cycle?.regularityClassification ===
                                    'irregular'
                                  ? colors.maroonText
                                  : colors.darkGrey,
                            },
                          ]}
                        >
                          {getRegularityLabel()} ({cycle?.regularityScore}
                          %)
                        </Text>
                      </View>
                    </View>
                    {cycle?.predictionConfidence !== undefined && (
                      <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceLabel}>
                          Prediction Confidence:
                        </Text>
                        <View style={styles.confidenceBarContainer}>
                          <View
                            style={[
                              styles.confidenceBar,
                              {
                                width: `${cycle?.predictionConfidence}%`,
                                backgroundColor: getDataQualityColor(),
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[
                            styles.confidenceText,
                            { color: getDataQualityColor() },
                          ]}
                        >
                          {cycle?.predictionConfidence}% •{' '}
                          {getDataQualityLabel()}
                        </Text>
                      </View>
                    )}
                    {periodList.length > 0 && (
                      <Text style={styles.dataQualityText}>
                        Based on {periodList.length} logged period
                        {periodList.length === 1 ? '' : 's'}
                        {cycle?.regularityClassification === 'irregular' ||
                        cycle?.regularityClassification === 'very_irregular'
                          ? ' • Your cycle varies. Predictions may be less accurate.'
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
              {/* Irregular Cycle Warning */}
              {cycle?.hasIrregularCycles && cycle?.irregularCycleMessage && (
                <View style={styles.irregularCycleCard}>
                  <Text style={styles.irregularCycleTitle}>
                    Cycle Variation Detected
                  </Text>
                  <Text style={styles.irregularCycleText}>
                    {cycle.irregularCycleMessage}
                  </Text>
                </View>
              )}

              {phaseDataStatus.isPredicted && (
                <View style={styles.predictionInfoContainer}>
                  <Text style={styles.predictionInfoText}>
                    This information is based on our advanced cycle prediction
                    calculations. To get the most accurate cycle tracking
                    personalized to your body, please log your period start
                    date.
                  </Text>
                </View>
              )}

              {/* Missing Period Warning - Hide if overdue card is showing */}
              {cycle?.hasMissingPeriods &&
                cycle?.missingPeriodMessage &&
                !isOverdue && (
                  <View style={styles.missingPeriodCard}>
                    <Text style={styles.missingPeriodTitle}>
                      Missing Period Detected
                    </Text>
                    <Text style={styles.missingPeriodText}>
                      {cycle.missingPeriodMessage}
                    </Text>
                  </View>
                )}
            </View>
          </GradientWrapper>

          {hasOngoingPeriod && !isPregnant && (
            <View style={styles.inProgressCard}>
              <Text style={styles.inProgressTitle}>Period in progress</Text>
              <Text style={styles.inProgressText}>
                A period is logged without an end date.
              </Text>
            </View>
          )}
          {!isPregnant && (
            <View style={styles.pregnancyView}>
              <View style={styles.heartImageView}>
                <Image
                  source={images.pregnancyHeart}
                  style={styles.pregnanyHeartImage}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                }}
              >
                <View style={styles.pregnancyIcon}>
                  <Text style={styles.pregnancyText}>Fertility Today</Text>
                </View>
                <View style={styles.lowTextView}>
                  <Text style={styles.lowText}>
                    {getFertilityTagline(cycle?.phase)}
                  </Text>
                </View>
                <Text style={styles.textDarkGrey}>
                  Fertile window: {getFertileWindowText()}
                </Text>
                <Text style={[styles.textDarkGreyWidht, { marginTop: 4 }]}>
                  {getFertilityDescription()}
                </Text>
              </View>
            </View>
          )}
          {periodList.length > 0 && (
            <View style={styles.historyCard}>
              <View style={styles.headerRow}>
                <Image
                  source={images.periodCalender}
                  style={styles.calenderImage}
                />
                <Text style={styles.cycleText}>Recent Cycle History</Text>
              </View>
              {periodList.slice(0, 5).map((period: Period) => (
                <View key={period._id} style={styles.historyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyRangeText}>
                      {formatPeriodRange(period)}
                    </Text>
                    <Text style={styles.historyMetaText}>
                      {getPeriodLengthLabel(period)}
                      {period.flow ? ` • Flow: ${period.flow}` : ''}
                    </Text>
                  </View>
                </View>
              ))}
              {periodList.length > 5 && (
                <View style={styles.historyFooter}>
                  <Text style={styles.historyFooterText}>
                    Showing last 5 periods • Logged periods total:{' '}
                    {periodList.length}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CycleHistory')}
                    style={styles.viewAllButton}
                  >
                    <Text style={styles.viewAllButtonText}>View All</Text>
                  </TouchableOpacity>
                </View>
              )}
              {periodList.length <= 5 && periodList.length > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('CycleHistory')}
                  style={styles.viewAllButton}
                >
                  <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* Analytics Section */}
          {analyticsData &&
            analyticsData.totalPeriods &&
            analyticsData.totalPeriods > 0 && (
              <View style={styles.analyticsCard}>
                <View style={styles.headerRow}>
                  <Image
                    source={images.periodCalender}
                    style={styles.calenderImage}
                  />
                  <Text style={styles.cycleText}>Cycle Analytics</Text>
                </View>
                {/* Cycle Trend */}
                {analyticsData.cycleTrend && analyticsData.cycleRange && (
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>
                      Cycle Length Trend:
                    </Text>
                    <View style={styles.trendContainer}>
                      <Text
                        style={[
                          styles.trendText,
                          {
                            color:
                              analyticsData.cycleTrend === 'increasing'
                                ? colors.heading
                                : analyticsData.cycleTrend === 'decreasing'
                                ? colors.maroonText
                                : colors.green,
                          },
                        ]}
                      >
                        {analyticsData.cycleTrend === 'increasing'
                          ? '↑ Increasing'
                          : analyticsData.cycleTrend === 'decreasing'
                          ? '↓ Decreasing'
                          : '→ Stable'}
                      </Text>
                      {analyticsData.cycleRange.min &&
                        analyticsData.cycleRange.max &&
                        analyticsData.cycleRange.average && (
                          <Text style={styles.analyticsValue}>
                            Range: {analyticsData.cycleRange.min}–
                            {analyticsData.cycleRange.max} days
                            {' • '}Avg: {analyticsData.cycleRange.average} days
                          </Text>
                        )}
                    </View>
                  </View>
                )}
                {/* Period Trend */}
                {analyticsData.periodTrend && analyticsData.periodRange && (
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>
                      Period Length Trend:
                    </Text>
                    <View style={styles.trendContainer}>
                      <Text
                        style={[
                          styles.trendText,
                          {
                            color:
                              analyticsData.periodTrend === 'increasing'
                                ? colors.heading
                                : analyticsData.periodTrend === 'decreasing'
                                ? colors.maroonText
                                : colors.green,
                          },
                        ]}
                      >
                        {analyticsData.periodTrend === 'increasing'
                          ? '↑ Increasing'
                          : analyticsData.periodTrend === 'decreasing'
                          ? '↓ Decreasing'
                          : '→ Stable'}
                      </Text>
                      {analyticsData.periodRange.min &&
                        analyticsData.periodRange.max &&
                        analyticsData.periodRange.average && (
                          <Text style={styles.analyticsValue}>
                            Range: {analyticsData.periodRange.min}–
                            {analyticsData.periodRange.max} days
                            {' • '}Avg: {analyticsData.periodRange.average} days
                          </Text>
                        )}
                    </View>
                  </View>
                )}
                {/* Top Symptoms */}
                {analyticsData.topSymptoms &&
                  analyticsData.topSymptoms.length > 0 && (
                    <View style={styles.analyticsRow}>
                      <Text style={styles.analyticsLabel}>
                        Most Common Symptoms:
                      </Text>
                      <View style={styles.symptomsContainer}>
                        {analyticsData.topSymptoms.map((item, index) => (
                          <View key={index} style={styles.symptomTag}>
                            <Text style={styles.symptomTagText}>
                              {item.symptom} ({item.count})
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
              </View>
            )}
          {!isPregnant && (
            <CycleCalendar
              periodStart={lastPeriodStart}
              cycleLength={cycle?.averageCycleLength || 28}
              periodLength={cycle?.averagePeriodLength || 5}
              periods={periodList}
              currentPhase={cycle?.phase}
              cycleDay={cycle?.cycleDay}
            />
          )}
          {/* <View style={styles.trackSymptomsView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={images.btTrackActive}
                style={styles.trackActiveStyle}
              />
              <View style={styles.marginLeft}>
                <Text style={styles.trackText}>Track Symtoms</Text>
                <Text style={styles.trackSubText}>
                  Day {cycleStatus.cycleDay} • {getPhaseDisplayName(cycleStatus.phase)}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logNowView} activeOpacity={0.5}>
              <Text style={styles.textBlackNormal}>Log Now</Text>
            </TouchableOpacity>
          </View> */}
          {!isPregnant && <SymptomTrends />}
          <View style={styles.weeklyUpdateMaincontainer}>
            <View style={styles.headerRow}>
              <Image
                source={images.periodCalender}
                style={styles.calenderImage}
              />
              <Text style={styles.cycleText}>What to Expect This Week</Text>
            </View>
            <View style={styles.listWrapper}>
              {(loadingWeeklyUpdates && weeklyUpdates.length === 0
                ? FALLBACK_WEEKLY_UPDATES
                : weeklyUpdates.length > 0
                ? weeklyUpdates
                : FALLBACK_WEEKLY_UPDATES
              ).map((item, index) => (
                <View key={index} style={styles.weeklyItem}>
                  <View
                    style={[styles.iconBubble, { backgroundColor: item.color }]}
                  >
                    <Image
                      source={getIconForType(item.iconType)}
                      style={[
                        styles.icon,
                        item.iconColor && { tintColor: item.iconColor },
                      ]}
                    />
                  </View>
                  <View style={styles.textWrapper}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.message}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <PhaseGuide />
          <View
            style={[
              styles.weeklyUpdateMaincontainer,
              { flexDirection: 'row', padding: 15, marginVertical: 15 },
            ]}
          >
            <Image source={images.ideaBulb} style={styles.ideaImage} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.infoText}>Did You Know?</Text>
              {loadingDidYouKnow && !personalizedInsight && !didYouKnow ? (
                <Text style={styles.infoSubText}>Loading...</Text>
              ) : (
                <>
                  <Text style={styles.infoSubText}>
                    {personalizedInsight ||
                      didYouKnow?.fact ||
                      FALLBACK_DID_YOU_KNOW.fact}
                  </Text>
                  {!personalizedInsight &&
                    (didYouKnow?.author || FALLBACK_DID_YOU_KNOW.author) && (
                      <Text style={styles.creditText}>
                        "Your cycle is your fifth vital sign."{'\n'} —{' '}
                        {didYouKnow?.author || FALLBACK_DID_YOU_KNOW.author}
                      </Text>
                    )}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
