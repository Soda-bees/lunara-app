import React from 'react';
import { Text, View } from 'react-native';
import type { User } from '../../../../services/api';
import {
  DEFAULT_MEASUREMENT_SYSTEM,
  type MeasurementSystem,
} from '../../../../utils/measurement';
import { formatBodySummary } from '../../../Profile/edit/EditBodyMetricsScreen';
import { formatGoalLabel } from '../../../Profile/edit/EditGoalsCycleScreen';
import { formatDietarySummary } from '../../../Profile/edit/EditDietaryScreen';
import { partnerProfileStyles as styles } from '../style';

type Props = {
  user: User | null;
};

export default function PartnerReadOnlyAccountSection({ user }: Props) {
  const sys: MeasurementSystem =
    user?.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;

  const bodySummary =
    user?.heightCm != null || user?.weightKg != null
      ? formatBodySummary(user.heightCm, user.weightKg, sys)
      : 'Not set';

  const goalsSummary = `${formatGoalLabel(user?.primaryGoal)} · ${
    user?.isTrackingCycle ? 'Tracking on' : 'Tracking off'
  }`;

  const dietarySummary = formatDietarySummary(user?.dietaryRestrictions);

  return (
    <View style={styles.accountSection}>
      <Text style={styles.sectionHeading}>About</Text>
      <View style={styles.container2}>
        <Text style={styles.cardTitle}>Body metrics</Text>
        <Text style={styles.cardSubtitle}>{bodySummary}</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.cardTitle}>Goals & cycle</Text>
        <Text style={styles.cardSubtitle}>{goalsSummary}</Text>
      </View>
      <View style={styles.container2}>
        <Text style={styles.cardTitle}>Dietary preferences</Text>
        <Text style={styles.cardSubtitle}>{dietarySummary}</Text>
      </View>
    </View>
  );
}
