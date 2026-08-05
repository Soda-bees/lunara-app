import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { HomeRitual } from '../../../hooks/useHomeRituals';
import type { RitualSection } from '../../../services/api';
import { colors } from '../../../constants/colors';
import HomeRitualItem from './HomeRitualItem';
import styles from '../style';

type Props = {
  loading: boolean;
  completed: number;
  total: number;
  todayRituals: HomeRitual[];
  ritualsBySection: Record<RitualSection, HomeRitual[]>;
  onLibraryPress: () => void;
  onRitualPress: (ritual: HomeRitual) => void;
};

const BLOCKS: { key: RitualSection; label: string }[] = [
  { key: 'morning', label: 'Morning' },
  { key: 'midday', label: 'Midday' },
  { key: 'evening', label: 'Evening' },
];

export default function HomeRitualsSection({
  loading,
  completed,
  total,
  todayRituals,
  ritualsBySection,
  onLibraryPress,
  onRitualPress,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Today’s Rituals</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={onLibraryPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.headerLink}>Library</Text>
          </TouchableOpacity>
          <Text style={styles.headerProgress}>
            {completed}/{total}
          </Text>
        </View>
      </View>

      {/* TODAY'S RITUALS */}
      <View style={styles.ritualsSection}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.green} />
        ) : null}
        {todayRituals.length > 0 ? (
          <>
            {BLOCKS.map(block => {
              const rows = ritualsBySection[block.key];
              if (rows.length === 0) return null;
              return (
                <View key={block.key}>
                  <Text style={styles.sectionHeading}>{block.label}</Text>
                  {rows.map(ritual => (
                    <HomeRitualItem
                      key={ritual.id}
                      ritual={ritual}
                      onPress={() => onRitualPress(ritual)}
                    />
                  ))}
                </View>
              );
            })}
          </>
        ) : (
          <Text style={{ color: colors.green, fontSize: 12 }}>
            Nothing due today
          </Text>
        )}
      </View>

      {/* Bottom Gradient Button */}
      {/* <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateRituals}
        disabled={updatingRituals}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.updateButtonGradient}
        >
          {updatingRituals ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.updateButtonText}>Update Rituals</Text>
          )}
        </LinearGradient>
      </TouchableOpacity> */}
    </View>
  );
}
