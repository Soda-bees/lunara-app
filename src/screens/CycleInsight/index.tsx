import React, { JSX, useState, useEffect } from 'react';
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
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
import images from '../../constants/images';
import LinearGradient from 'react-native-linear-gradient';
import GradientText from '../../components/GradientText';
import { fontSize } from '../../constants/fonts';
import CycleCalendar from '../../components/CycleCalender';
import SymptomTrends from '../../components/SymptomTrends';
import { colors } from '../../constants/colors';
import PhaseGuide from '../../components/PhaseGuide';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';
import {
  getCurrentCycleStatus,
  createPeriod,
  getPeriods,
  updatePeriod,
  deletePeriod,
  getPeriodAnalytics,
  CycleStatusResponse,
  Period,
  PeriodAnalyticsResponse,
  getPregnancyStatus,
  PregnancyStatusResponse,
} from '../../services/api';
import moment from 'moment';
import PregnancySymptomModal from '../../components/PregnancySymptomModal';

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

export default function CycleInsight() {
  const navigation = useNavigation<NavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState(true);
  const [cycleStatus, setCycleStatus] = useState<
    CycleStatusResponse['data'] | null
  >(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
  const [analytics, setAnalytics] = useState<
    PeriodAnalyticsResponse['data'] | null
  >(null);
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showCycleHistory, setShowCycleHistory] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const latestPeriod = periods.length > 0 ? periods[0] : null;

  // Fetch cycle status and periods
  const fetchCycleData = async () => {
    try {
      setLoading(true);

      // Check pregnancy status first
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success && pregnancyResponse.data.isPregnant) {
        setIsPregnant(true);
        setPregnancyStatus(pregnancyResponse.data);
        // Still fetch periods and analytics for history
        const [periodsResponse, analyticsResponse] = await Promise.all([
          getPeriods(1, 50),
          getPeriodAnalytics(),
        ]);

        if (periodsResponse.success) {
          setPeriods(periodsResponse.data);
        }

        if (analyticsResponse.success && analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        }

        // Set cycle status to null since we're in pregnancy mode
        setCycleStatus(null);
        return;
      }
      setIsPregnant(false);
      setPregnancyStatus(null);

      const [statusResponse, periodsResponse, analyticsResponse] =
        await Promise.all([
          getCurrentCycleStatus(),
          getPeriods(1, 50),
          getPeriodAnalytics(),
        ]);

      if (statusResponse.success && statusResponse.data.isTracking) {
        setCycleStatus(statusResponse.data);
        if (statusResponse.data.lastPeriodStartDate) {
          setLastPeriodStart(new Date(statusResponse.data.lastPeriodStartDate));
        }
      } else {
        setCycleStatus(null);
      }

      if (periodsResponse.success) {
        setPeriods(periodsResponse.data);
      }

      if (analyticsResponse.success && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
      }
    } catch (error: any) {
      console.error('Error fetching cycle data:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load cycle data. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchCycleData();
    }, []),
  );

  const handlePeriodLog = async (data: PeriodLogData) => {
    try {
      if (isPregnant) {
        Alert.alert(
          'Pregnancy Mode',
          'Cycle tracking is paused during pregnancy. Your cycle history is preserved and visible here.',
        );
        return;
      }
      if (!cycleStatus) {
        Alert.alert('Error', 'Cycle tracking is not enabled');
        return;
      }

      if (editingPeriod) {
        // Update existing period
        const response = await updatePeriod(editingPeriod._id, {
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          flow: data.flow,
          symptoms: data.symptoms,
          notes: data.notes,
        });

        if (response.success) {
          Alert.alert('Success', 'Period updated successfully!');
          setEditingPeriod(null);
          await fetchCycleData();
        }
      } else {
        // Create new period
        const response = await createPeriod({
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          flow: data.flow,
          symptoms: data.symptoms,
          notes: data.notes,
        });

        if (response.success) {
          Alert.alert(
            'Success',
            data.endDate
              ? 'Period logged successfully!'
              : 'Period start logged! You can add the end date later when your period ends.',
          );
          await fetchCycleData();
        }
      }
    } catch (error: any) {
      console.error(
        `Error ${editingPeriod ? 'updating' : 'creating'} period:`,
        error,
      );
      Alert.alert(
        'Error',
        error.message ||
          `Failed to ${
            editingPeriod ? 'update' : 'log'
          } period. Please try again.`,
      );
    }
  };

  const handleEditPeriod = (period: Period) => {
    if (isPregnant) {
      Alert.alert(
        'Pregnancy Mode',
        'Cycle tracking is paused during pregnancy. Your cycle history is preserved and visible here.',
      );
      return;
    }
    setEditingPeriod(period);
    setShowModal(true);
  };

  const handleDeletePeriod = (period: Period) => {
    if (isPregnant) {
      Alert.alert(
        'Pregnancy Mode',
        'Cycle tracking is paused during pregnancy. Your cycle history is preserved and visible here.',
      );
      return;
    }
    Alert.alert(
      'Delete Period',
      'Are you sure you want to delete this period? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deletePeriod(period._id);
              if (response.success) {
                Alert.alert('Success', 'Period deleted successfully!');
                await fetchCycleData();
              }
            } catch (error: any) {
              console.error('Error deleting period:', error);
              Alert.alert(
                'Error',
                error.message || 'Failed to delete period. Please try again.',
                [
                  {
                    text: 'Retry',
                    onPress: () => handleDeletePeriod(period),
                  },
                  {
                    text: 'OK',
                    style: 'cancel',
                  },
                ],
              );
            }
          },
        },
      ],
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPeriod(null);
  };

  const handleOpenNewPeriodModal = () => {
    if (isPregnant) {
      Alert.alert(
        'Pregnancy Mode',
        'Cycle tracking is paused during pregnancy. Your cycle history is preserved and visible here.',
      );
      return;
    }
    setEditingPeriod(null);
    setShowModal(true);
  };

  const WeeklyUpdateData = [
    {
      title: 'Energy Rising',
      message:
        'Your energy levels will continue increasing through day 14. Perfect for challenging workouts and social activities.',
      image: images.phasesImage,
      color: '#FFF1DB',
      iconColor: colors.heading,
    },
    {
      title: 'Mental Clarity Peak',
      message:
        'Days 10-14 bring peak cognitive function. Schedule important meetings and creative projects.',
      image: images.mentalImage,
      color: '#E4EFFF',
      // iconColor: colors.heading,
    },
    {
      title: 'Metabolism Boost',
      message:
        'Your metabolic rate is increasing. Great time for extended fasting windows (13-15h).',
      image: images.logWaterDrop,
      color: '#FFDEE0',
      iconColor: '#D6757B',
    },
  ];

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
    if (!cycleStatus?.cycleDay) return 'Day 0';
    return `Day ${cycleStatus.cycleDay}`;
  };

  // Get short fertility tagline (2–3 words) for quick insight
  // Priority: Backend fertilityLevel → Frontend fallback from phase → Default
  const getFertilityTagline = (phase?: string): string => {
    if (cycleStatus?.fertilityLevel === 'high') return 'High';
    if (cycleStatus?.fertilityLevel === 'medium') return 'Medium';
    if (cycleStatus?.fertilityLevel === 'low') return 'Low';

    // Fallback to phase-based heuristic if fertilityLevel not provided
    if (phase && PHASE_TAGLINES[phase]) {
      return PHASE_TAGLINES[phase];
    }

    return 'Fertility awareness';
  };

  const getFertileWindowText = (): string => {
    // Prefer backend-provided fertile window dates
    if (cycleStatus?.fertileWindowStart && cycleStatus?.fertileWindowEnd) {
      const start = moment(cycleStatus.fertileWindowStart).format('MMM D');
      const end = moment(cycleStatus.fertileWindowEnd).format('MMM D');
      return `${start} – ${end}`;
    }

    // Fallback: estimate from lastPeriodStart and average cycle length
    if (!lastPeriodStart) return 'Fertile window not available';

    const fertileStart = moment(lastPeriodStart).clone().add(9, 'days');
    const fertileEnd = moment(lastPeriodStart).clone().add(14, 'days');

    return `${fertileStart.format('MMM D')} – ${fertileEnd.format('MMM D')}`;
  };

  const getFertilityDescription = (): string => {
    if (cycleStatus?.fertilityDescription) {
      return cycleStatus.fertilityDescription;
    }

    // Fallback based on phase if backend description not provided
    switch (cycleStatus?.phase) {
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
    if (!cycleStatus?.daysUntilNextPeriod) return 'Unknown';
    const days = cycleStatus.daysUntilNextPeriod;
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  const isOverdue =
    typeof cycleStatus?.daysUntilNextPeriod === 'number' &&
    cycleStatus.daysUntilNextPeriod < 0;

  const hasOngoingPeriod = !!(latestPeriod && !latestPeriod.endDate);

  const handleEndPeriodToday = async () => {
    if (!latestPeriod?._id) return;

    try {
      const todayIso = new Date().toISOString();
      const response = await updatePeriod(latestPeriod._id, {
        endDate: todayIso,
      });

      if (response.success) {
        Alert.alert(
          'Updated',
          'We have marked your current period as ended today.',
        );
        await fetchCycleData();
      }
    } catch (error: any) {
      console.error('Error updating period:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update period. Please try again.',
      );
    }
  };

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
    if (!cycleStatus?.regularityClassification) return '';
    const labels: Record<string, string> = {
      very_regular: 'Very Regular',
      regular: 'Regular',
      irregular: 'Irregular',
      very_irregular: 'Very Irregular',
      insufficient_data: 'Need More Data',
    };
    return labels[cycleStatus.regularityClassification] || '';
  };

  const getDataQualityLabel = (): string => {
    if (!cycleStatus?.dataQuality) return '';
    const labels: Record<string, string> = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      needs_improvement: 'Needs Improvement',
    };
    return labels[cycleStatus.dataQuality] || '';
  };

  const getDataQualityColor = (): string => {
    if (!cycleStatus?.dataQuality) return colors.darkGrey;
    const colors_map: Record<string, string> = {
      excellent: colors.green,
      good: '#4CAF50',
      fair: colors.heading,
      needs_improvement: '#F44336',
    };
    return colors_map[cycleStatus.dataQuality] || colors.darkGrey;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header />
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
        <Header />
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

                {/* Quick Actions */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowSymptomModal(true)}
                  >
                    <Text style={styles.actionButtonText}>Log Symptom</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => navigation.navigate('PregnancyInfo')}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.secondaryButtonText,
                      ]}
                    >
                      Update Info
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => navigation.navigate('PregnancyHistory')}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.secondaryButtonText,
                      ]}
                    >
                      View History
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Cycle History Toggle */}
                {periods.length > 0 && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => setShowCycleHistory(!showCycleHistory)}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.secondaryButtonText,
                      ]}
                    >
                      {showCycleHistory
                        ? 'Hide Cycle History'
                        : 'View Cycle History'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </GradientWrapper>

            {/* Cycle History Section - Toggleable */}
            {showCycleHistory && periods.length > 0 && (
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
                {periods.length > 0 && (
                  <View style={styles.historyCard}>
                    <View style={styles.headerRow}>
                      <Image
                        source={images.periodCalender}
                        style={styles.calenderImage}
                      />
                      <Text style={styles.cycleText}>Recent Cycle History</Text>
                    </View>
                    {periods.slice(0, 5).map(period => (
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
                    {periods.length > 5 && (
                      <View style={styles.historyFooter}>
                        <Text style={styles.historyFooterText}>
                          Showing last 5 periods • Logged periods total:{' '}
                          {periods.length}
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('CycleHistory')}
                          style={styles.viewAllButton}
                        >
                          <Text style={styles.viewAllButtonText}>View All</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {periods.length <= 5 && periods.length > 0 && (
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
                {analytics &&
                  analytics.totalPeriods &&
                  analytics.totalPeriods > 0 && (
                    <View style={styles.analyticsCard}>
                      <View style={styles.headerRow}>
                        <Image
                          source={images.periodCalender}
                          style={styles.calenderImage}
                        />
                        <Text style={styles.cycleText}>Cycle Analytics</Text>
                      </View>
                      {/* Cycle Trend */}
                      {analytics.cycleTrend && analytics.cycleRange && (
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
                                    analytics.cycleTrend === 'increasing'
                                      ? colors.heading
                                      : analytics.cycleTrend === 'decreasing'
                                      ? colors.maroonText
                                      : colors.green,
                                },
                              ]}
                            >
                              {analytics.cycleTrend === 'increasing'
                                ? '↑ Increasing'
                                : analytics.cycleTrend === 'decreasing'
                                ? '↓ Decreasing'
                                : '→ Stable'}
                            </Text>
                            {analytics.cycleRange.min &&
                              analytics.cycleRange.max &&
                              analytics.cycleRange.average && (
                                <Text style={styles.analyticsValue}>
                                  Range: {analytics.cycleRange.min}–
                                  {analytics.cycleRange.max} days
                                  {' • '}Avg: {analytics.cycleRange.average}{' '}
                                  days
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                      {/* Period Trend */}
                      {analytics.periodTrend && analytics.periodRange && (
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
                                    analytics.periodTrend === 'increasing'
                                      ? colors.heading
                                      : analytics.periodTrend === 'decreasing'
                                      ? colors.maroonText
                                      : colors.green,
                                },
                              ]}
                            >
                              {analytics.periodTrend === 'increasing'
                                ? '↑ Increasing'
                                : analytics.periodTrend === 'decreasing'
                                ? '↓ Decreasing'
                                : '→ Stable'}
                            </Text>
                            {analytics.periodRange.min &&
                              analytics.periodRange.max &&
                              analytics.periodRange.average && (
                                <Text style={styles.analyticsValue}>
                                  Range: {analytics.periodRange.min}–
                                  {analytics.periodRange.max} days
                                  {' • '}Avg: {analytics.periodRange.average}{' '}
                                  days
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                      {/* Top Symptoms */}
                      {analytics.topSymptoms &&
                        analytics.topSymptoms.length > 0 && (
                          <View style={styles.analyticsRow}>
                            <Text style={styles.analyticsLabel}>
                              Most Common Symptoms:
                            </Text>
                            <View style={styles.symptomsContainer}>
                              {analytics.topSymptoms.map((item, index) => (
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

        <PregnancySymptomModal
          visible={showSymptomModal}
          onClose={() => setShowSymptomModal(false)}
          onSuccess={() => {
            setShowSymptomModal(false);
            fetchCycleData();
          }}
        />
      </SafeAreaView>
    );
  }

  // If cycle tracking is not enabled
  if (!cycleStatus || !cycleStatus.isTracking) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 16 }}>
            <View style={styles.topContainer}>
              <Text style={styles.heading}>Cycle Insights</Text>
              <Text style={styles.subHeading}>
                Your complete hormonal intelligence dashboard
              </Text>
            </View>
            {/* "I'm Pregnant" CTA for existing cycle trackers */}
            {!isPregnant && cycleStatus && cycleStatus.isTracking && (
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginBottom: 16 }}>
          <View style={styles.topContainer}>
            <Text style={styles.heading}>Cycle Insights</Text>
            <Text style={styles.subHeading}>
              Your complete hormonal intelligence dashboard
            </Text>
          </View>
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
                    <Text style={styles.numberTextMedium}>Currently in</Text>
                    <GradientText
                      fontSize={fontSize.large}
                      fontFamily="PlayfairDisplay-SemiBold"
                    >
                      {getPhaseDisplayName(cycleStatus.phase)}
                    </GradientText>
                    <Text style={styles.numberTextMedium}>
                      {getCycleDayText()}
                    </Text>
                  </View>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>
                    {cycleStatus.cycleDay ? `Day ${cycleStatus.cycleDay}` : '—'}
                  </Text>
                </View>
              </View>
              <Text style={styles.textDarkGrey}>
                {cycleStatus.description ||
                  PHASE_DESCRIPTIONS[cycleStatus.phase || ''] ||
                  'Your body is preparing for the next cycle phase.'}
              </Text>
              {/* Regularity and Confidence Indicators */}
              {cycleStatus.regularityScore !== null &&
                cycleStatus.regularityScore !== undefined && (
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
                              cycleStatus.regularityClassification ===
                              'very_regular'
                                ? '#E6FFF5'
                                : cycleStatus.regularityClassification ===
                                  'regular'
                                ? '#FFF8EB'
                                : cycleStatus.regularityClassification ===
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
                                cycleStatus.regularityClassification ===
                                'very_regular'
                                  ? colors.green
                                  : cycleStatus.regularityClassification ===
                                    'regular'
                                  ? colors.heading
                                  : cycleStatus.regularityClassification ===
                                    'irregular'
                                  ? colors.maroonText
                                  : colors.darkGrey,
                            },
                          ]}
                        >
                          {getRegularityLabel()} ({cycleStatus.regularityScore}
                          %)
                        </Text>
                      </View>
                    </View>
                    {cycleStatus.predictionConfidence !== undefined && (
                      <View style={styles.confidenceRow}>
                        <Text style={styles.confidenceLabel}>
                          Prediction Confidence:
                        </Text>
                        <View style={styles.confidenceBarContainer}>
                          <View
                            style={[
                              styles.confidenceBar,
                              {
                                width: `${cycleStatus.predictionConfidence}%`,
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
                          {cycleStatus.predictionConfidence}% •{' '}
                          {getDataQualityLabel()}
                        </Text>
                      </View>
                    )}
                    {periods.length > 0 && (
                      <Text style={styles.dataQualityText}>
                        Based on {periods.length} logged period
                        {periods.length === 1 ? '' : 's'}
                        {cycleStatus.regularityClassification === 'irregular' ||
                        cycleStatus.regularityClassification ===
                          'very_irregular'
                          ? ' • Your cycle varies. Predictions may be less accurate.'
                          : ''}
                      </Text>
                    )}
                  </View>
                )}
              {/* Irregular Cycle Warning */}
              {cycleStatus.hasIrregularCycles &&
                cycleStatus.irregularCycleMessage && (
                  <View style={styles.irregularCycleCard}>
                    <Text style={styles.irregularCycleTitle}>
                      Cycle Variation Detected
                    </Text>
                    <Text style={styles.irregularCycleText}>
                      {cycleStatus.irregularCycleMessage}
                    </Text>
                  </View>
                )}
              {/* Missing Period Warning */}
              {cycleStatus.hasMissingPeriods &&
                cycleStatus.missingPeriodMessage && (
                  <View style={styles.missingPeriodCard}>
                    <Text style={styles.missingPeriodTitle}>
                      Missing Period Detected
                    </Text>
                    <Text style={styles.missingPeriodText}>
                      {cycleStatus.missingPeriodMessage}
                    </Text>
                    {cycleStatus.missingPeriods &&
                      cycleStatus.missingPeriods.length > 0 && (
                        <TouchableOpacity
                          style={styles.missingPeriodButton}
                          onPress={handleOpenNewPeriodModal}
                        >
                          <Text style={styles.missingPeriodButtonText}>
                            Log Missing Period
                          </Text>
                        </TouchableOpacity>
                      )}
                  </View>
                )}
            </View>
          </GradientWrapper>
          {/* First Period Welcome Card */}
          {periods.length === 0 && (
            <View style={styles.firstPeriodCard}>
              <Text style={styles.firstPeriodTitle}>
                Welcome to Cycle Tracking!
              </Text>
              <Text style={styles.firstPeriodText}>
                Log your first period to get started. We'll use this to predict
                your cycle phases and provide personalized insights.
              </Text>
              <TouchableOpacity
                style={styles.firstPeriodButton}
                onPress={handleOpenNewPeriodModal}
              >
                <Text style={styles.firstPeriodButtonText}>
                  Log Your First Period
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.logButton}
            activeOpacity={0.8}
            onPress={handleOpenNewPeriodModal}
          >
            <Image source={images.logWaterDrop} style={styles.dropImg} />
            <Text style={styles.text}>Log Period Start</Text>
          </TouchableOpacity>

          {isOverdue && !isPregnant && (
            <View style={styles.overdueCard}>
              <Text style={styles.overdueTitle}>
                Period later than expected
              </Text>
              <Text style={styles.overdueText}>
                Your next period was predicted {getNextPeriodText()}. If it has
                already started, log it now so we can keep your calendar
                accurate.
              </Text>
              <View style={styles.overdueActions}>
                <TouchableOpacity
                  style={styles.overduePrimaryButton}
                  activeOpacity={0.8}
                  onPress={handleOpenNewPeriodModal}
                >
                  <Text style={styles.overduePrimaryText}>
                    Log period start
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.overdueSecondaryButton}
                  activeOpacity={0.8}
                  onPress={() =>
                    Alert.alert(
                      'Noted',
                      'We will keep tracking your cycle and adjust as you log periods.',
                    )
                  }
                >
                  <Text style={styles.overdueSecondaryText}>Still waiting</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <PeriodStartModal
            visible={showModal}
            onClose={handleCloseModal}
            onConfirm={handlePeriodLog}
            editingPeriod={editingPeriod}
          />
          {hasOngoingPeriod && !isPregnant && (
            <View style={styles.inProgressCard}>
              <Text style={styles.inProgressTitle}>Period in progress</Text>
              <Text style={styles.inProgressText}>
                You have a period logged without an end date. When your period
                ends, add an end date to keep your insights accurate.
              </Text>
              <TouchableOpacity
                style={styles.inProgressButton}
                activeOpacity={0.8}
                onPress={handleEndPeriodToday}
              >
                <Text style={styles.inProgressButtonText}>
                  Mark as ended today
                </Text>
              </TouchableOpacity>
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
                    {getFertilityTagline(cycleStatus.phase)}
                  </Text>
                </View>
                <Text style={styles.textDarkGrey}>
                  Fertile window: {getFertileWindowText()}
                </Text>
                <Text style={[styles.textDarkGrey, { marginTop: 4 }]}>
                  {getFertilityDescription()}
                </Text>
              </View>
            </View>
          )}
          {periods.length > 0 && (
            <View style={styles.historyCard}>
              <View style={styles.headerRow}>
                <Image
                  source={images.periodCalender}
                  style={styles.calenderImage}
                />
                <Text style={styles.cycleText}>Recent Cycle History</Text>
              </View>
              {periods.slice(0, 5).map(period => (
                <TouchableOpacity
                  key={period._id}
                  style={styles.historyRow}
                  onPress={() => handleEditPeriod(period)}
                  onLongPress={() => handleDeletePeriod(period)}
                  activeOpacity={0.7}
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
                  <TouchableOpacity
                    onPress={() => handleEditPeriod(period)}
                    style={{ padding: 8 }}
                  >
                    <Text
                      style={[
                        styles.historyMetaText,
                        { color: colors.primary },
                      ]}
                    >
                      Edit
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
              {periods.length > 5 && (
                <View style={styles.historyFooter}>
                  <Text style={styles.historyFooterText}>
                    Showing last 5 periods • Logged periods total:{' '}
                    {periods.length}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CycleHistory')}
                    style={styles.viewAllButton}
                  >
                    <Text style={styles.viewAllButtonText}>View All</Text>
                  </TouchableOpacity>
                </View>
              )}
              {periods.length <= 5 && periods.length > 0 && (
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
          {analytics &&
            analytics.totalPeriods &&
            analytics.totalPeriods > 0 && (
              <View style={styles.analyticsCard}>
                <View style={styles.headerRow}>
                  <Image
                    source={images.periodCalender}
                    style={styles.calenderImage}
                  />
                  <Text style={styles.cycleText}>Cycle Analytics</Text>
                </View>
                {/* Cycle Trend */}
                {analytics.cycleTrend && analytics.cycleRange && (
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
                              analytics.cycleTrend === 'increasing'
                                ? colors.heading
                                : analytics.cycleTrend === 'decreasing'
                                ? colors.maroonText
                                : colors.green,
                          },
                        ]}
                      >
                        {analytics.cycleTrend === 'increasing'
                          ? '↑ Increasing'
                          : analytics.cycleTrend === 'decreasing'
                          ? '↓ Decreasing'
                          : '→ Stable'}
                      </Text>
                      {analytics.cycleRange.min &&
                        analytics.cycleRange.max &&
                        analytics.cycleRange.average && (
                          <Text style={styles.analyticsValue}>
                            Range: {analytics.cycleRange.min}–
                            {analytics.cycleRange.max} days
                            {' • '}Avg: {analytics.cycleRange.average} days
                          </Text>
                        )}
                    </View>
                  </View>
                )}
                {/* Period Trend */}
                {analytics.periodTrend && analytics.periodRange && (
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
                              analytics.periodTrend === 'increasing'
                                ? colors.heading
                                : analytics.periodTrend === 'decreasing'
                                ? colors.maroonText
                                : colors.green,
                          },
                        ]}
                      >
                        {analytics.periodTrend === 'increasing'
                          ? '↑ Increasing'
                          : analytics.periodTrend === 'decreasing'
                          ? '↓ Decreasing'
                          : '→ Stable'}
                      </Text>
                      {analytics.periodRange.min &&
                        analytics.periodRange.max &&
                        analytics.periodRange.average && (
                          <Text style={styles.analyticsValue}>
                            Range: {analytics.periodRange.min}–
                            {analytics.periodRange.max} days
                            {' • '}Avg: {analytics.periodRange.average} days
                          </Text>
                        )}
                    </View>
                  </View>
                )}
                {/* Top Symptoms */}
                {analytics.topSymptoms && analytics.topSymptoms.length > 0 && (
                  <View style={styles.analyticsRow}>
                    <Text style={styles.analyticsLabel}>
                      Most Common Symptoms:
                    </Text>
                    <View style={styles.symptomsContainer}>
                      {analytics.topSymptoms.map((item, index) => (
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
              cycleLength={cycleStatus.averageCycleLength || 28}
              periodLength={cycleStatus.averagePeriodLength || 5}
              periods={periods}
              currentPhase={cycleStatus.phase}
              cycleDay={cycleStatus.cycleDay}
              onLogPeriodStart={date => {
                setEditingPeriod(null);
                // Pre-fill modal with selected date
                setShowModal(true);
              }}
              onLogPeriodEnd={date => {
                // Find ongoing period and update it
                const ongoingPeriod = periods.find(
                  p => p.startDate && !p.endDate,
                );
                if (ongoingPeriod) {
                  handleEditPeriod(ongoingPeriod);
                }
              }}
              onViewPeriodDetails={date => {
                const periodForDate = periods.find(p => {
                  const start = moment(p.startDate).startOf('day');
                  const end = p.endDate
                    ? moment(p.endDate).startOf('day')
                    : null;
                  const dateStart = moment(date).startOf('day');
                  if (end) {
                    return (
                      dateStart.isSameOrAfter(start) &&
                      dateStart.isSameOrBefore(end)
                    );
                  }
                  return dateStart.isSame(start);
                });
                if (periodForDate) {
                  handleEditPeriod(periodForDate);
                }
              }}
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
          <SymptomTrends />
          <View style={styles.weeklyUpdateMaincontainer}>
            <View style={styles.headerRow}>
              <Image
                source={images.periodCalender}
                style={styles.calenderImage}
              />
              <Text style={styles.cycleText}>What to Expect This Week</Text>
            </View>
            <View style={styles.listWrapper}>
              {WeeklyUpdateData.map((item, index) => (
                <View key={index} style={styles.weeklyItem}>
                  <View
                    style={[styles.iconBubble, { backgroundColor: item.color }]}
                  >
                    <Image
                      source={item.image}
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
              <Text style={styles.infoSubText}>
                Your basal body temperature naturally rises by 0.5-1°F after
                ovulation due to increased progesterone. Tracking this can help
                you understand your cycle patterns and optimize fertility
                awareness.
              </Text>
              <Text style={styles.creditText}>
                "Your cycle is your fifth vital sign."{'\n'} — Dr. Jolene
                Brighten
              </Text>
            </View>
          </View>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={images.journal} style={styles.journalStyle} />
                <Text style={[styles.infoText, { marginLeft: 10 }]}>
                  Wellness Journal
                </Text>
              </View>
              <Text style={[styles.infoSubText, { marginTop: 10 }]}>
                Your story unfolds one note at a time. Reflect on your journey,
                express gratitude, and celebrate your progress.
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    style={styles.bottomEntryButton}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>New Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.bottomEntryButton,
                    { marginLeft: 8, backgroundColor: colors.borderPink },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.buttonText, { color: colors.maroonText }]}
                  >
                    See History
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
