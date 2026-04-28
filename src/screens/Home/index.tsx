import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
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
import { gradients } from '../../constants/gradientColors';
import {
  getPregnancyStatus,
  PregnancyStatusResponse,
  updatePregnancyInfo,
  createPeriod,
} from '../../services/api';
import { getPhaseDataStatus } from '../../utils/cycleUtils';
import PregnancyPromptModal, {
  PregnancyPromptData,
} from '../../components/PregnancyPromptModal';
import { useHomeRituals } from '../../hooks/useHomeRituals';
import SleepLogModal from '../../components/SleepLogModal';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';
import SymptomLogModal from '../../components/SymptomLogModal';
import moment from 'moment';
import { useCycleData } from '../../context/CycleDataContext';
import { colors } from '../../constants/colors';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const {
    cycleStatus: cycleStatusState,
    periods: periodsState,
    refreshCycleData,
  } = useCycleData();
  const cycleStatus = cycleStatusState.data;
  const periodList = periodsState.data || [];
  const loading = cycleStatusState.loading || periodsState.loading;

  const {
    ritualsLoading,
    progress,
    todayRituals,
    symptomSummary,
    sleepSummary,
    refreshAll,
  } = useHomeRituals();

  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [symptomsModalVisible, setSymptomsModalVisible] = useState(false);
  const [sleepSelectedDate, setSleepSelectedDate] = useState<Date>(new Date());

  const [showInsightDetails, setShowInsightDetails] = useState<Boolean>(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showPregnancyPrompt, setShowPregnancyPrompt] = useState(false);
  const [updatingPregnancy, setUpdatingPregnancy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const handleSleepConfirm = () => {
    void refreshAll();
  };

  const handleSymptomsConfirm = () => {
    void refreshAll();
  };

  const handlePeriodConfirm = async (data: PeriodLogData) => {
    try {
      const response = await createPeriod({
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
        flow: data.flow,
        symptoms: data.symptoms,
        notes: data.notes,
      });

      if (response.success) {
        setPeriodModalVisible(false);
        await refreshAll();
        Alert.alert('Success', 'Period logged successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to log period.');
      }
    } catch (error: any) {
      console.error('Error creating period from Home:', error);
      Alert.alert('Error', error.message || 'Failed to log period.');
    }
  };

  const handleRitualPress = async (ritualType: string) => {
    if (ritualType === 'sleep') {
      setSleepSelectedDate(new Date());
      setSleepModalVisible(true);
      return;
    }

    if (ritualType === 'periods') {
      setPeriodModalVisible(true);
      return;
    }

    if (ritualType === 'symptoms') {
      setSleepSelectedDate(new Date());
      setSymptomsModalVisible(true);
      return;
    }

    if (ritualType === 'nutrition') {
      navigation.navigate('Nutrition');
      return;
    }

    if (ritualType === 'movement') {
      // Movement completion is managed inside the movement screen.
      navigation.navigate('Workouts');
      return;
    }

    return;
  };

  // Fetch pregnancy status on mount and when cycle data changes
  useEffect(() => {
    const fetchPregnancyStatus = async () => {
      try {
        const pregnancyResponse = await getPregnancyStatus();
        if (pregnancyResponse.success) {
          setPregnancyStatus(
            pregnancyResponse.data.isPregnant ? pregnancyResponse.data : null,
          );
        }
      } catch (error: any) {
        console.error('Error fetching pregnancy status:', error);
      }
    };

    fetchPregnancyStatus();
  }, []);

  // Background refresh on focus (only if stale) - silent, no loaders
  useFocusEffect(
    React.useCallback(() => {
      void refreshAll();
    }, [refreshAll]),
  );

  // Pull-to-refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAll();
      // Also refresh pregnancy status
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success) {
        setPregnancyStatus(
          pregnancyResponse.data.isPregnant ? pregnancyResponse.data : null,
        );
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshAll]);

  // Helper functions
  const getPhaseDisplayName = (phase?: string): string => {
    if (!phase || phase === 'unknown') return 'Unknown';
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  const getPhaseIcon = (phase?: string) => {
    switch (phase) {
      case 'menstrual':
        return images.menstrualIcon;
      case 'follicular':
        return images.follicularIcon;
      case 'ovulatory':
        return images.ovulationIcon;
      case 'luteal':
        return images.lutealIcon;
      default:
        return images.lutealIcon; // Default fallback
    }
  };

  const getEnergyLevelText = (energyLevel?: string | null): string => {
    if (!energyLevel) return '—';
    switch (energyLevel) {
      case 'low':
        return 'Low - Rest';
      case 'rising':
        return 'Rising - High';
      case 'high':
        return 'High - Peak';
      case 'declining':
        return 'Declining - Medium';
      default:
        return '—';
    }
  };

  const getSymptomSeverityColor = (severity?: string) => {
    switch ((severity || '').toLowerCase()) {
      case 'severe':
      case 'low':
      case 'poor':
        return '#E85C5C';
      case 'moderate':
      case 'medium':
      case 'neutral':
      case 'fair':
        return '#E68C3A';
      case 'mild':
      case 'high':
      case 'good':
        return '#5DBB63';
      default:
        return colors.darkGrey;
    }
  };

  const getTrendLabel = (
    trend: 'increasing' | 'decreasing' | 'stable' | null,
  ): string => {
    if (trend === 'decreasing') return 'Improving';
    if (trend === 'increasing') return 'Worsening';
    if (trend === 'stable') return 'Stable';
    return '—';
  };

  const formatDuration = (minutes: number | null): string => {
    if (!minutes || minutes <= 0) return '—';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const formatTime = (isoTime?: string | null): string => {
    if (!isoTime) return '—';
    const dt = new Date(isoTime);
    if (Number.isNaN(dt.getTime())) return '—';
    return moment(dt).format('h:mm A');
  };

  const getSleepQualityMeta = (
    quality: number | null,
  ): { label: string; textColor: string; bgColor: string } => {
    if (!quality || quality <= 0) {
      return { label: '—', textColor: colors.darkGrey, bgColor: '#F3F3F3' };
    }
    // Sleep quality is on a 1-5 scale where 5 is best.
    if (quality >= 5) {
      return { label: 'Excellent', textColor: '#2E7D32', bgColor: '#E8F5E9' };
    }
    if (quality >= 4) {
      return { label: 'Good', textColor: '#5A8F29', bgColor: '#F1F8E9' };
    }
    if (quality >= 3) {
      return { label: 'Okay', textColor: '#E68C3A', bgColor: '#FFF3E0' };
    }
    if (quality >= 2) {
      return { label: 'Poor', textColor: '#D35400', bgColor: '#FDEBD0' };
    }
    return { label: 'Very Poor', textColor: '#C62828', bgColor: '#FFEBEE' };
  };

  const calculateProgressPercentage = (
    cycleDay?: number,
    cycleLength?: number,
  ): number => {
    if (!cycleDay || !cycleLength) return 0;
    return Math.min(100, Math.max(0, (cycleDay / cycleLength) * 100));
  };

  // Determine if current phase is predicted or actual
  const phaseDataStatus = cycleStatus
    ? getPhaseDataStatus(cycleStatus, periodList)
    : { isPredicted: true, reason: 'not_tracking' };

  // Check if period is overdue
  const isOverdue =
    typeof cycleStatus?.daysUntilNextPeriod === 'number' &&
    cycleStatus.daysUntilNextPeriod < 0;

  // Helper function to navigate to Cycle tab
  const navigateToCycleTab = () => {
    try {
      // Method 1: Check if navigation itself has jumpTo (when inside tab navigator)
      const navAny = navigation as any;
      if (navAny.jumpTo && typeof navAny.jumpTo === 'function') {
        navAny.jumpTo('Cycle');
        return;
      }

      // Method 2: Try to get parent tab navigator
      let parent = navAny.getParent?.();
      // Keep going up the parent chain to find the tab navigator
      while (parent) {
        if (parent.jumpTo && typeof parent.jumpTo === 'function') {
          parent.jumpTo('Cycle');
          return;
        }
        parent = parent.getParent?.();
      }

      // Method 3: Fallback - navigate to CycleInsight as a stack screen
      // This is registered in the stack navigator and will work
      navigation.navigate('CycleInsight');
    } catch (error) {
      console.error('Error navigating to Cycle tab:', error);
      // Final fallback
      navigation.navigate('CycleInsight');
    }
  };

  const handleLogPeriodFromHome = () => {
    // Navigate to Cycle tab (CycleInsight screen) where period logging is available
    navigateToCycleTab();
  };

  const handleAddPregnancyFromHome = () => {
    setShowPregnancyPrompt(true);
  };

  const handlePregnancyPrompt = async (data: PregnancyPromptData) => {
    if (!data.isPregnant) {
      setShowPregnancyPrompt(false);
      return;
    }

    try {
      setUpdatingPregnancy(true);
      const updateData: any = {
        isPregnant: true,
      };

      if (data.dueDate) {
        updateData.dueDate = data.dueDate.toISOString();
      }

      if (data.lastMenstrualPeriod) {
        updateData.lastMenstrualPeriod = data.lastMenstrualPeriod.toISOString();
      }

      if (data.trimester !== undefined && data.trimester !== null) {
        updateData.trimester = data.trimester;
      }

      const response = await updatePregnancyInfo(updateData);

      if (response.success) {
        setShowPregnancyPrompt(false);
        Alert.alert(
          'Pregnancy Status Updated',
          'We have updated your pregnancy status. Your dashboard will now show pregnancy insights.',
        );
        // Refresh pregnancy status and cycle data
        const pregnancyResponse = await getPregnancyStatus();
        if (pregnancyResponse.success) {
          setPregnancyStatus(
            pregnancyResponse.data.isPregnant ? pregnancyResponse.data : null,
          );
        }
        await refreshCycleData({ force: true });
      } else {
        Alert.alert(
          'Error',
          'Failed to update pregnancy status. Please try again.',
        );
      }
    } catch (error: any) {
      console.error('Error updating pregnancy status:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to update pregnancy status. Please try again.',
      );
    } finally {
      setUpdatingPregnancy(false);
    }
  };

  const todayDate = moment().format('dddd, MMMM D');

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ gap: 16 }}>
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#E4AF5D" />
                </View>
              ) : null}
              {!loading && pregnancyStatus && pregnancyStatus.isPregnant ? (
                <>
                  {/* Pregnancy Progress Card */}
                  <View style={styles.cyclePhaseCard}>
                    <Text style={styles.spacedText}>PREGNANCY PROGRESS</Text>
                    <View style={styles.rowFull}>
                      <View style={styles.rowBottom}>
                        <GradientText fontSize={46} fontFamily="Inter-Regular">
                          {pregnancyStatus.pregnancyWeek || '—'}
                        </GradientText>
                        <Text style={[styles.numberTextMedium, { top: 8 }]}>
                          {' '}
                          / 40
                        </Text>
                      </View>
                      <View style={styles.dayTextContainer}>
                        <Text style={styles.textBlackNormal}>
                          {pregnancyStatus.trimester === 1
                            ? 'First Trimester'
                            : pregnancyStatus.trimester === 2
                            ? 'Second Trimester'
                            : 'Third Trimester'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.progressIndicator}>
                      <LinearGradient
                        style={[
                          styles.progress,
                          {
                            width: `${
                              pregnancyStatus.progressPercentage || 0
                            }%`,
                          },
                        ]}
                        colors={['#E4AF5D', '#E799AD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      />
                    </View>
                    {pregnancyStatus.dueDate && (
                      <Text style={styles.textDarkGrey}>
                        Due date:{' '}
                        {moment(pregnancyStatus.dueDate).format('MMMM D, YYYY')}
                        {pregnancyStatus.daysUntilDueDate !== null &&
                          pregnancyStatus.daysUntilDueDate !== undefined && (
                            <Text>
                              {' '}
                              (
                              {pregnancyStatus.daysUntilDueDate > 0
                                ? `${pregnancyStatus.daysUntilDueDate} days to go`
                                : pregnancyStatus.daysUntilDueDate === 0
                                ? 'Due date is today!'
                                : `${Math.abs(
                                    pregnancyStatus.daysUntilDueDate,
                                  )} days past due date`}
                              )
                            </Text>
                          )}
                      </Text>
                    )}
                  </View>

                  {/* Baby Development Card */}
                  {pregnancyStatus.babyDevelopment && (
                    <TouchableOpacity
                      style={styles.cyclePhaseCard}
                      onPress={navigateToCycleTab}
                    >
                      <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                      <Text style={styles.babyDevelopmentText}>
                        Size of a {pregnancyStatus.babyDevelopment.size}
                      </Text>
                      <Text style={styles.textDarkGrey}>
                        {pregnancyStatus.babyDevelopment.development}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Today's Insights Card */}
                  {pregnancyStatus.trimesterInsights &&
                    pregnancyStatus.trimesterInsights.whatToExpect &&
                    pregnancyStatus.trimesterInsights.whatToExpect.length >
                      0 && (
                      <TouchableOpacity
                        style={styles.cyclePhaseCard}
                        onPress={navigateToCycleTab}
                      >
                        <Text style={styles.spacedText}>TODAY'S INSIGHT</Text>
                        <Text style={styles.textDarkGrey}>
                          {pregnancyStatus.trimesterInsights.whatToExpect[0]}
                        </Text>
                      </TouchableOpacity>
                    )}

                  {/* Link to Cycle History - Only show if user has cycle history */}
                  {periodList.length > 0 && (
                    <TouchableOpacity
                      style={styles.cyclePhaseCard}
                      onPress={navigateToCycleTab}
                    >
                      <Text style={styles.spacedText}>CYCLE HISTORY</Text>
                      <Text style={styles.textDarkGrey}>
                        View your past cycles and insights from before
                        pregnancy. Your cycle data is preserved.
                      </Text>
                      <Text
                        style={[
                          styles.textDarkGrey,
                          {
                            marginTop: 8,
                            color: '#E799AD',
                            fontFamily: 'Inter-SemiBold',
                          },
                        ]}
                      >
                        View Cycle Insights →
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : !cycleStatus || !cycleStatus.isTracking ? (
                <View>
                  <Text style={styles.textDarkGrey}>
                    Cycle tracking is not enabled. Please enable it in your
                    profile settings to see phase insights.
                  </Text>
                </View>
              ) : (
                <>
                  {/* Prediction/Overdue Warning Banner */}
                  {(phaseDataStatus.isPredicted || isOverdue) && (
                    <View style={styles.predictionBanner}>
                      {phaseDataStatus.isPredicted ? (
                        <>
                          <Text style={styles.predictionBannerTitle}>
                            This is a prediction
                          </Text>
                          <Text style={styles.predictionBannerText}>
                            Log your period or add pregnancy info for accurate
                            cycle tracking.
                          </Text>
                          <View style={styles.predictionBannerActions}>
                            <TouchableOpacity
                              style={styles.predictionBannerButton}
                              activeOpacity={0.8}
                              onPress={handleLogPeriodFromHome}
                            >
                              <Text style={styles.predictionBannerButtonText}>
                                Log Period
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.predictionBannerButton,
                                styles.predictionBannerButtonSecondary,
                              ]}
                              activeOpacity={0.8}
                              onPress={handleAddPregnancyFromHome}
                            >
                              <Text
                                style={[
                                  styles.predictionBannerButtonText,
                                  styles.predictionBannerButtonTextSecondary,
                                ]}
                              >
                                Add Pregnancy Info
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : isOverdue ? (
                        <>
                          <Text style={styles.predictionBannerTitle}>
                            Your period is late
                          </Text>
                          <Text style={styles.predictionBannerText}>
                            Your period was expected{' '}
                            {cycleStatus.daysUntilNextPeriod
                              ? `${Math.abs(
                                  cycleStatus.daysUntilNextPeriod,
                                )} days ago`
                              : 'recently'}
                            . Are you possibly pregnant?
                          </Text>
                          <View style={styles.predictionBannerActions}>
                            <TouchableOpacity
                              style={styles.predictionBannerButton}
                              activeOpacity={0.8}
                              onPress={handleLogPeriodFromHome}
                            >
                              <Text style={styles.predictionBannerButtonText}>
                                Log Period
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.predictionBannerButton,
                                styles.predictionBannerButtonSecondary,
                              ]}
                              activeOpacity={0.8}
                              onPress={handleAddPregnancyFromHome}
                            >
                              <Text
                                style={[
                                  styles.predictionBannerButtonText,
                                  styles.predictionBannerButtonTextSecondary,
                                ]}
                              >
                                I might be pregnant
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : null}
                    </View>
                  )}
                  <View
                    style={[
                      phaseDataStatus.isPredicted && styles.predictedPhaseCard,
                    ]}
                  >
                    <View style={styles.row}>
                      <Image
                        style={styles.currentPhaseIconMain}
                        source={images.currentPhaseIconMain}
                      />
                      <Text style={styles.heading}>Current Phase</Text>
                    </View>
                    <View style={styles.phaseTextContainer}>
                      <Text style={styles.textPrimary}>
                        {phaseDataStatus.isPredicted ? 'Predicted: ' : ''}
                        {getPhaseDisplayName(cycleStatus.phase)} - Day{' '}
                        {cycleStatus.cycleDay || '—'}
                      </Text>
                    </View>
                    <View style={styles.colCenter}>
                      <Text style={styles.spacedText}>TODAY</Text>
                      <Text style={styles.textBlackMedium}>{todayDate}</Text>
                    </View>
                    <View style={styles.cyclePhaseCard}>
                      <Text style={styles.spacedText}>CYCLE PROGRESS</Text>

                      <View style={styles.rowFull}>
                        <View style={styles.rowBottom}>
                          <GradientText
                            fontSize={46}
                            fontFamily="Inter-Regular"
                          >
                            {cycleStatus.cycleDay || '—'}
                          </GradientText>
                          <Text style={[styles.numberTextMedium, { top: 8 }]}>
                            {' '}
                            / {cycleStatus.averageCycleLength || 28}
                          </Text>
                        </View>
                        <View style={styles.dayTextContainer}>
                          <Text style={styles.textBlackNormal}>
                            Day {cycleStatus.cycleDay || '—'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.progressIndicator}>
                        <LinearGradient
                          style={[
                            styles.progress,
                            {
                              width: `${calculateProgressPercentage(
                                cycleStatus.cycleDay,
                                cycleStatus.averageCycleLength || 28,
                              )}%`,
                            },
                          ]}
                          colors={['#E4AF5D', '#E799AD']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        ></LinearGradient>
                      </View>
                      <View style={styles.rowFull}>
                        <View>
                          <Text style={styles.spacedText}>CURRENT PHASE</Text>
                          <GradientText
                            fontSize={24}
                            fontFamily="PlayfairDisplay-SemiBold"
                          >
                            {getPhaseDisplayName(cycleStatus.phase)}
                          </GradientText>
                        </View>
                        <Image
                          source={getPhaseIcon(cycleStatus.phase)}
                          style={styles.lutealIcon}
                        />
                      </View>

                      <Text style={styles.textDarkGrey}>
                        {cycleStatus.tagline || '—'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.softCopyContainer}>
                    <Text style={styles.textDarkGrey}>
                      {cycleStatus.description ||
                        'No description available for this phase.'}
                    </Text>
                  </View>
                  {/* Prediction Info Message */}
                  {phaseDataStatus.isPredicted && (
                    <View style={styles.predictionInfoContainer}>
                      <Text style={styles.predictionInfoText}>
                        This information is based on our advanced cycle
                        prediction calculations. To get the most accurate cycle
                        tracking personalized to your body, please log your
                        period start date.
                      </Text>
                    </View>
                  )}
                </>
              )}

              {cycleStatus && cycleStatus.isTracking && (
                <TouchableOpacity
                  style={
                    showInsightDetails
                      ? [styles.sliderRow, { marginBottom: 15 }]
                      : styles.sliderRow
                  }
                  onPress={() => setShowInsightDetails(prev => !prev)}
                >
                  <Image
                    source={images.slideDown}
                    style={
                      showInsightDetails
                        ? styles.slideActiveIcon
                        : styles.slideIcon
                    }
                  />
                  <Text style={styles.greenText}>
                    Tap to {showInsightDetails ? 'hide' : 'see'} detailed
                    insights
                  </Text>
                </TouchableOpacity>
              )}
              {showInsightDetails && cycleStatus && cycleStatus.isTracking && (
                <>
                  <View style={styles.rowFlexBox}>
                    <View style={styles.flexBox}>
                      <Image source={images.energyHigh} style={styles.icon} />
                      <Text style={styles.greenText}>Energy Level</Text>
                      <Text style={styles.textBlackSmall}>
                        {getEnergyLevelText(cycleStatus.energyLevel)}
                      </Text>
                    </View>
                    <View style={styles.flexBox}>
                      <Image source={images.sparkle} style={styles.icon} />
                      <Text style={styles.greenText}>Best For</Text>
                      <Text style={styles.textBlackSmall}>
                        {cycleStatus.bestFor &&
                        Array.isArray(cycleStatus.bestFor) &&
                        cycleStatus.bestFor.length > 0
                          ? cycleStatus.bestFor.join(', ')
                          : '—'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.thisPhaseDataContainer}>
                    {cycleStatus.nutrition &&
                      Array.isArray(cycleStatus.nutrition) &&
                      cycleStatus.nutrition.length > 0 && (
                        <View style={styles.section}>
                          <View style={styles.row}>
                            <Image
                              source={images.nutritionIcon}
                              style={styles.icon}
                            />
                            <Text style={styles.textBlackBold}>
                              Nutrition This Phase
                            </Text>
                          </View>
                          <View>
                            {cycleStatus.nutrition.map((item, index) => (
                              <View key={index} style={styles.row}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.textBlackNormal}>
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    {cycleStatus.movement &&
                      Array.isArray(cycleStatus.movement) &&
                      cycleStatus.movement.length > 0 && (
                        <View style={styles.section}>
                          <View style={styles.row}>
                            <Image
                              source={images.movementIcon}
                              style={styles.icon}
                            />
                            <Text style={styles.textBlackBold}>
                              Movement This Phase
                            </Text>
                          </View>
                          <View>
                            {cycleStatus.movement.map((item, index) => (
                              <View key={index} style={styles.row}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.textBlackNormal}>
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    {cycleStatus.mindset &&
                      Array.isArray(cycleStatus.mindset) &&
                      cycleStatus.mindset.length > 0 && (
                        <View style={styles.section}>
                          <View style={styles.row}>
                            <Image
                              source={images.mindsetIcon}
                              style={styles.icon}
                            />
                            <Text style={styles.textBlackBold}>
                              Mindset & Focus
                            </Text>
                          </View>
                          <View>
                            {cycleStatus.mindset.map((item, index) => (
                              <View key={index} style={styles.row}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.textBlackNormal}>
                                  {item}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                  </View>

                  {cycleStatus.understanding && (
                    <LinearGradient
                      colors={gradients.pinkish}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.pinkishGradient}
                    >
                      <View style={styles.row}>
                        <Image source={images.sparkle} style={styles.icon} />
                        <Text style={styles.textBlackBold}>
                          Understanding This Phase
                        </Text>
                      </View>
                      <Text style={styles.textBlackSmall}>
                        {cycleStatus.understanding}
                      </Text>
                    </LinearGradient>
                  )}
                </>
              )}
            </View>
          </GradientWrapper>

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>Today’s Rituals</Text>
              <Text style={styles.headerProgress}>
                {progress.completed}/{progress.total} Complete
              </Text>
            </View>

            {/* TODAY'S RITUALS */}
            <View style={styles.ritualsSection}>
              {ritualsLoading ? (
                <ActivityIndicator size="small" color={colors.green} />
              ) : null}
              {todayRituals.length > 0 ? (
                todayRituals.map(ritual => (
                  <RitualItem
                    key={ritual.id}
                    title={ritual.title}
                    tag={ritual.tag}
                    description={ritual.description}
                    completed={ritual.completed}
                    onToggle={() => handleRitualPress(ritual.type)}
                  />
                ))
              ) : (
                <Text style={{ color: colors.green, fontSize: 12 }}>
                  Nothing due today
                </Text>
              )}
            </View>

            {/* Bottom Gradient Button */}
            {/* <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateRituals}
              disabled={updatingRituals}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.updateButtonGradient}
              >
                {updatingRituals ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.updateButtonText}>Update Rituals</Text>
                )}
              </LinearGradient>
            </TouchableOpacity> */}
          </View>

          <View style={styles.container2}>
            <View style={styles.symptomCardHeader}>
              <Text style={styles.sectionTitle}>Symptom Summary</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('SymptomHistory')}
              >
                <Text style={styles.symptomHistoryLink}>See History</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.symptomStatusText}>{symptomSummary.statusText}</Text>

            {symptomSummary.todaySymptoms.length > 0 ? (
              <View style={styles.todaySymptomsWrap}>
                {symptomSummary.todaySymptoms.map((item, index) => {
                  const severityColor = getSymptomSeverityColor(item.severity);
                  return (
                    <View key={`${item.symptom}-${index}`} style={styles.symptomChip}>
                      <Text style={styles.symptomChipName}>{item.symptom}</Text>
                      <View
                        style={[
                          styles.symptomSeverityBadge,
                          { backgroundColor: `${severityColor}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.symptomSeverityText,
                            { color: severityColor },
                          ]}
                        >
                          {item.severity}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text style={styles.symptomEmptyText}>
                Log symptoms to start seeing daily highlights.
              </Text>
            )}

            <View style={styles.symptomSummaryRow}>
              <Text style={styles.symptomSummaryLabel}>Last log date</Text>
              <Text style={styles.symptomSummaryValue}>
                {symptomSummary.lastLoggedDate
                  ? moment(symptomSummary.lastLoggedDate).format('MMM D, YYYY')
                  : '—'}
              </Text>
            </View>

            <View style={styles.symptomSummaryRow}>
              <Text style={styles.symptomSummaryLabel}>Top symptoms</Text>
              <Text style={styles.symptomSummaryValue}>
                {symptomSummary.topSymptoms.length > 0
                  ? symptomSummary.topSymptoms.join(', ')
                  : '—'}
              </Text>
            </View>

            <View style={styles.symptomSummaryRow}>
              <Text style={styles.symptomSummaryLabel}>Trend</Text>
              <Text style={styles.symptomSummaryValue}>
                {getTrendLabel(symptomSummary.trend)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.symptomLogButton}
              onPress={() => {
                setSleepSelectedDate(new Date());
                setSymptomsModalVisible(true);
              }}
              disabled={symptomSummary.loading}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.symptomLogButtonGradient}
              >
                {symptomSummary.loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.symptomLogButtonText}>Log Symptoms</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.container2}>
            <View style={styles.sleepCardHeader}>
              <Text style={styles.sectionTitle}>Sleep Summary</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('SleepTracker')}
              >
                <Text style={styles.sleepDetailsLink}>View Details</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sleepStatusText}>{sleepSummary.statusText}</Text>

            <View style={styles.sleepSummaryRow}>
              <Text style={styles.sleepSummaryLabel}>Last night duration</Text>
              <Text style={styles.sleepSummaryValue}>
                {formatDuration(sleepSummary.lastNightDurationMinutes)}
              </Text>
            </View>

            <View style={styles.sleepSummaryRow}>
              <Text style={styles.sleepSummaryLabel}>Sleep quality</Text>
              <View
                style={[
                  styles.sleepQualityBadge,
                  {
                    backgroundColor: getSleepQualityMeta(
                      sleepSummary.lastNightQuality,
                    ).bgColor,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.sleepQualityBadgeText,
                    {
                      color: getSleepQualityMeta(sleepSummary.lastNightQuality)
                        .textColor,
                    },
                  ]}
                >
                  {getSleepQualityMeta(sleepSummary.lastNightQuality).label}
                </Text>
              </View>
            </View>

            <View style={styles.sleepSummaryRow}>
              <Text style={styles.sleepSummaryLabel}>Bed / Wake</Text>
              <Text style={styles.sleepSummaryValue}>
                {`${formatTime(sleepSummary.bedTime)} / ${formatTime(
                  sleepSummary.wakeTime,
                )}`}
              </Text>
            </View>

            <View style={styles.sleepSummaryRow}>
              <Text style={styles.sleepSummaryLabel}>Last logged</Text>
              <Text style={styles.sleepSummaryValue}>
                {sleepSummary.lastLogDate
                  ? moment(sleepSummary.lastLogDate).format('MMM D, YYYY')
                  : '—'}
              </Text>
            </View>

            <View style={styles.sleepStreakPill}>
              <Text style={styles.sleepStreakText}>
                {sleepSummary.streakDays > 0
                  ? `${sleepSummary.streakDays}-day streak`
                  : 'No active streak'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sleepLogButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('SleepTracker')}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sleepLogButtonGradient}
              >
                <Text style={styles.sleepLogButtonText}>Log Sleep</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.container2}>
            <Text style={styles.sectionTitle}>Cycle Insights</Text>

            <View style={styles.insightRow}>
              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.energyHigh} style={styles.icon} />
                  <Text style={styles.insightLabel}>Cycle Length</Text>
                </View>
                <Text style={styles.insightValue}>28 days avg</Text>
                <Text style={styles.insightStatus}>Consistent</Text>
              </View>

              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.sleepQualityIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Sleep Quality</Text>
                </View>
                <Text style={styles.insightValue}>7.8 hrs</Text>
                <Text style={styles.insightStatus}>Improving</Text>
              </View>
            </View>

            <View style={styles.insightRow}>
              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.hydrationIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Hydration</Text>
                </View>
                <Text style={styles.insightValue}>85%</Text>
                <Text style={styles.insightStatus}>Great</Text>
              </View>

              <View style={styles.insightCard}>
                <View style={styles.row}>
                  <Image source={images.energyIcon} style={styles.icon} />
                  <Text style={styles.insightLabel}>Energy Level</Text>
                </View>
                <Text style={styles.insightValue}>High</Text>
                <Text style={styles.insightStatus}>Peak phase</Text>
              </View>
            </View>

            <View style={styles.softCopyContainer}>
              <Text style={styles.textDarkGrey}>
                💡 You've had reduced bloating for two cycles since adding daily
                sauna use
              </Text>
            </View>
          </View> */}
          {/* <GradientWrapper variant="basic">
            <View style={styles.container}>
              <Text style={styles.sectionTitleGreen}>Active Challenge</Text>

              <Text style={styles.challengeTitle}>21-Day Detox Reset</Text>
              <Text style={styles.challengeDisclaimer}>
                Day 8 — You're glowing from the inside out.
              </Text>

              <TouchableOpacity style={styles.updateButton}>
                <LinearGradient
                  colors={gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.updateButtonGradient}
                >
                  <Text style={styles.updateButtonText}>View Challenge</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GradientWrapper> */}
          <GradientWrapper variant="basic">
            <View style={styles.phaseBody}>
              <View style={styles.journalHeaderRow}>
                <Image source={images.journal} style={styles.journalIcon} />
                <Text style={styles.journalTitle}>Wellness Journal</Text>
              </View>
              <Text style={styles.journalSubtitle}>
                Your story unfolds one note at a time. Reflect on your journey,
                express gratitude, and celebrate your progress.
              </Text>
              <View style={styles.journalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('WriteJournal')}
                >
                  <LinearGradient
                    style={styles.journalActionButton}
                    colors={['#E4AF5D', '#E799AD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.journalActionButtonText}>
                      New Entry
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.journalActionButton,
                    styles.journalHistoryButton,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('Journals')}
                >
                  <Text
                    style={[
                      styles.journalActionButtonText,
                      styles.journalHistoryButtonText,
                    ]}
                  >
                    See History
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GradientWrapper>
        </View>
      </ScrollView>
      <SleepLogModal
        visible={sleepModalVisible}
        onClose={() => setSleepModalVisible(false)}
        onConfirm={handleSleepConfirm}
        selectedDate={sleepSelectedDate}
      />
      <PeriodStartModal
        visible={periodModalVisible}
        onClose={() => setPeriodModalVisible(false)}
        onConfirm={handlePeriodConfirm}
        editingPeriod={null}
      />
      <SymptomLogModal
        visible={symptomsModalVisible}
        onClose={() => setSymptomsModalVisible(false)}
        onConfirm={handleSymptomsConfirm}
        selectedDate={sleepSelectedDate}
      />
      <PregnancyPromptModal
        visible={showPregnancyPrompt}
        onClose={() => setShowPregnancyPrompt(false)}
        onConfirm={handlePregnancyPrompt}
        loading={updatingPregnancy}
      />
    </SafeAreaView>
  );
}

const RitualItem = ({
  title,
  tag,
  description,
  completed,
  onToggle,
}: {
  title: string;
  tag: string;
  description: string;
  completed: boolean;
  onToggle: () => void | Promise<void>;
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeaderRow}>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
          <Image
            source={completed ? images.circleChecked : images.circleUnchecked}
            // source={images.circleChecked}
            style={styles.checkIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.7}
          style={{ flex: 1 }}
        >
          <Text style={styles.itemTitle}>{title}</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>● {tag}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemDescription}>{description}</Text>
    </View>
  );
};
