import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SectionList,
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

/** MOB-036: nest virtu only when the section would exceed ~half the screen. */
const RITUALS_LIST_MAX_HEIGHT = Math.round(
  Math.min(560, Dimensions.get('window').height * 0.55),
);
/** Approx. rows that fit without needing an inner scroller. */
const RITUALS_INLINE_THRESHOLD = 6;

type RitualSectionRow = {
  key: RitualSection;
  title: string;
  data: HomeRitual[];
};

export default function HomeRitualsSection({
  loading,
  completed,
  total,
  todayRituals,
  ritualsBySection,
  onLibraryPress,
  onRitualPress,
}: Props) {
  const sections = useMemo<RitualSectionRow[]>(
    () =>
      BLOCKS.map(block => ({
        key: block.key,
        title: block.label,
        data: ritualsBySection[block.key],
      })).filter(section => section.data.length > 0),
    [ritualsBySection],
  );

  const needsInnerScroll = todayRituals.length > RITUALS_INLINE_THRESHOLD;

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

      {/* TODAY'S RITUALS — SectionList (MOB-036 virtualization) */}
      <View style={styles.ritualsSection}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.green} />
        ) : null}
        {todayRituals.length > 0 ? (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <HomeRitualItem
                ritual={item}
                onPress={() => onRitualPress(item)}
              />
            )}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeading}>{section.title}</Text>
            )}
            stickySectionHeadersEnabled={false}
            nestedScrollEnabled={needsInnerScroll}
            scrollEnabled={needsInnerScroll}
            style={
              needsInnerScroll ? { maxHeight: RITUALS_LIST_MAX_HEIGHT } : undefined
            }
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            windowSize={7}
            maxToRenderPerBatch={8}
            removeClippedSubviews={needsInnerScroll}
          />
        ) : (
          <Text style={{ color: colors.green, fontSize: 12 }}>
            Nothing due today
          </Text>
        )}
      </View>
    </View>
  );
}
