import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  type CompositeNavigationProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCycleData } from '../../../context/CycleDataContext';
import { usePartnerMode } from '../../../context/PartnerModeContext';
import { useHomeRituals } from '../../../hooks/useHomeRituals';
import { useFastingTracker } from '../../../hooks/useFastingTracker';
import type { RootStackParamList } from '../../../navigation/stackNavigation';
import type { PartnerStackParamList } from '../../../navigation/partnerTabNavigator';
import {
  getPregnancyStatus,
  type PregnancyStatusResponse,
} from '../../../services/api';
import images from '../../../constants/images';
import PartnerHomeHeader from './components/PartnerHomeHeader';
import PartnerStatusHero from './components/PartnerStatusHero';
import PartnerSymptomCard from './components/PartnerSymptomCard';
import PartnerSleepCard from './components/PartnerSleepCard';
import PartnerFastingCard from './components/PartnerFastingCard';
import PartnerRitualsOverview from './components/PartnerRitualsOverview';
import PartnerExploreSection, {
  type ExploreItem,
} from './components/PartnerExploreSection';
import PartnerExitSection from './components/PartnerExitSection';
import { partnerHomeStyles as styles } from './style';

type NavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<PartnerStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function PartnerHome() {
  const navigation = useNavigation<NavigationProp>();
  const { primaryUserName } = usePartnerMode();
  const {
    cycleStatus: cycleStatusState,
    refreshCycleData,
  } = useCycleData();
  const cycleStatus = cycleStatusState.data;
  const cycleLoading = cycleStatusState.loading;

  const {
    ritualsLoading,
    progress,
    ritualsBySection,
    symptomSummary,
    sleepSummary,
    refreshAll,
  } = useHomeRituals();

  const fastingTracker = useFastingTracker();
  const [pregnancyStatus, setPregnancyStatus] = useState<
    PregnancyStatusResponse['data'] | null
  >(null);
  const [pregnancyLoading, setPregnancyLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPregnancyStatus = useCallback(async () => {
    try {
      const res = await getPregnancyStatus();
      if (res.success) {
        setPregnancyStatus(res.data);
      }
    } catch {
      setPregnancyStatus(null);
    } finally {
      setPregnancyLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPregnancyStatus();
  }, [loadPregnancyStatus]);

  const heroLoading =
    (cycleStatusState.loading && cycleStatusState.data == null) ||
    pregnancyLoading;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refreshAll(),
        refreshCycleData({ force: true }),
        fastingTracker.refresh(),
        loadPregnancyStatus(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [
    refreshAll,
    refreshCycleData,
    fastingTracker.refresh,
    loadPregnancyStatus,
  ]);

  const exploreItems = useMemo<ExploreItem[]>(
    () => [
      {
        id: 'cycle',
        title: 'Cycle insights',
        subtitle: 'Phases, patterns, and predictions',
        icon: images.btCycle,
        onPress: () => navigation.navigate('Cycle'),
      },
      {
        id: 'track',
        title: 'Nutrition & movement',
        subtitle: 'Daily rituals and activity',
        icon: images.nutritionApple,
        onPress: () => navigation.navigate('Track', undefined),
      },
      {
        id: 'journal',
        title: 'Wellness journal',
        subtitle: 'Reflections and notes',
        icon: images.journal,
        onPress: () => navigation.navigate('Journals'),
      },
      {
        id: 'profile',
        title: 'Profile & stats',
        subtitle: 'Account and wellness overview',
        icon: images.profileIcon,
        onPress: () => navigation.navigate('Profile'),
      },
    ],
    [navigation],
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PartnerHomeHeader primaryUserName={primaryUserName} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PartnerStatusHero
          loading={heroLoading}
          cycleLoading={cycleLoading}
          primaryUserName={primaryUserName}
          pregnancyStatus={pregnancyStatus}
          cycleStatus={cycleStatus}
          onViewInsights={() => navigation.navigate('Cycle')}
        />

        <PartnerSymptomCard
          symptomSummary={symptomSummary}
          onViewHistory={() => navigation.navigate('SymptomHistory')}
        />

        <PartnerSleepCard
          sleepSummary={sleepSummary}
          onViewDetails={() => navigation.navigate('SleepTracker')}
        />

        <PartnerFastingCard
          loading={fastingTracker.loading}
          isFasting={fastingTracker.isFasting}
          elapsedLabel={fastingTracker.elapsedLabel}
          targetMinutes={fastingTracker.targetMinutes ?? null}
          progress={fastingTracker.progress}
          onViewHistory={() => navigation.navigate('FastingHome')}
        />

        <PartnerRitualsOverview
          loading={ritualsLoading}
          completed={progress.completed}
          total={progress.total}
          ritualsBySection={ritualsBySection}
        />

        <PartnerExploreSection items={exploreItems} />

        <PartnerExitSection />
      </ScrollView>
    </SafeAreaView>
  );
}
