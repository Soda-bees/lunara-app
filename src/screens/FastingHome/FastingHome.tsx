import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import {
  endFastingSession,
  getFastingCurrent,
  getFastingInsights,
  getFastingHistory,
  startFastingSession,
  updateFastingSession,
  FastingSession,
  FastingInsights,
} from '../../services/api';
import { colors } from '../../constants/colors';
import { useCycleData } from '../../context/CycleDataContext';
import { CircularProgress } from '../../components/CircularProgress/CircularProgress';
import { FastingGoalEditor } from '../../components/FastingGoalEditor/FastingGoalEditor';
import {
  fastingMechanisms,
  cycleSyncGuidance,
  fastingResearch,
} from './fastingData';
import images from '../../constants/images';
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'FastingHome'>;

const formatDuration = (minutes: number | null | undefined) => {
  if (!minutes || minutes <= 0) return '0h 00m';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${h}h ${pad(m)}m`;
};

const formatTimerHHMMSS = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return '00:00:00';

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const padMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${padMinutes} ${ampm}`;
};

const getElapsedSeconds = (session: FastingSession | null): number => {
  if (!session) return 0;
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : new Date();
  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return 0;
  return Math.floor(diffMs / 1000);
};

export const FastingHome: React.FC<Props> = () => {
  const { cycleStatus } = useCycleData();
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(
    null,
  );
  const [insights, setInsights] = useState<FastingInsights | null>(null);
  const [history, setHistory] = useState<FastingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedMechanism, setExpandedMechanism] = useState<string | null>(
    null,
  );
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [showAllResearch, setShowAllResearch] = useState(false);
  const [showGoalEditor, setShowGoalEditor] = useState(false);
  const [, setGoalEditorMode] = useState<'start' | 'update'>('update');

  // Update elapsed time every second when there is an active session
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

  const loadData = async () => {
    try {
      const [currentRes, insightsRes, historyRes] = await Promise.all([
        getFastingCurrent(),
        getFastingInsights(7),
        getFastingHistory({ limit: 5 }),
      ]);
      setCurrentSession(currentRes.data || null);
      setInsights(insightsRes.data);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.error('Error loading fasting data', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When user taps Start, first open goal picker
  const handleStart = () => {
    setGoalEditorMode('start');
    setShowGoalEditor(true);
  };

  const handleStartWithGoal = async (targetDurationMinutes: number) => {
    try {
      setLoading(true);
      const res = await startFastingSession({
        customDurationMinutes: targetDurationMinutes,
      });
      setCurrentSession(res.data);
      setShowGoalEditor(false);
    } catch (error) {
      console.error('Error starting fast', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async () => {
    try {
      setLoading(true);
      const res = await endFastingSession({});
      setCurrentSession(res.data);
      await loadData();
    } catch (error) {
      console.error('Error ending fast', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGoal = async (targetDurationMinutes: number) => {
    try {
      setLoading(true);
      const res = await updateFastingSession({ targetDurationMinutes });
      setCurrentSession(res.data);
      setShowGoalEditor(false);
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

  // Calculate target end time
  const getTargetEndTime = (): string | null => {
    if (!currentSession || !targetMinutes) return null;
    const start = new Date(currentSession.startTime);
    const end = new Date(start.getTime() + targetMinutes * 60 * 1000);
    return formatTime(end.toISOString());
  };

  const getTargetEndDate = (): Date | null => {
    if (!currentSession || !targetMinutes) return null;
    const start = new Date(currentSession.startTime);
    return new Date(start.getTime() + targetMinutes * 60 * 1000);
  };

  // Format date for display (Today/Tomorrow or date)
  const formatDateDisplay = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Calculate progress for circular timer (0 to 1)
  const progress = useMemo(() => {
    if (!targetMinutes || !isFasting) return 0;
    const progressValue = elapsedSeconds / (targetMinutes * 60);
    return Math.min(Math.max(progressValue, 0), 1);
  }, [elapsedSeconds, targetMinutes, isFasting]);

  const circleSize = 280;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <BackButton />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Metabolic Timer</Text>
          <Text style={styles.subtitle}>
            Cycle-synced fasting that honors your hormones
          </Text>
        </View>

        {/* Current Fast Status - Circular Timer */}
        <View style={styles.circularTimerContainer}>
          <View style={styles.circularTimerWrapper}>
            <CircularProgress
              progress={isFasting ? progress : 0}
              size={circleSize}
              strokeWidth={18}
              color={colors.heading}
              backgroundColor={colors.disable}
            >
              <View style={styles.timerCenterContent}>
                <Text style={styles.timerLabel}>
                  {isFasting ? 'Elapsed Time' : 'Ready to fast'}
                </Text>
                <Text style={styles.timerDisplay}>
                  {isFasting ? formatTimerHHMMSS(elapsedSeconds) : '00:00:00'}
                </Text>
                <TouchableOpacity
                  style={styles.endFastButton}
                  onPress={isFasting ? handleEnd : handleStart}
                  disabled={loading}
                >
                  <Text style={styles.endFastButtonText}>
                    {isFasting ? 'End Fast' : 'Start Fast'}
                  </Text>
                </TouchableOpacity>
              </View>
            </CircularProgress>

            {/* Flame icon at 7 o'clock */}
          </View>

          {/* Time info sections */}
          <View style={styles.timeInfoSection}>
            <View style={styles.timeInfoItem}>
              <Text style={styles.timeInfoLabel}>Started</Text>
              {isFasting && currentSession ? (
                <>
                  <Text style={styles.timeInfoValue}>
                    {formatDateDisplay(new Date(currentSession.startTime))},{' '}
                    {formatTime(currentSession.startTime)}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.timeInfoValue}>—</Text>
                  <Text style={styles.editLinkDisabled}>
                    Start time set when you begin
                  </Text>
                </>
              )}
            </View>

            <View style={styles.timeInfoItem}>
              <Text style={styles.timeInfoLabel}>Fast Ending</Text>
              {isFasting && currentSession && getTargetEndDate() ? (
                <Text style={styles.timeInfoValue}>
                  {formatDateDisplay(getTargetEndDate()!)}, {getTargetEndTime()}
                </Text>
              ) : (
                <Text style={styles.timeInfoValue}>
                  Select goal when you start
                </Text>
              )}
              <TouchableOpacity onPress={handleStart}>
                <Text style={styles.editLink}>
                  {isFasting && targetMinutes
                    ? `Edit ${Math.floor(targetMinutes / 60)}h goal`
                    : 'Set fasting goal (6h+)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Goal Editor Modal */}
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

        {/* Current Stage / Milestones */}
        {/* {currentStage && (
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneIcon}>{currentStage.icon}</Text>
            <View style={styles.milestoneContent}>
              <View style={styles.milestoneTitleRow}>
                <Text style={styles.milestoneTitle}>{currentStage.label}</Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              </View>
              <Text style={styles.milestoneDescription}>
                {currentStage.description}
              </Text>
            </View>
          </View>

          {nextStage && (
            <View style={styles.nextMilestone}>
              <Text style={styles.nextMilestoneText}>
                Next milestone in {(nextStage.hours - elapsedHours).toFixed(1)} hours
              </Text>
              <View style={styles.nextMilestoneInfo}>
                <Text style={styles.nextMilestoneIcon}>{nextStage.icon}</Text>
                <Text style={styles.nextMilestoneLabel}>{nextStage.label}</Text>
              </View>
            </View>
          )}
        </View>
      )} */}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>
              {insights?.currentStreakDays || 0} days
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏰</Text>
            <Text style={styles.statLabel}>Avg Window</Text>
            <Text style={styles.statValue}>
              {insights?.averageDurationMinutes
                ? formatDuration(insights.averageDurationMinutes)
                : '0h'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statLabel}>Total Fasts</Text>
            <Text style={styles.statValue}>{insights?.totalSessions || 0}</Text>
          </View>
        </View>

        {/* The Deep Science Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionTitle}>The Deep Science</Text>
          </View>
          <Text style={styles.sectionIntro}>
            Fasting isn't just about not eating—it triggers a cascade of
            cellular and metabolic changes that promote healing, longevity, and
            hormonal balance. Here's what happens in your body:
          </Text>

          {fastingMechanisms.map(mechanism => (
            <View
              key={mechanism.title}
              style={
                expandedMechanism === mechanism.title
                  ? [styles.mechanismCard, { borderColor: colors.lightOranger }]
                  : styles.mechanismCard
              }
            >
              <TouchableOpacity
                style={styles.mechanismHeader}
                onPress={() =>
                  setExpandedMechanism(
                    expandedMechanism === mechanism.title
                      ? null
                      : mechanism.title,
                  )
                }
              >
                <View style={styles.mechanismIconContainer}>
                  <Text style={styles.mechanismIcon}>{mechanism.icon}</Text>
                </View>
                <View style={styles.mechanismContent}>
                  <Text style={styles.mechanismTitle}>{mechanism.title}</Text>
                  <Text style={styles.mechanismDescription}>
                    {mechanism.description}
                  </Text>
                </View>
                {/* <Text style={styles.chevron}>
                {expandedMechanism === mechanism.title ? '▼' : '▶'}
              </Text> */}
                <Image
                  source={
                    expandedMechanism === mechanism.title
                      ? images.rightArrow
                      : images.rightArrow
                  }
                  style={
                    expandedMechanism === mechanism.title
                      ? styles.chevronInverted
                      : styles.chevron
                  }
                />
              </TouchableOpacity>

              {expandedMechanism === mechanism.title && (
                <View style={styles.mechanismDetail}>
                  <Text style={styles.mechanismDetailText}>
                    {mechanism.detail}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Fasting Timeline Visual */}
        {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Fasting Timeline</Text>
        <View style={styles.timelineCard}>
          <View style={styles.timelineLineContainer}>
            <View style={styles.timelineLineBackground} />
            <View
              style={[
                styles.timelineLineProgress,
                {
                  height: `${Math.min((elapsedHours / 24) * 100, 100)}%`,
                },
              ]}
            />
          </View>

          <View style={styles.timelineStages}>
            {fastingTimeline.map((stage, index) => {
              const isReached = elapsedHours >= stage.hours;
              const isCurrent =
                elapsedHours >= stage.hours &&
                (index === fastingTimeline.length - 1 ||
                  elapsedHours < fastingTimeline[index + 1].hours);

              return (
                <View
                  key={stage.hours}
                  style={[
                    styles.timelineStage,
                    !isReached && styles.timelineStageInactive,
                  ]}
                >
                  <View
                    style={[
                      styles.timelineStageIcon,
                      isCurrent && styles.timelineStageIconCurrent,
                      isReached && !isCurrent && styles.timelineStageIconReached,
                    ]}
                  >
                    <Text style={styles.timelineStageIconText}>{stage.icon}</Text>
                  </View>
                  <View style={styles.timelineStageContent}>
                    <View style={styles.timelineStageHeader}>
                      <Text style={styles.timelineStageHours}>{stage.hours}h</Text>
                      <Text style={styles.timelineStageLabel}>{stage.label}</Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>You're here</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.timelineStageDescription}>
                      {stage.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View> */}

        {/* Cycle-Synced Fasting */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🌙</Text>
            <Text style={styles.sectionTitle}>Cycle-Synced Fasting</Text>
          </View>
          <Text style={styles.sectionIntro}>
            Unlike men, your metabolism changes throughout your cycle. Smart
            fasting honors these fluctuations rather than fighting them. Here's
            your phase-by-phase guide:
          </Text>

          {cycleSyncGuidance.map(phase => {
            const isExpanded = expandedPhase === phase.phase;
            const isCurrent = phase.phase === currentPhase;

            return (
              <View
                key={phase.phase}
                style={[styles.phaseCard, isCurrent && styles.phaseCardCurrent]}
              >
                <TouchableOpacity
                  style={styles.phaseHeader}
                  onPress={() =>
                    setExpandedPhase(isExpanded ? null : phase.phase)
                  }
                >
                  <Text style={styles.phaseEmoji}>{phase.emoji}</Text>
                  <View style={styles.phaseHeaderContent}>
                    <View style={styles.phaseTitleRow}>
                      <Text style={styles.phaseTitle}>
                        {phase.phase.charAt(0).toUpperCase() +
                          phase.phase.slice(1)}{' '}
                        Phase
                      </Text>
                      {isCurrent && (
                        <View style={styles.currentPhaseBadge}>
                          <Text style={styles.currentPhaseBadgeText}>
                            Current
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.phaseWindow}>
                      {phase.window} window
                    </Text>
                  </View>
                  {/* <Text style={styles.chevron}>{isExpanded ? '▼' : '▶'}</Text> */}
                  <Image
                    source={isExpanded ? images.rightArrow : images.rightArrow}
                    style={isExpanded ? styles.chevronInverted : styles.chevron}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.phaseContent}>
                    <View style={styles.phaseApproach}>
                      <Text style={styles.phaseApproachText}>
                        {phase.approach}
                      </Text>
                    </View>
                    <Text style={styles.phaseDescription}>
                      {phase.description}
                    </Text>

                    <View style={styles.phaseSection}>
                      <Text style={styles.phaseSectionTitle}>
                        ✓ Recommendations
                      </Text>
                      {phase.recommendations.map((rec, i) => (
                        <Text key={i} style={styles.phaseListItem}>
                          <Text style={styles.phaseListBulletRecommend}>•</Text>{' '}
                          {rec}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.phaseSection}>
                      <Text
                        style={[
                          styles.phaseSectionTitle,
                          styles.phaseSectionTitleAvoid,
                        ]}
                      >
                        ⚠ Avoid
                      </Text>
                      {phase.avoid.map((item, i) => (
                        <Text key={i} style={styles.phaseListItem}>
                          <Text style={styles.phaseListBulletAvoid}>•</Text>{' '}
                          {item}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.phaseScience}>
                      <Text style={styles.phaseScienceTitle}>
                        🧬 The Science
                      </Text>
                      <Text style={styles.phaseScienceText}>
                        {phase.science}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Research Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>✨</Text>
              <Text style={styles.sectionTitle}>The Research</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowAllResearch(!showAllResearch)}
            >
              <Text style={styles.viewAllText}>
                {showAllResearch ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          </View>

          {(showAllResearch
            ? fastingResearch
            : fastingResearch.slice(0, 3)
          ).map((study, index) => (
            <View key={index} style={styles.researchCard}>
              <Text style={styles.researchFinding}>"{study.finding}"</Text>
              <Text style={styles.researchSource}>
                — {study.source}, {study.year}
              </Text>
            </View>
          ))}
        </View>

        {/* Current Phase Guide Quick Reference */}
        {currentPhaseGuide && (
          <View style={styles.phaseGuideCard}>
            <View style={styles.phaseGuideHeader}>
              <Text style={styles.phaseGuideEmoji}>
                {currentPhaseGuide.emoji}
              </Text>
              <View>
                <Text style={styles.phaseGuideTitle}>
                  Your{' '}
                  {currentPhaseGuide.phase.charAt(0).toUpperCase() +
                    currentPhaseGuide.phase.slice(1)}{' '}
                  Fasting Guide
                </Text>
                <Text style={styles.phaseGuideApproach}>
                  {currentPhaseGuide.approach}
                </Text>
              </View>
            </View>

            <View style={styles.phaseGuideWindow}>
              <Text style={styles.phaseGuideWindowIcon}>⏰</Text>
              <Text style={styles.phaseGuideWindowText}>
                Recommended window:{' '}
                <Text style={styles.phaseGuideWindowBold}>
                  {currentPhaseGuide.window}
                </Text>
              </Text>
            </View>

            <Text style={styles.phaseGuideDescription}>
              {currentPhaseGuide.description}
            </Text>
          </View>
        )}

        {/* Why Women Fast Differently */}
        <View style={styles.educationCard}>
          <Text style={styles.educationTitle}>Why Women Fast Differently</Text>
          <Text style={styles.educationText}>
            Most fasting research was conducted on men or post-menopausal women.
            But cycling women have a completely different hormonal landscape
            that changes weekly.
          </Text>
          <Text style={styles.educationText}>
            Aggressive fasting during the luteal phase can increase cortisol,
            disrupt thyroid function, and worsen PMS symptoms. But gentle,
            phase-aligned fasting can enhance hormonal balance and metabolic
            health.
          </Text>
          <Text style={styles.educationQuote}>
            "Your cycle is not a problem to overcome—it's intelligence to work
            with." — Dr. Mindy Pelz
          </Text>
        </View>

        {/* Recent History */}
        <View style={styles.reentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            {/* <TouchableOpacity>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity> */}
          </View>

          {history.length > 0 ? (
            <View style={styles.historyCard}>
              {history.map((entry, index) => {
                const date = new Date(entry.startTime);
                const dateStr = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                });
                const duration =
                  entry.actualDurationMinutes ||
                  entry.targetDurationMinutes ||
                  0;

                return (
                  <View
                    key={entry._id}
                    style={[
                      styles.historyItem,
                      index < history.length - 1 && styles.historyItemBorder,
                    ]}
                  >
                    <View style={styles.historyItemLeft}>
                      <Text style={styles.historyItemDate}>{dateStr}</Text>
                      <Text style={styles.historyItemPhase}>
                        {currentPhase.charAt(0).toUpperCase() +
                          currentPhase.slice(1)}{' '}
                        Phase
                      </Text>
                    </View>
                    <View style={styles.historyItemRight}>
                      <Text style={styles.historyItemDuration}>
                        {formatDuration(duration)}
                      </Text>
                      {entry.status === 'completed' && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>✓</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.historyCard}>
              <Text style={styles.emptyHistoryText}>
                Start logging your fasts to see your history here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.darkGrey,
  },
  circularTimerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circularTimerWrapper: {
    position: 'relative',
    width: 280,
    height: 280,
    marginBottom: 24,
  },
  timerCenterContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.darkGrey,
  },
  timerDisplay: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: colors.black,
    letterSpacing: 1,
  },
  endFastButton: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.heading,
    backgroundColor: colors.white,
  },
  endFastButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.heading,
  },
  flameIconPositioned: {
    position: 'absolute',
    width: 30,
    height: 30,
    zIndex: 20,
  },
  flameIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.heading,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameIconText: {
    fontSize: 16,
  },
  timeInfoSection: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  timeInfoItem: {
    flex: 1,
  },
  timeInfoLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.darkGrey,
    marginBottom: 4,
  },
  timeInfoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.black,
    marginBottom: 4,
  },
  editLink: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.heading,
  },
  editLinkDisabled: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.disabledText,
  },
  startFastContainer: {
    width: '100%',
    paddingVertical: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.heading,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
  },
  milestoneCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.heading,
  },
  milestoneHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  milestoneIcon: {
    fontSize: 32,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  milestoneTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.black,
  },
  activeBadge: {
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: colors.white,
  },
  milestoneDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.darkGrey,
  },
  nextMilestone: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },
  nextMilestoneText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.disabledText,
    marginBottom: 8,
  },
  nextMilestoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextMilestoneIcon: {
    fontSize: 20,
  },
  nextMilestoneLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.disabledText,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.black,
  },
  section: {
    marginBottom: 24,
  },

  reentSection: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.black,
  },
  sectionIntro: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.green,
    lineHeight: 20,
    marginBottom: 16,
  },
  mechanismCard: {
    backgroundColor: colors.white,
    // borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
  },
  mechanismHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  mechanismIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mechanismIcon: {
    fontSize: 20,
  },
  mechanismContent: {
    flex: 1,
  },
  mechanismTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
    marginBottom: 2,
  },
  mechanismDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
  },

  chevron: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
    tintColor: colors.green,
  },

  chevronInverted: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
    tintColor: colors.green,
  },
  mechanismDetail: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 68,
  },
  mechanismDetailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.darkGrey,
    lineHeight: 20,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  timelineLineContainer: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
  },
  timelineLineBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.borderColor,
  },
  timelineLineProgress: {
    position: 'absolute',
    top: 0,
    width: 2,
    backgroundColor: colors.heading,
  },
  timelineStages: {
    gap: 16,
  },
  timelineStage: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  timelineStageInactive: {
    opacity: 0.4,
  },
  timelineStageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.disable,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -9,
  },
  timelineStageIconReached: {
    backgroundColor: colors.lightOranger,
  },
  timelineStageIconCurrent: {
    backgroundColor: colors.heading,
  },
  timelineStageIconText: {
    fontSize: 18,
  },
  timelineStageContent: {
    flex: 1,
    paddingTop: 8,
  },
  timelineStageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineStageHours: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.heading,
  },
  timelineStageLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
  },
  currentBadge: {
    backgroundColor: colors.disable,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.darkGrey,
  },
  timelineStageDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  phaseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  phaseCardCurrent: {
    borderColor: colors.heading,
    backgroundColor: colors.headingLight,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  phaseEmoji: {
    fontSize: 24,
  },
  phaseHeaderContent: {
    flex: 1,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  phaseTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
  },
  currentPhaseBadge: {
    backgroundColor: colors.heading,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentPhaseBadgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.white,
  },
  phaseWindow: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  phaseContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 68,
    gap: 12,
  },
  phaseApproach: {
    alignSelf: 'flex-start',
    backgroundColor: colors.disable,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  phaseApproachText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.black,
  },
  phaseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.darkGrey,
    lineHeight: 20,
  },
  phaseSection: {
    marginTop: 8,
  },
  phaseSectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.heading,
    marginBottom: 6,
  },
  phaseSectionTitleAvoid: {
    color: colors.darkPink,
  },
  phaseListItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
    lineHeight: 18,
    marginBottom: 4,
  },
  phaseListBulletRecommend: {
    color: colors.heading,
  },
  phaseListBulletAvoid: {
    color: colors.darkPink,
  },
  phaseScience: {
    backgroundColor: colors.disable,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  phaseScienceTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.heading,
    marginBottom: 4,
  },
  phaseScienceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
    lineHeight: 18,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.heading,
  },
  researchCard: {
    backgroundColor: colors.headingLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  researchFinding: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginBottom: 8,
  },
  researchSource: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  phaseGuideCard: {
    backgroundColor: colors.headingLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.lightOranger,
  },
  phaseGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  phaseGuideEmoji: {
    fontSize: 32,
  },
  phaseGuideTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 4,
  },
  phaseGuideApproach: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  phaseGuideWindow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  phaseGuideWindowIcon: {
    fontSize: 16,
  },
  phaseGuideWindowText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.black,
  },
  phaseGuideWindowBold: {
    fontFamily: 'Inter-SemiBold',
  },
  phaseGuideDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.darkGrey,
    lineHeight: 20,
  },
  educationCard: {
    backgroundColor: colors.headingLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  educationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 12,
  },
  educationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.darkGrey,
    lineHeight: 20,
    marginBottom: 12,
  },
  educationQuote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.disabledText,
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.borderColor,
  },
  historyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyItemDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
    marginBottom: 2,
  },
  historyItemPhase: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  historyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyItemDuration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.heading,
  },
  completedBadge: {
    width: 25,
    height: 22,
    borderRadius: 7,
    backgroundColor: colors.borderPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadgeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
    color: colors.green,
  },
  emptyHistoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.disabledText,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default FastingHome;
