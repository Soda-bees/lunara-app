import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientWrapper from '../../../components/GradientWrapper';
import images from '../../../constants/images';
import styles from '../style';

type Props = {
  onNewEntry: () => void;
  onSeeHistory: () => void;
};

export default function HomeJournalSection({
  onNewEntry,
  onSeeHistory,
}: Props) {
  return (
    <GradientWrapper variant="basic">
      <View style={styles.phaseBody}>
        <View style={styles.journalHeaderRow}>
          <Image source={images.journal} style={styles.journalIcon} />
          <Text style={styles.journalTitle}>Wellness Journal</Text>
        </View>
        <Text style={styles.journalSubtitle}>
          Your story unfolds one note at a time. Reflect on your journey,
          express gratitude, and celebrate your progress.
        </Text>
        <View style={styles.journalButtonsRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={onNewEntry}>
            <LinearGradient
              style={styles.journalActionButton}
              colors={['#E4AF5D', '#E799AD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.journalActionButtonText}>New Entry</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.journalActionButton, styles.journalHistoryButton]}
            activeOpacity={0.8}
            onPress={onSeeHistory}
          >
            <Text
              style={[
                styles.journalActionButtonText,
                styles.journalHistoryButtonText,
              ]}
            >
              See History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientWrapper>
  );
}
