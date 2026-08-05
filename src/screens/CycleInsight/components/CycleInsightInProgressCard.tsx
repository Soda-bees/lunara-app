import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from '../style';

type Props = {
  onEndPeriodToday: () => void;
};

export default function CycleInsightInProgressCard({
  onEndPeriodToday,
}: Props) {
  return (
    <View style={styles.inProgressCard}>
      <Text style={styles.inProgressTitle}>Period in progress</Text>
      <Text style={styles.inProgressText}>
        You have a period logged without an end date. When your period ends, add
        an end date to keep your insights accurate.
      </Text>
      <TouchableOpacity
        style={styles.inProgressButton}
        activeOpacity={0.8}
        onPress={onEndPeriodToday}
      >
        <Text style={styles.inProgressButtonText}>Mark as ended today</Text>
      </TouchableOpacity>
    </View>
  );
}
