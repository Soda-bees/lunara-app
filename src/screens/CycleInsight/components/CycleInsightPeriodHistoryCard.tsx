import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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

export default function CycleInsightPeriodHistoryCard({
  periodList,
  readOnly = false,
  onEditPeriod,
  onDeletePeriod,
  onNavigateCycleHistory,
}: Props) {
  if (periodList.length === 0) return null;

  return (
    <View style={styles.historyCard}>
      <View style={styles.headerRow}>
        <Image source={images.periodCalender} style={styles.calenderImage} />
        <Text style={styles.cycleText}>Recent Cycle History</Text>
      </View>
      {periodList.slice(0, 5).map(period => {
        if (readOnly) {
          return (
            <View
              key={period._id}
              style={[styles.historyRow, { opacity: 0.7 }]}
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
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={period._id}
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
              <Text
                style={[styles.historyMetaText, { color: colors.primary }]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
      {periodList.length > 5 && (
        <View style={styles.historyFooter}>
          <Text style={styles.historyFooterText}>
            Showing last 5 periods • Logged periods total: {periodList.length}
          </Text>
          <TouchableOpacity
            onPress={onNavigateCycleHistory}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
      )}
      {periodList.length <= 5 && periodList.length > 0 && (
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
