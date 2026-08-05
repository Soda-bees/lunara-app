import React, { useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import images from '../../constants/images';
import CycleCalendar from '../../components/CycleCalender';
import SymptomTrends from '../../components/SymptomTrends';
import PhaseGuide from '../../components/PhaseGuide';
import CycleIndicatorCard from '../../components/CycleIndicatorCard';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';
import {
  createPeriod,
  updatePeriod,
  deletePeriod,
  Period,
  getPregnancyStatus,
  PregnancyStatusResponse,
  updatePregnancyInfo,
  getPregnancyHistory,
  PregnancySymptom,
  getWeeklyUpdatesByPhase,
  getDidYouKnowByPhase,
  getPersonalizedInsight,
  WeeklyUpdate,
  DidYouKnow,
} from '../../services/api';
import moment from 'moment';
import PregnancySymptomModal from '../../components/PregnancySymptomModal';
import PregnancyPromptModal, {
  PregnancyPromptData,
} from '../../components/PregnancyPromptModal';
import { getPhaseDataStatus } from '../../utils/cycleUtils';
import { useCycleData } from '../../context/CycleDataContext';
import {
  FALLBACK_DID_YOU_KNOW,
  FALLBACK_WEEKLY_UPDATES,
} from './cycleInsightConstants';
import CycleInsightLoadingView from './components/CycleInsightLoadingView';
import CycleInsightPregnancyView from './components/CycleInsightPregnancyView';
import CycleInsightNotTrackingView from './components/CycleInsightNotTrackingView';
import CycleInsightPhaseOverview from './components/CycleInsightPhaseOverview';
import CycleInsightPeriodHistoryCard from './components/CycleInsightPeriodHistoryCard';
import CycleInsightAnalyticsCard from './components/CycleInsightAnalyticsCard';
import CycleInsightFertilityCard from './components/CycleInsightFertilityCard';
import CycleInsightWeeklyUpdates from './components/CycleInsightWeeklyUpdates';
import CycleInsightDidYouKnow from './components/CycleInsightDidYouKnow';
import CycleInsightInProgressCard from './components/CycleInsightInProgressCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function CycleInsight() {
  const navigation = useNavigation<NavigationProp>();
  const [showModal, setShowModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [lastPeriodStart, setLastPeriodStart] = useState<Date | null>(null);
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showCycleHistory, setShowCycleHistory] = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [showPregnancyPrompt, setShowPregnancyPrompt] = useState(false);
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
  const [loggingPeriod, setLoggingPeriod] = useState(false);
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

  const fetchPhaseContent = async (phase: string) => {
    if (!phase || phase === 'unknown') {
      setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      return;
    }

    try {
      setLoadingWeeklyUpdates(true);
      setLoadingDidYouKnow(true);

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

      if (
        weeklyUpdatesResponse.success &&
        weeklyUpdatesResponse.data.length > 0
      ) {
        setWeeklyUpdates(weeklyUpdatesResponse.data);
      } else {
        setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      }

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
      setWeeklyUpdates(FALLBACK_WEEKLY_UPDATES);
      setDidYouKnow(FALLBACK_DID_YOU_KNOW);
      setPersonalizedInsight(null);
    } finally {
      setLoadingWeeklyUpdates(false);
      setLoadingDidYouKnow(false);
    }
  };

  const fetchCycleData = useCallback(async () => {
    try {
      const pregnancyResponse = await getPregnancyStatus();
      if (pregnancyResponse.success && pregnancyResponse.data.isPregnant) {
        setIsPregnant(true);
        setPregnancyStatus(pregnancyResponse.data);
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

  useFocusEffect(
    React.useCallback(() => {
      fetchCycleData();
    }, [fetchCycleData]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshCycleData({ force: true });

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

      if (cycle && cycle.phase) {
        fetchPhaseContent(cycle.phase);
      }
    } catch (error) {
      console.error('Error refreshing cycle data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshCycleData, cycle]);

  const handlePeriodLog = async (data: PeriodLogData) => {
    setLoggingPeriod(true);
    try {
      if (isPregnant) {
        setLoggingPeriod(false);
        Alert.alert(
          'Pregnancy Mode',
          'Cycle tracking is paused during pregnancy. Your cycle history is preserved and visible here.',
        );
        return;
      }
      if (!cycle || !cycle.isTracking) {
        setLoggingPeriod(false);
        Alert.alert('Error', 'Cycle tracking is not enabled');
        return;
      }

      if (editingPeriod) {
        const response = await updatePeriod(editingPeriod._id, {
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          flow: data.flow,
          symptoms: data.symptoms,
          notes: data.notes,
        });

        if (response.success) {
          setShowModal(false);
          setEditingPeriod(null);
          await refreshCycleData({ force: true });
          Alert.alert('Success', 'Period updated successfully!');
        }
      } else {
        const response = await createPeriod({
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          flow: data.flow,
          symptoms: data.symptoms,
          notes: data.notes,
        });

        if (response.success) {
          setShowModal(false);
          setEditingPeriod(null);
          await refreshCycleData({ force: true });
          Alert.alert(
            'Success',
            data.endDate
              ? 'Period logged successfully!'
              : 'Period start logged! You can add the end date later when your period ends.',
          );
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
    } finally {
      setLoggingPeriod(false);
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

  const isOverdue =
    typeof cycle?.daysUntilNextPeriod === 'number' &&
    cycle.daysUntilNextPeriod < 0;

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

  const handlePregnancyPrompt = async (data: PregnancyPromptData) => {
    setShowPregnancyPrompt(false);

    if (!data.isPregnant) {
      return;
    }

    try {
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
        Alert.alert(
          'Pregnancy Status Updated',
          'We have updated your pregnancy status. Your dashboard will now show pregnancy insights.',
        );
        await fetchCycleData();
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
    }
  };

  if (loading && !hasCycleData) {
    return <CycleInsightLoadingView />;
  }

  if (isPregnant && pregnancyStatus) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <CycleInsightPregnancyView
            pregnancyStatus={pregnancyStatus}
            pregnancySymptoms={pregnancySymptoms}
            periodList={periodList}
            analyticsData={analyticsData}
            onLogSymptom={() => setShowSymptomModal(true)}
            onNavigatePregnancyHistory={() =>
              navigation.navigate('PregnancyHistory')
            }
            onNavigateCycleHistory={() => navigation.navigate('CycleHistory')}
          />
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

  if (!cycle || !cycle.isTracking) {
    return (
      <CycleInsightNotTrackingView
        loading={loading}
        isPregnant={isPregnant}
        cycle={cycle}
        onNavigatePregnancyInfo={() => navigation.navigate('PregnancyInfo')}
      />
    );
  }

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
      <Header />
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
          <CycleInsightPhaseOverview
            cycle={cycle}
            periodList={periodList}
            phaseDataStatus={phaseDataStatus}
            isOverdue={isOverdue}
            isPregnant={isPregnant}
            onLogPeriodStart={handleOpenNewPeriodModal}
            onPregnancyPrompt={() => setShowPregnancyPrompt(true)}
          />

          <TouchableOpacity
            style={styles.logButton}
            activeOpacity={0.8}
            onPress={handleOpenNewPeriodModal}
          >
            <Image source={images.logWaterDrop} style={styles.dropImg} />
            <Text style={styles.text}>Log Period Start</Text>
          </TouchableOpacity>

          <PeriodStartModal
            visible={showModal}
            onClose={handleCloseModal}
            onConfirm={handlePeriodLog}
            editingPeriod={editingPeriod}
            loading={loggingPeriod}
          />
          <PregnancyPromptModal
            visible={showPregnancyPrompt}
            onClose={() => setShowPregnancyPrompt(false)}
            onConfirm={handlePregnancyPrompt}
          />
          {hasOngoingPeriod && !isPregnant && (
            <CycleInsightInProgressCard onEndPeriodToday={handleEndPeriodToday} />
          )}
          {!isPregnant && (
            <CycleInsightFertilityCard
              cycle={cycle}
              lastPeriodStart={lastPeriodStart}
            />
          )}
          {periodList.length > 0 && (
            <CycleInsightPeriodHistoryCard
              periodList={periodList}
              onEditPeriod={handleEditPeriod}
              onDeletePeriod={handleDeletePeriod}
              onNavigateCycleHistory={() => navigation.navigate('CycleHistory')}
            />
          )}
          <CycleInsightAnalyticsCard analyticsData={analyticsData} />
          {!isPregnant && (
            <CycleCalendar
              periodStart={lastPeriodStart}
              cycleLength={cycle?.averageCycleLength || 28}
              periodLength={cycle?.averagePeriodLength || 5}
              periods={periodList}
              currentPhase={cycle?.phase}
              cycleDay={cycle?.cycleDay}
              onLogPeriodStart={date => {
                setEditingPeriod(null);
                setShowModal(true);
              }}
              onLogPeriodEnd={date => {
                const ongoingPeriod = periodList.find(
                  p => p.startDate && !p.endDate,
                );
                if (ongoingPeriod) {
                  handleEditPeriod(ongoingPeriod);
                }
              }}
              onViewPeriodDetails={date => {
                const periodForDate = periodList.find((p: Period) => {
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
          {!isPregnant && <SymptomTrends />}
          <CycleInsightWeeklyUpdates
            weeklyUpdates={weeklyUpdates}
            loadingWeeklyUpdates={loadingWeeklyUpdates}
          />
          <PhaseGuide />
          <CycleInsightDidYouKnow
            personalizedInsight={personalizedInsight}
            didYouKnow={didYouKnow}
            loadingDidYouKnow={loadingDidYouKnow}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
