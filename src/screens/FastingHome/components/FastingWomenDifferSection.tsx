import React from 'react';
import { Text, View } from 'react-native';
import styles from '../style';

export default function FastingWomenDifferSection() {
  return (
    <View style={styles.educationCard}>
      <Text style={styles.educationTitle}>Why Women Fast Differently</Text>
      <Text style={styles.educationText}>
        Most fasting research was conducted on men or post-menopausal women. But
        cycling women have a completely different hormonal landscape that
        changes weekly.
      </Text>
      <Text style={styles.educationText}>
        Aggressive fasting during the luteal phase can increase cortisol,
        disrupt thyroid function, and worsen PMS symptoms. But gentle,
        phase-aligned fasting can enhance hormonal balance and metabolic health.
      </Text>
      <Text style={styles.educationQuote}>
        "Your cycle is not a problem to overcome—it's intelligence to work with."
        — Dr. Mindy Pelz
      </Text>
    </View>
  );
}
