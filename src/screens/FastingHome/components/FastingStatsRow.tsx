import React from 'react';
import { Text, View } from 'react-native';
import { FastingInsights } from '../../../services/api';
import { formatDuration } from '../fastingHomeUtils';
import styles from '../style';

type Props = {
  insights: FastingInsights | null;
};

export default function FastingStatsRow({ insights }: Props) {
  return (
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
  );
}
