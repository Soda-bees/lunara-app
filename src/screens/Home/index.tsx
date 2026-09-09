import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StatusBar,
  View,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import {
  getPregnancyStatus,
  getWeeklyPlanning,
  PregnancyStatusResponse,
  updatePregnancyInfo,
  createPeriod,
} from '../../services/api';
import { toLocalYyyyMmDd } from '../../utils/weeklyNutritionDisplay';
import {
  dismissWeeklyPlanPrompt,
  wasWeeklyPlanPromptDismissed,
} from '../../utils/weeklyPlanPromptStorage';
import PregnancyPromptModal, {
  PregnancyPromptData,
} from '../../components/PregnancyPromptModal';
import { useHomeRituals, type HomeRitual } from '../../hooks/useHomeRituals';
import { useFastingTracker } from '../../hooks/useFastingTracker';
import FastingTrackerCard from '../../components/FastingTrackerCard';
import SleepLogModal from '../../components/SleepLogModal';
import PeriodStartModal, {
  PeriodLogData,
} from '../../components/PeriodStartModal';
import SymptomLogModal from '../../components/SymptomLogModal';
import { useCycleData } from '../../context/CycleDataContext';
import HomeStatusHero from './components/HomeStatusHero';
import HomeRitualsSection from './components/HomeRitualsSection';
import HomeSymptomCard from './components/HomeSymptomCard';
import HomeSleepCard from './components/HomeSleepCard';
import HomeJournalSection from './components/HomeJournalSection';
import styles from './style';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
    ritualsBySection,
    symptomSummary,
    sleepSummary,
    refreshAll,
    toggleOptionalRitual,
  } = useHomeRituals();

  const fastingTracker = useFastingTracker();
  const refreshFasting = fastingTracker.refresh;

  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [symptomsModalVisible, setSymptomsModalVisible] = useState(false);
  const [sleepSelectedDate, setSleepSelectedDate] = useState<Date>(new Date());

  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [showPregnancyPrompt, setShowPregnancyPrompt] = useState(false);
  const [updatingPregnancy, setUpdatingPregnancy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const handleSleepConfirm = () => {
    void refreshAll({ force: true });
  };

  const handleSymptomsConfirm = () => {
    void refreshAll({ force: true });
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
        await refreshAll({ force: true });
        Alert.alert('Success', 'Period logged successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to log period.');
      }
    } catch (error: any) {
      console.error('Error creating period from Home:', error);
      Alert.alert('Error', error.message || 'Failed to log period.');
    }
  };

  const handleRitualInteract = (ritual: HomeRitual) => {
    if (
      ritual.type === 'optional' &&
      ritual.interaction === 'check' &&
      ritual.ritualKey
    ) {
      void toggleOptionalRitual(ritual.ritualKey, !ritual.completed);
      return;
    }

    if (ritual.type === 'sleep') {
      setSleepSelectedDate(new Date());
      setSleepModalVisible(true);
      return;
    }

    if (ritual.type === 'symptoms') {
      setSleepSelectedDate(new Date());
      setSymptomsModalVisible(true);
      return;
    }

    if (ritual.type === 'nutrition') {
      if (ritual.navigationTarget === 'WeeklyMealPlanning') {
        navigation.navigate('WeeklyMealPlanning');
        return;
      }
      navigation.navigate('Track', { initialCategory: 'Nutrition' });
      return;
    }

    if (ritual.type === 'movement') {
      navigation.navigate('Track', { initialCategory: 'Movement' });
      return;
    }

    if (ritual.type === 'optional' && ritual.interaction === 'action') {
      const target = ritual.navigationTarget;
      const params = ritual.actionParams || {};
      if (target === 'SleepTracker') {
        setSleepSelectedDate(new Date());
        setSleepModalVisible(true);
        return;
      }
      if (target === 'CycleInsight') {
        navigation.navigate('CycleInsight', {
          tab: (params.tab as string) || 'symptoms',
        });
        return;
      }
      if (target === 'Track') {
        const c = (params.initialCategory || params.tab) as string | undefined;
        const initialCategory =
          c === 'Nutrition' || c === 'Movement' || c === 'Mindful'
            ? c
            : 'Nutrition';
        navigation.navigate('Track', { initialCategory });
        return;
      }
      if (target === 'WeeklyMealOverview') {
        navigation.navigate('WeeklyMealOverview');
        return;
      }
      if (target === 'WeeklyMealPlanning') {
        navigation.navigate('WeeklyMealPlanning');
        return;
      }
      if (target === 'FastingHome') {
        navigation.navigate('FastingHome');
        return;
      }
    }
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
      refreshAll().catch(() => {});
      refreshFasting().catch(() => {});
    }, [refreshAll, refreshFasting]),
  );

  const weeklyPlanPromptChecked = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (weeklyPlanPromptChecked.current) {
        return;
      }
      weeklyPlanPromptChecked.current = true;

      const maybePromptWeeklyPlan = async () => {
        try {
          const res = await getWeeklyPlanning();
          const plan = res.data?.weeklyPlan;
          if (plan?.status === 'generated' || plan?.status === 'skipped') {
            return;
          }
          const weekStart =
            res.data?.weekStart != null
              ? toLocalYyyyMmDd(res.data.weekStart)
              : toLocalYyyyMmDd(new Date());
          if (await wasWeeklyPlanPromptDismissed(weekStart)) {
            return;
          }
          Alert.alert(
            'Plan your week',
            'Set up Monday–Sunday meals and your grocery list for this week.',
            [
              {
                text: 'Not now',
                style: 'cancel',
                onPress: () => {
                  void dismissWeeklyPlanPrompt(weekStart);
                },
              },
              {
                text: 'Plan now',
                onPress: () => {
                  navigation.navigate('WeeklyMealPlanning');
                },
              },
            ],
          );
        } catch {
          // ignore — user can plan from Track
        }
      };

      void maybePromptWeeklyPlan();
    }, [navigation]),
  );

  // Pull-to-refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshAll({ force: true }),
        refreshFasting({ force: true }),
      ]);
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
  }, [refreshAll, refreshFasting]);

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
          <HomeStatusHero
            loading={loading}
            cycleLoading={cycleStatusState.loading}
            pregnancyStatus={pregnancyStatus}
            cycleStatus={cycleStatus}
            periodList={periodList}
            onNavigateToCycle={navigateToCycleTab}
            onLogPeriod={handleLogPeriodFromHome}
            onAddPregnancy={handleAddPregnancyFromHome}
          />

          <HomeRitualsSection
            loading={ritualsLoading}
            completed={progress.completed}
            total={progress.total}
            todayRituals={todayRituals}
            ritualsBySection={ritualsBySection}
            onLibraryPress={() => navigation.navigate('RitualLibrary')}
            onRitualPress={handleRitualInteract}
          />

          <FastingTrackerCard navigation={navigation} {...fastingTracker} />

          <HomeSymptomCard
            symptomSummary={symptomSummary}
            onSeeHistory={() => navigation.navigate('SymptomHistory')}
            onLogSymptoms={() => {
              setSleepSelectedDate(new Date());
              setSymptomsModalVisible(true);
            }}
          />

          <HomeSleepCard
            sleepSummary={sleepSummary}
            onViewDetails={() => navigation.navigate('SleepTracker')}
            onLogSleep={() => navigation.navigate('SleepTracker')}
          />

          <HomeJournalSection
            onNewEntry={() => navigation.navigate('WriteJournal')}
            onSeeHistory={() => navigation.navigate('Journals')}
          />
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
