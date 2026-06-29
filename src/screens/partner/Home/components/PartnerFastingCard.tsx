import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import GradientWrapper from '../../../../components/GradientWrapper';
import { colors } from '../../../../constants/colors';
import { formatFastingDuration } from '../partnerHomeUtils';
import { partnerHomeStyles as styles } from '../style';

type Props = {
  loading: boolean;
  isFasting: boolean;
  elapsedLabel: string;
  targetMinutes: number | null;
  progress: number;
  onViewHistory: () => void;
};

export default function PartnerFastingCard({
  loading,
  isFasting,
  elapsedLabel,
  targetMinutes,
  progress,
  onViewHistory,
}: Props) {
  const progressPct = Math.round(progress * 100);

  return (
    <GradientWrapper variant="basic">
      <View style={styles.fastingCard}>
        <Text style={styles.fastingSectionTitle}>Metabolic Timer</Text>

        {loading && !isFasting ? (
          <ActivityIndicator size="small" color={colors.green} />
        ) : isFasting ? (
          <>
            <Text style={styles.fastingStatusText}>Fast in progress</Text>
            <Text style={styles.fastingTimer}>{elapsedLabel}</Text>
            {targetMinutes ? (
              <Text style={styles.fastingGoalText}>
                Goal {formatFastingDuration(targetMinutes)} · {progressPct}%
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.fastingStatusText}>No active fast</Text>
        )}

        <TouchableOpacity onPress={onViewHistory} activeOpacity={0.7}>
          <Text style={styles.heroLink}>View fasting history →</Text>
        </TouchableOpacity>
      </View>
    </GradientWrapper>
  );
}
