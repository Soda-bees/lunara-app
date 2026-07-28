import React from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../style';

type Props = {
  icon: number;
  label: string;
  detail: string;
  isEmpty?: boolean;
};

export default function ProfileStatCard({
  icon,
  label,
  detail,
  isEmpty = false,
}: Props) {
  return (
    <View style={styles.statCard}>
      <Image source={icon} style={styles.statIcon} />
      <Text
        style={[styles.statNumber, isEmpty && styles.statNumberMuted]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {detail}
      </Text>
    </View>
  );
}
