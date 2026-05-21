import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import type { WeeklyPlanningStatus } from '../../utils/weeklyNutritionDisplay';

type Props = {
  planningStatus: WeeklyPlanningStatus;
  onPlanPress: () => void;
  compact?: boolean;
};

export default function WeeklyMealPlanEmptyCard({
  planningStatus,
  onPlanPress,
  compact = false,
}: Props) {
  const isSkipped = planningStatus === 'skipped';

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <Text style={styles.title}>
        {isSkipped ? 'Weekly plan skipped' : 'Plan your week'}
      </Text>
      <Text style={styles.body}>
        {isSkipped
          ? 'You chose to skip weekly meal planning this week. Generate a plan anytime to unlock Mon–Sun meals and your grocery list.'
          : 'Set up Monday–Sunday meals and your grocery list. Choose how many meals and snacks you want each day.'}
      </Text>
      <TouchableOpacity style={styles.button} onPress={onPlanPress}>
        <Text style={styles.buttonText}>
          {isSkipped ? 'Generate weekly plan' : 'Plan my week'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 12,
    backgroundColor: '#FFF8EB',
    padding: 16,
    marginBottom: 12,
  },
  cardCompact: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 8,
  },
  body: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
    marginBottom: 14,
  },
  button: {
    backgroundColor: colors.heading,
    borderRadius: sizes.screenWidth * 0.03,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});
