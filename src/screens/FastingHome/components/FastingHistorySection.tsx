import React from 'react';
import { Text, View } from 'react-native';
import { FastingSession } from '../../../services/api';
import { formatDuration } from '../fastingHomeUtils';
import styles from '../style';

type Props = {
  history: FastingSession[];
  currentPhase: string;
};

export default function FastingHistorySection({
  history,
  currentPhase,
}: Props) {
  return (
    <View style={styles.reentSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent History</Text>
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
  );
}
