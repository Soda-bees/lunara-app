import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import type { SleepSummary } from '../../../../hooks/useHomeRituals';
import {
  formatDuration,
  formatTime,
  getSleepQualityMeta,
} from '../partnerHomeUtils';
import { partnerHomeStyles as styles } from '../style';

type Props = {
  sleepSummary: SleepSummary;
  onViewDetails: () => void;
};

export default function PartnerSleepCard({
  sleepSummary,
  onViewDetails,
}: Props) {
  const qualityMeta = getSleepQualityMeta(sleepSummary.lastNightQuality);

  return (
    <View style={styles.container2}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.sectionTitle}>Sleep Summary</Text>
        {sleepSummary.hasAnyLogged ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onViewDetails}>
            <Text style={styles.cardLink}>View Details</Text>
          </TouchableOpacity>
        ) : null}
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
                { backgroundColor: qualityMeta.bgColor },
              ]}
            >
              <Text
                style={[
                  styles.sleepQualityBadgeText,
                  { color: qualityMeta.textColor },
                ]}
              >
                {qualityMeta.label}
              </Text>
            </View>
          </View>

          <View style={styles.sleepSummaryRow}>
            <Text style={styles.sleepSummaryLabel}>Bed / Wake</Text>
            <Text style={styles.sleepSummaryValue}>
              {`${formatTime(sleepSummary.bedTime)} / ${formatTime(sleepSummary.wakeTime)}`}
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

          {sleepSummary.streakDays > 0 ? (
            <View style={styles.sleepStreakPill}>
              <Text style={styles.sleepStreakText}>
                {sleepSummary.streakDays}-day sleep logging streak
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.symptomEmptyText}>No sleep logged yet.</Text>
      )}
    </View>
  );
}
