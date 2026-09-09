import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { FastingGoalEditor } from '../../components/FastingGoalEditor/FastingGoalEditor';
import { useCycleData } from '../../context/CycleDataContext';
import { useFastingData } from '../../context/FastingDataContext';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { RootStackParamList } from '../../navigation/stackNavigation';
import {
  endFastingSession,
  startFastingSession,
  updateFastingSession,
} from '../../services/api';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';
import FastingCycleSyncSection from './components/FastingCycleSyncSection';
import FastingHistorySection from './components/FastingHistorySection';
import FastingHomeHeader from './components/FastingHomeHeader';
import FastingMechanismsSection from './components/FastingMechanismsSection';
import FastingPhaseGuideSection from './components/FastingPhaseGuideSection';
import FastingResearchSection from './components/FastingResearchSection';
import FastingStatsRow from './components/FastingStatsRow';
import FastingTimerSection from './components/FastingTimerSection';
import FastingWomenDifferSection from './components/FastingWomenDifferSection';
import { cycleSyncGuidance } from './fastingData';
import { getElapsedSeconds } from './fastingHomeUtils';
import styles from './style';

type Props = NativeStackScreenProps<RootStackParamList, 'FastingHome'>;

export const FastingHome: React.FC<Props> = () => {
  const { cycleStatus } = useCycleData();
  const { isPartnerMode } = usePartnerMode();
  const {
    current,
    insights: insightsState,
    history: historyState,
    refreshFasting,
    applyCurrentSession,
    refreshInsightsAndHistory,
  } = useFastingData();
  const currentSession = current.data;
  const insights = insightsState.data;
  const history = historyState.data || [];
  const [loading, setLoading] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [, setGoalEditorMode] = useState<'start' | 'update'>('update');

  const [tick, setTick] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (currentSession && currentSession.status === 'active') {
      interval = setInterval(() => {
        setTick(t => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSession]);

  const elapsedSeconds = useMemo(
    () => getElapsedSeconds(currentSession),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentSession?._id,
      currentSession?.startTime,
      currentSession?.endTime,
      tick,
    ],
  );

  const targetMinutes = currentSession?.targetDurationMinutes;

  const isFasting = !!currentSession && currentSession.status === 'active';

  const currentPhase = useMemo(() => {
    const raw = cycleStatus.data?.phase;
    if (
      raw === 'menstrual' ||
      raw === 'follicular' ||
      raw === 'ovulatory' ||
      raw === 'luteal'
    ) {
      return raw;
    }
    return 'follicular';
  }, [cycleStatus.data?.phase]);

  const currentPhaseGuide =
    cycleSyncGuidance.find(g => g.phase === currentPhase) ||
    cycleSyncGuidance[1];

  useEffect(() => {
    refreshFasting().catch(error => {
      console.error('Error loading fasting data', error);
    });
  }, [refreshFasting]);

  const handleStart = () => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    setGoalEditorMode('start');
    setShowGoalEditor(true);
  };

  const handleStartWithGoal = async (targetDurationMinutes: number) => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    try {
      setLoading(true);
      const res = await startFastingSession({
        customDurationMinutes: targetDurationMinutes,
      });
      applyCurrentSession(res.data);
      setShowGoalEditor(false);
      await refreshInsightsAndHistory();
    } catch (error) {
      console.error('Error starting fast', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    try {
      setLoading(true);
      const res = await endFastingSession({});
      applyCurrentSession(res.data);
      await refreshInsightsAndHistory();
    } catch (error) {
      console.error('Error ending fast', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (targetDurationMinutes: number) => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    try {
      setLoading(true);
      const res = await updateFastingSession({ targetDurationMinutes });
      applyCurrentSession(res.data);
      setShowGoalEditor(false);
      await refreshInsightsAndHistory();
    } catch (error) {
      console.error('Error updating goal', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSave = (targetDurationMinutes: number) => {
    if (isFasting) {
      setGoalEditorMode('update');
      return handleUpdateGoal(targetDurationMinutes);
    }
    setGoalEditorMode('start');
    return handleStartWithGoal(targetDurationMinutes);
  };

  const progress = useMemo(() => {
    if (!targetMinutes || !isFasting) return 0;
    const progressValue = elapsedSeconds / (targetMinutes * 60);
    return Math.min(Math.max(progressValue, 0), 1);
  }, [elapsedSeconds, targetMinutes, isFasting]);

  const circleSize = 280;

  return (
    <SafeAreaView style={styles.container} edges={['top','bottom']}>
      <BackButton />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <FastingHomeHeader />

        <FastingTimerSection
          isFasting={isFasting}
          loading={loading}
          progress={progress}
          elapsedSeconds={elapsedSeconds}
          currentSession={currentSession}
          targetMinutes={targetMinutes}
          onStart={handleStart}
          onEnd={handleEnd}
          circleSize={circleSize}
        />

        <FastingGoalEditor
          visible={showGoalEditor}
          onClose={() => setShowGoalEditor(false)}
          onSave={handleGoalSave}
          currentGoalMinutes={
            isFasting ? currentSession?.targetDurationMinutes : null
          }
          startTime={
            isFasting && currentSession
              ? currentSession.startTime
              : new Date().toISOString()
          }
          loading={loading}
        />

        <FastingStatsRow insights={insights} />

        <FastingMechanismsSection />

        <FastingCycleSyncSection currentPhase={currentPhase} />

        <FastingResearchSection />

        {currentPhaseGuide && (
          <FastingPhaseGuideSection currentPhaseGuide={currentPhaseGuide} />
        )}

        <FastingWomenDifferSection />

        <FastingHistorySection history={history} currentPhase={currentPhase} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FastingHome;
