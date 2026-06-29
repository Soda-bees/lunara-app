import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import type { HomeRitual } from '../../../../hooks/useHomeRituals';
import type { RitualSection } from '../../../../services/api';
import { colors } from '../../../../constants/colors';
import PartnerRitualItem from './PartnerRitualItem';
import { partnerHomeStyles as styles } from '../style';

type Props = {
  loading: boolean;
  completed: number;
  total: number;
  ritualsBySection: Record<RitualSection, HomeRitual[]>;
};

const BLOCKS: { key: RitualSection; label: string }[] = [
  { key: 'morning', label: 'Morning' },
  { key: 'midday', label: 'Midday' },
  { key: 'evening', label: 'Evening' },
];

export default function PartnerRitualsOverview({
  loading,
  completed,
  total,
  ritualsBySection,
}: Props) {
  const hasRituals = total > 0;
  const visibleBlocks = BLOCKS.filter(
    block => (ritualsBySection[block.key] ?? []).length > 0,
  );

  return (
    <View style={styles.ritualsContainer}>
      <View style={styles.ritualsHeaderRow}>
        <Text style={styles.ritualsHeaderTitle}>Today&apos;s plan</Text>
        {total > 0 ? (
          <Text style={styles.ritualsHeaderProgress}>
            {completed}/{total}
          </Text>
        ) : null}
      </View>

      <View style={styles.ritualsSection}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.green} />
        ) : !hasRituals ? (
          <Text style={styles.ritualEmpty}>Nothing scheduled for today</Text>
        ) : (
          visibleBlocks.map((block, index) => {
            const rows = ritualsBySection[block.key] ?? [];
            return (
              <View key={block.key}>
                {index > 0 ? <View style={styles.divider} /> : null}
                <Text style={styles.sectionHeading}>{block.label}</Text>
                {rows.map(ritual => (
                  <PartnerRitualItem key={ritual.id} ritual={ritual} />
                ))}
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
