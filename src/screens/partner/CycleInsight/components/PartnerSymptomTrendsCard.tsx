import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../../constants/colors';
import type { RootStackParamList } from '../../../../navigation/stackNavigation';
import {
  getCycleSymptomPatterns,
  type CycleSymptomPattern,
} from '../../../../services/api';
import styles from '../style';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function getSeverityColor(severity: string): string {
  const normalized = severity.toLowerCase();
  if (normalized === 'severe' || normalized === 'high') return '#D97706';
  if (normalized === 'moderate' || normalized === 'medium') return '#E7A169';
  if (normalized === 'mild' || normalized === 'low') return '#5BCE8B';
  return colors.darkGrey;
}

export default function PartnerSymptomTrendsCard() {
  const navigation = useNavigation<NavigationProp>();
  const [patterns, setPatterns] = useState<CycleSymptomPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const response = await getCycleSymptomPatterns();
        if (!cancelled && response.success && response.data.patterns) {
          setPatterns(response.data.patterns.slice(0, 5));
        }
      } catch {
        if (!cancelled) setPatterns([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.historyCard}>
      <View style={styles.headerRowBetween}>
        <Text style={styles.cycleText}>Symptom patterns</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SymptomHistory')}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllButtonText}>View history</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.green} />
      ) : patterns.length === 0 ? (
        <Text style={styles.noSymptomsText}>No symptoms logged yet.</Text>
      ) : (
        patterns.map((pattern, index) => {
          const severityLabel =
            pattern.severity.charAt(0).toUpperCase() +
            pattern.severity.slice(1);
          const severityColor = getSeverityColor(pattern.severity);
          return (
            <View key={`${pattern.symptom}-${index}`} style={styles.symptomPatternRow}>
              <Text style={styles.symptomPatternName}>{pattern.symptom}</Text>
              <View
                style={[
                  styles.symptomSeverityBadge,
                  { backgroundColor: `${severityColor}20` },
                ]}
              >
                <Text
                  style={[styles.symptomSeverityText, { color: severityColor }]}
                >
                  {severityLabel}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
