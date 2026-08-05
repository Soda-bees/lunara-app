import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import type { SymptomSummary } from '../../../hooks/useHomeRituals';
import { gradients } from '../../../constants/gradientColors';
import {
  getSymptomSeverityColor,
  getTrendLabel,
} from '../homeUtils';
import styles from '../style';

type Props = {
  symptomSummary: SymptomSummary;
  onSeeHistory: () => void;
  onLogSymptoms: () => void;
};

export default function HomeSymptomCard({
  symptomSummary,
  onSeeHistory,
  onLogSymptoms,
}: Props) {
  return (
    <View style={styles.container2}>
      <View style={styles.symptomCardHeader}>
        <Text style={styles.sectionTitle}>Symptom Summary</Text>
        {symptomSummary.hasAnyLogged && (
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeHistory}>
            <Text style={styles.symptomHistoryLink}>See History</Text>
          </TouchableOpacity>
        )}
      </View>

      {symptomSummary.hasAnyLogged ? (
        <>
          <Text style={styles.symptomStatusText}>
            {symptomSummary.statusText}
          </Text>

          {symptomSummary.todaySymptoms.length > 0 ? (
            <View style={styles.todaySymptomsWrap}>
              {symptomSummary.todaySymptoms.map((item, index) => {
                const severityColor = getSymptomSeverityColor(item.severity);
                return (
                  <View
                    key={`${item.symptom}-${index}`}
                    style={styles.symptomChip}
                  >
                    <Text style={styles.symptomChipName}>{item.symptom}</Text>
                    <View
                      style={[
                        styles.symptomSeverityBadge,
                        { backgroundColor: `${severityColor}20` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.symptomSeverityText,
                          { color: severityColor },
                        ]}
                      >
                        {item.severity}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.symptomEmptyText}>
              Log symptoms to start seeing daily highlights.
            </Text>
          )}

          <View style={styles.symptomSummaryRow}>
            <Text style={styles.symptomSummaryLabel}>Last log date</Text>
            <Text style={styles.symptomSummaryValue}>
              {symptomSummary.lastLoggedDate
                ? moment(symptomSummary.lastLoggedDate).format('MMM D, YYYY')
                : '—'}
            </Text>
          </View>

          <View style={styles.symptomSummaryRow}>
            <Text style={styles.symptomSummaryLabel}>Top symptoms</Text>
            <Text style={styles.symptomSummaryValue}>
              {symptomSummary.topSymptoms.length > 0
                ? symptomSummary.topSymptoms.join(', ')
                : '—'}
            </Text>
          </View>

          <View style={styles.symptomSummaryRow}>
            <Text style={styles.symptomSummaryLabel}>Trend</Text>
            <Text style={styles.symptomSummaryValue}>
              {getTrendLabel(symptomSummary.trend)}
            </Text>
          </View>
        </>
      ) : (
        <Text style={styles.symptomEmptyText}>
          No symptom data yet. Log your first symptoms to start seeing insights.
        </Text>
      )}

      <TouchableOpacity
        style={styles.symptomLogButton}
        onPress={onLogSymptoms}
        disabled={symptomSummary.loading}
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.symptomLogButtonGradient}
        >
          {symptomSummary.loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.symptomLogButtonText}>Log Symptoms</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
