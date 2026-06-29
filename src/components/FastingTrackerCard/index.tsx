import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { FastingGoalEditor } from '../FastingGoalEditor/FastingGoalEditor';
import { colors } from '../../constants/colors';
import { gradients } from '../../constants/gradientColors';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import type { useFastingTracker } from '../../hooks/useFastingTracker';
import GradientWrapper from '../GradientWrapper';
import { sizes } from '../../constants/sizes';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';

type FastingTrackerState = ReturnType<typeof useFastingTracker>;

type Props = FastingTrackerState & {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
};

export default function FastingTrackerCard({
  navigation,
  isFasting,
  elapsedLabel,
  targetMinutes,
  progress,
  loading,
  showGoalEditor,
  openStartFlow,
  closeGoalEditor,
  startWithGoal,
  endFast,
}: Props) {
  const progressPct = Math.round(progress * 100);
  const { isPartnerMode } = usePartnerMode();

  const guardWrite = (action: () => void) => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    action();
  };

  return (
    <GradientWrapper variant="basic">
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Metabolic Timer</Text>
        </View>

        {isFasting ? (
          <>
            <Text style={styles.statusText}>Fast in progress</Text>
            <Text style={styles.timer}>{elapsedLabel}</Text>
            {targetMinutes ? (
              <Text style={styles.goalText}>
                Goal {formatDuration(targetMinutes)} · {progressPct}%
              </Text>
            ) : null}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.journalActionButton,
                  styles.journalHistoryButton,
                ]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('FastingHome')}
                disabled={loading}
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

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  guardWrite(() => {
                    endFast().catch(() => {});
                  });
                }}
                disabled={loading}
              >
                <LinearGradient
                  style={styles.journalActionButton}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.heading} size="small" />
                  ) : (
                    <Text style={styles.journalActionButtonText}>End Fast</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.statusText}>
              No active fast. Start when you are ready.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              activeOpacity={0.8}
              onPress={() => guardWrite(openStartFlow)}
              disabled={loading}
            >
              <LinearGradient
                colors={gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.startButtonText}>Start fast</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <FastingGoalEditor
          visible={showGoalEditor}
          onClose={closeGoalEditor}
          onSave={minutes => {
            startWithGoal(minutes).catch(() => {});
          }}
          currentGoalMinutes={null}
          startTime={new Date().toISOString()}
          loading={loading}
        />
      </View>
    </GradientWrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 16,
    gap: 12,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  detailsLink: {
    fontSize: 13,
    color: colors.heading,
    fontFamily: 'Inter-Medium',
  },
  statusText: {
    fontSize: 13,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  timer: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: colors.black,
    letterSpacing: 1,
  },
  goalText: {
    fontSize: 12,
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.black,
  },
  endBtnWrap: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.heading,
    backgroundColor: colors.headingLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endBtnText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.heading,
  },
  startButton: {
    marginTop: 4,
  },
  startButtonGradient: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  journalActionButton: {
    paddingVertical: 9,
    borderRadius: sizes.screenWidth * 0.03,
    width: sizes.screenWidth * 0.4,
    alignItems: 'center',
  },
  journalActionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  journalHistoryButton: {
    backgroundColor: colors.borderPink,
  },
  journalHistoryButtonText: {
    color: colors.maroonText,
  },
});
