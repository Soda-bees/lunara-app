import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import type { SleepSummary } from '../../../hooks/useHomeRituals';
import { gradients } from '../../../constants/gradientColors';
import {
  formatDuration,
  formatTime,
  getSleepQualityMeta,
} from '../homeUtils';
import styles from '../style';

type Props = {
  sleepSummary: SleepSummary;
  onViewDetails: () => void;
  onLogSleep: () => void;
};

export default function HomeSleepCard({
  sleepSummary,
  onViewDetails,
  onLogSleep,
}: Props) {
  return (
    <View style={styles.container2}>
      <View style={styles.sleepCardHeader}>
        <Text style={styles.sectionTitle}>Sleep Summary</Text>
        {sleepSummary.hasAnyLogged && (
          <TouchableOpacity activeOpacity={0.7} onPress={onViewDetails}>
            <Text style={styles.sleepDetailsLink}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sleepStatusText}>{sleepSummary.statusText}</Text>

      {sleepSummary.hasAnyLogged ? (
        <>
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
        </>
      ) : (
        <Text style={styles.symptomEmptyText}>
          No sleep data yet. Log your first sleep to start seeing insights.
        </Text>
      )}

      <TouchableOpacity
        style={styles.sleepLogButton}
        activeOpacity={0.8}
        onPress={onLogSleep}
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
  );
}
