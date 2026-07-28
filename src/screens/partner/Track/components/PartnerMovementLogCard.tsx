import React from 'react';
import { Text, View } from 'react-native';
import type { LoggedWorkout } from '../../../../services/api';
import { partnerTrackStyles as styles } from '../style';

type Props = {
  partnerNamePossessive: string;
  logs: LoggedWorkout[];
};

export default function PartnerMovementLogCard({
  partnerNamePossessive,
  logs,
}: Props) {
  return (
    <View style={styles.container2}>
      <Text style={styles.sectionTitle}>
        {partnerNamePossessive} movement today
      </Text>
      {logs.length === 0 ? (
        <Text style={styles.mutedText}>No movement logged today.</Text>
      ) : (
        logs.map(entry => (
          <View style={styles.logRow} key={entry._id || entry.loggedAt}>
            <View style={{ flex: 1 }}>
              <Text style={styles.logTitle}>
                {entry.workoutTitleSnapshot || 'Workout'}
              </Text>
              <Text style={styles.logMeta}>
                {entry.durationMinutes} min
                {entry.isCustom ? ' • Custom' : ''}
              </Text>
            </View>
            <Text style={styles.logMeta}>
              {new Date(entry.loggedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
