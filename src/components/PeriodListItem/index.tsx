import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Period } from '../../services/api';
import moment from 'moment';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

interface PeriodListItemProps {
  period: Period;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PeriodListItem({
  period,
  onEdit,
  onDelete,
}: PeriodListItemProps) {
  const formatDateRange = () => {
    const start = moment(period.startDate).format('MMM D, YYYY');
    if (!period.endDate) {
      return `${start} – ongoing`;
    }
    const end = moment(period.endDate).format('MMM D, YYYY');
    return `${start} – ${end}`;
  };

  const getPeriodLength = () => {
    if (!period.endDate) return 'In progress';
    const start = moment(period.startDate).startOf('day');
    const end = moment(period.endDate).startOf('day');
    const days = end.diff(start, 'days') + 1;
    return `${days} day${days === 1 ? '' : 's'}`;
  };

  const getFlowColor = () => {
    switch (period.flow) {
      case 'light':
        return '#E6FFF5';
      case 'medium':
        return '#FFF8EB';
      case 'heavy':
        return '#FFEAEF';
      default:
        return colors.borderColorLight;
    }
  };

  const getFlowTextColor = () => {
    switch (period.flow) {
      case 'light':
        return colors.green;
      case 'medium':
        return colors.heading;
      case 'heavy':
        return colors.maroonText;
      default:
        return colors.darkGrey;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onEdit}
      onLongPress={onDelete}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.dateRange}>{formatDateRange()}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{getPeriodLength()}</Text>
            {period.flow && (
              <>
                <Text style={styles.metaSeparator}>•</Text>
                <View
                  style={[
                    styles.flowBadge,
                    { backgroundColor: getFlowColor() },
                  ]}
                >
                  <Text
                    style={[styles.flowText, { color: getFlowTextColor() }]}
                  >
                    {period.flow}
                  </Text>
                </View>
              </>
            )}
          </View>
          {period.symptoms && period.symptoms.length > 0 && (
            <View style={styles.symptomsContainer}>
              <Text style={styles.symptomsLabel}>Symptoms: </Text>
              <Text style={styles.symptomsText}>
                {period.symptoms.slice(0, 3).join(', ')}
                {period.symptoms.length > 3 && ` +${period.symptoms.length - 3}`}
              </Text>
            </View>
          )}
          {period.notes && period.notes.trim() && (
            <Text style={styles.notesText} numberOfLines={1}>
              {period.notes}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={e => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  dateRange: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },
  metaSeparator: {
    fontSize: 13,
    color: colors.darkGrey,
    marginHorizontal: 6,
  },
  flowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: sizes.screenWidth * 0.05,
  },
  flowText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  symptomsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.darkGrey,
  },
  symptomsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },
  notesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    fontStyle: 'italic',
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
  },
});

