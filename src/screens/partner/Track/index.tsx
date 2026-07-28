import React, { useCallback, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../../components/Header';
import CycleIndicatorCard from '../../../components/CycleIndicatorCard';
import { useCycleData } from '../../../context/CycleDataContext';
import { usePartnerMode } from '../../../context/PartnerModeContext';
import { useWorkoutPlan } from '../../../hooks/useWorkoutPlan';
import PartnerTrackHeader from './components/PartnerTrackHeader';
import PartnerNutritionSection from './components/PartnerNutritionSection';
import PartnerMovementSection from './components/PartnerMovementSection';
import { getPartnerDisplayNames } from './partnerTrackUtils';
import { partnerTrackStyles as styles } from './style';

export default function PartnerTrack() {
  const { primaryUserName } = usePartnerMode();
  const { partnerName, partnerNamePossessive } =
    getPartnerDisplayNames(primaryUserName);
  const { cycleStatus, refreshCycleData } = useCycleData();
  const cycle = cycleStatus.data;
  const isPregnant =
    Boolean(cycle?.isPaused) && cycle?.pauseReason === 'pregnancy';

  const [refreshToken, setRefreshToken] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const { plan: workoutPlan, refetch: refetchWorkoutPlan } =
    useWorkoutPlan(today);

  const dailyMovementLogs = useMemo(() => {
    const logs = workoutPlan?.loggedWorkouts || [];
    return [...logs].sort(
      (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
    );
  }, [workoutPlan?.loggedWorkouts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshCycleData(), refetchWorkoutPlan()]);
      setRefreshToken(token => token + 1);
    } finally {
      setRefreshing(false);
    }
  }, [refreshCycleData, refetchWorkoutPlan]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header showBackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PartnerTrackHeader />
        <CycleIndicatorCard
          loading={cycleStatus.loading}
          isTracking={Boolean(cycle?.isTracking)}
          isPregnant={isPregnant}
          cycleDay={cycle?.cycleDay}
          averageCycleLength={cycle?.averageCycleLength || 28}
          phase={cycle?.phase}
          tagline={cycle?.tagline}
          widthMultiplier={0.9}
          backgroundGradientColors={['#FBFAF8', '#DFE7F7']}
          wrapperStyle={styles.flushOuterMargin}
        />
        <PartnerNutritionSection
          partnerName={partnerName}
          partnerNamePossessive={partnerNamePossessive}
          refreshToken={refreshToken}
        />
        <PartnerMovementSection
          partnerNamePossessive={partnerNamePossessive}
          today={today}
          dailyMovementLogs={dailyMovementLogs}
          refreshToken={refreshToken}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
