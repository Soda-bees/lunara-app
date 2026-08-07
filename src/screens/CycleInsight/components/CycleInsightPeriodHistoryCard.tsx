import React, { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../../constants/images/cycle';
import { colors } from '../../../constants/colors';
import { Period } from '../../../services/api';
import { formatPeriodRange, getPeriodLengthLabel } from '../cycleInsightUtils';
import styles from '../style';

type Props = {
  periodList: Period[];
  readOnly?: boolean;
  onEditPeriod?: (period: Period) => void;
  onDeletePeriod?: (period: Period) => void;
  onNavigateCycleHistory: () => void;
};

/**
 * MOB-038 profiling note: mapping the full periodList inside the parent ScrollView
 * mounts every row at once (was capped at 5; uncapped history still janks on re-render).
 * Nest FlatList (+ maxHeight) only past the former preview size; short lists stay inline.
 */
const HISTORY_INLINE_THRESHOLD = 5;
const HISTORY_LIST_MAX_HEIGHT = Math.round(
  Math.min(420, Dimensions.get('window').height * 0.45),
);

export default function CycleInsightPeriodHistoryCard({
  periodList,
  readOnly = false,
  onEditPeriod,
  onDeletePeriod,
  onNavigateCycleHistory,
}: Props) {
  const needsInnerScroll = periodList.length > HISTORY_INLINE_THRESHOLD;

  const renderPeriod = useCallback(
    ({ item: period }: { item: Period }) => {
      if (readOnly) {
        return (
          <View style={[styles.historyRow, { opacity: 0.7 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyRangeText}>
                {formatPeriodRange(period)}
              </Text>
              <Text style={styles.historyMetaText}>
                {getPeriodLengthLabel(period)}
                {period.flow ? ` • Flow: ${period.flow}` : ''}
              </Text>
            </View>
          </View>
        );
      }

      return (
        <TouchableOpacity
          style={styles.historyRow}
          onPress={() => onEditPeriod?.(period)}
          onLongPress={() => onDeletePeriod?.(period)}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.historyRangeText}>
              {formatPeriodRange(period)}
            </Text>
            <Text style={styles.historyMetaText}>
              {getPeriodLengthLabel(period)}
              {period.flow ? ` • Flow: ${period.flow}` : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onEditPeriod?.(period)}
            style={{ padding: 8 }}
          >
            <Text style={[styles.historyMetaText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [readOnly, onEditPeriod, onDeletePeriod],
  );

  if (periodList.length === 0) return null;

  return (
    <View style={styles.historyCard}>
      <View style={styles.headerRow}>
        <Image source={images.periodCalender} style={styles.calenderImage} />
        <Text style={styles.cycleText}>Recent Cycle History</Text>
      </View>
      <FlatList
        data={periodList}
        keyExtractor={item => item._id}
        renderItem={renderPeriod}
        scrollEnabled={needsInnerScroll}
        nestedScrollEnabled={needsInnerScroll}
        style={
          needsInnerScroll ? { maxHeight: HISTORY_LIST_MAX_HEIGHT } : undefined
        }
        showsVerticalScrollIndicator={false}
        initialNumToRender={HISTORY_INLINE_THRESHOLD}
        windowSize={7}
        maxToRenderPerBatch={HISTORY_INLINE_THRESHOLD}
        removeClippedSubviews={needsInnerScroll}
      />
      {needsInnerScroll ? (
        <View style={styles.historyFooter}>
          <Text style={styles.historyFooterText}>
            Scroll for more • Logged periods total: {periodList.length}
          </Text>
          <TouchableOpacity
            onPress={onNavigateCycleHistory}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onNavigateCycleHistory}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllButtonText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
