import React from 'react';
import { Text, View } from 'react-native';
import styles from '../style';

export default function FastingHomeHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Metabolic Timer</Text>
      <Text style={styles.subtitle}>
        Cycle-synced fasting that honors your hormones
      </Text>
    </View>
  );
}
