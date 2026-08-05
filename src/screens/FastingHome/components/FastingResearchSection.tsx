import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fastingResearch } from '../fastingData';
import styles from '../style';

export default function FastingResearchSection() {
  const [showAllResearch, setShowAllResearch] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✨</Text>
          <Text style={styles.sectionTitle}>The Research</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAllResearch(!showAllResearch)}>
          <Text style={styles.viewAllText}>
            {showAllResearch ? 'Show Less' : 'View All'}
          </Text>
        </TouchableOpacity>
      </View>

      {(showAllResearch ? fastingResearch : fastingResearch.slice(0, 3)).map(
        (study, index) => (
          <View key={index} style={styles.researchCard}>
            <Text style={styles.researchFinding}>"{study.finding}"</Text>
            <Text style={styles.researchSource}>
              — {study.source}, {study.year}
            </Text>
          </View>
        ),
      )}
    </View>
  );
}
