import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '../../../../constants/colors';
import type { MovementScienceItem } from '../../../../services/api';
import { partnerTrackStyles as styles } from '../style';

type Props = {
  items: MovementScienceItem[];
  loading: boolean;
  error: string | null;
};

export default function PartnerMovementScienceList({
  items,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <View style={[styles.container2, styles.loadingRow]}>
        <ActivityIndicator color={colors.heading} />
        <Text style={styles.mutedText}>Loading movement science...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container2}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container2}>
      <Text style={styles.sectionTitle}>Movement science</Text>
      {items.map((item, index) => (
        <View style={styles.infoRow} key={`${item.title}-${index}`}>
          <Text style={styles.scienceEmoji}>{item.image}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.scienceTitle}>{item.title}</Text>
            <Text style={styles.scienceDesc}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
