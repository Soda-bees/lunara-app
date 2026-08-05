import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CircularProgress } from '../../../components/CircularProgress/CircularProgress';
import { colors } from '../../../constants/colors';
import { FastingSession } from '../../../services/api';
import {
  formatDateDisplay,
  formatTime,
  formatTimerHHMMSS,
  getTargetEndDate,
  getTargetEndTime,
} from '../fastingHomeUtils';
import styles from '../style';

type Props = {
  isFasting: boolean;
  loading: boolean;
  progress: number;
  elapsedSeconds: number;
  currentSession: FastingSession | null;
  targetMinutes: number | null | undefined;
  onStart: () => void;
  onEnd: () => void;
  circleSize?: number;
};

export default function FastingTimerSection({
  isFasting,
  loading,
  progress,
  elapsedSeconds,
  currentSession,
  targetMinutes,
  onStart,
  onEnd,
  circleSize = 280,
}: Props) {
  const targetEndDate = getTargetEndDate(currentSession, targetMinutes);
  const targetEndTime = getTargetEndTime(currentSession, targetMinutes);

  return (
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
              onPress={isFasting ? onEnd : onStart}
              disabled={loading}
            >
              <Text style={styles.endFastButtonText}>
                {isFasting ? 'End Fast' : 'Start Fast'}
              </Text>
            </TouchableOpacity>
          </View>
        </CircularProgress>
      </View>

      <View style={styles.timeInfoSection}>
        <View style={styles.timeInfoItem}>
          <Text style={styles.timeInfoLabel}>Started</Text>
          {isFasting && currentSession ? (
            <Text style={styles.timeInfoValue}>
              {formatDateDisplay(new Date(currentSession.startTime))},{' '}
              {formatTime(currentSession.startTime)}
            </Text>
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
          {isFasting && currentSession && targetEndDate ? (
            <Text style={styles.timeInfoValue}>
              {formatDateDisplay(targetEndDate)}, {targetEndTime}
            </Text>
          ) : (
            <Text style={styles.timeInfoValue}>Select goal when you start</Text>
          )}
          <TouchableOpacity onPress={onStart}>
            <Text style={styles.editLink}>
              {isFasting && targetMinutes
                ? `Edit ${Math.floor(targetMinutes / 60)}h goal`
                : 'Set fasting goal (6h+)'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
