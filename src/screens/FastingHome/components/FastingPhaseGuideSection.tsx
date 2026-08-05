import React from 'react';
import { Text, View } from 'react-native';
import { CycleFastingGuide } from '../fastingData';
import styles from '../style';

type Props = {
  currentPhaseGuide: CycleFastingGuide;
};

export default function FastingPhaseGuideSection({
  currentPhaseGuide,
}: Props) {
  return (
    <View style={styles.phaseGuideCard}>
      <View style={styles.phaseGuideHeader}>
        <Text style={styles.phaseGuideEmoji}>{currentPhaseGuide.emoji}</Text>
        <View>
          <Text style={styles.phaseGuideTitle}>
            Your{' '}
            {currentPhaseGuide.phase.charAt(0).toUpperCase() +
              currentPhaseGuide.phase.slice(1)}{' '}
            Fasting Guide
          </Text>
          <Text style={styles.phaseGuideApproach}>
            {currentPhaseGuide.approach}
          </Text>
        </View>
      </View>

      <View style={styles.phaseGuideWindow}>
        <Text style={styles.phaseGuideWindowIcon}>⏰</Text>
        <Text style={styles.phaseGuideWindowText}>
          Recommended window:{' '}
          <Text style={styles.phaseGuideWindowBold}>
            {currentPhaseGuide.window}
          </Text>
        </Text>
      </View>

      <Text style={styles.phaseGuideDescription}>
        {currentPhaseGuide.description}
      </Text>
    </View>
  );
}
