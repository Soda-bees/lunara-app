import React from 'react';
import { Text, View } from 'react-native';
import type { RitualSection } from '../../utils/ritualSections';
import { formatRitualSection } from './workoutDisplay';
import styles from './style';

type Props = {
  title: string;
  description: string;
  durationMinutes: number;
  ritualSection: RitualSection;
};

export default function CustomWorkoutPreview({
  title,
  description,
  durationMinutes,
  ritualSection,
}: Props) {
  const displayTitle = title.trim();
  if (!displayTitle) return null;

  const sectionLabel = formatRitualSection(ritualSection);
  const metaPills = [
    durationMinutes > 0 ? `${durationMinutes} min` : null,
    sectionLabel || null,
    'Custom',
  ].filter(Boolean) as string[];

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>{displayTitle}</Text>
      <View style={styles.metaRow}>
        {metaPills.map(pill => (
          <View key={pill} style={styles.metaPill}>
            <Text style={styles.metaPillText}>{pill}</Text>
          </View>
        ))}
      </View>
      {description.trim() ? (
        <Text style={styles.summaryDescription} numberOfLines={3}>
          {description.trim()}
        </Text>
      ) : null}
    </View>
  );
}
