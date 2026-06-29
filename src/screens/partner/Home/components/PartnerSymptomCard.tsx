import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import type { SymptomSummary } from '../../../../hooks/useHomeRituals';
import {
  getSymptomSeverityColor,
  getTrendLabel,
} from '../partnerHomeUtils';
import { partnerHomeStyles as styles } from '../style';

type Props = {
  symptomSummary: SymptomSummary;
  onViewHistory: () => void;
};

export default function PartnerSymptomCard({
  symptomSummary,
  onViewHistory,
}: Props) {
  return (
    <View style={styles.container2}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.sectionTitle}>Symptom Summary</Text>
        {symptomSummary.hasAnyLogged ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onViewHistory}>
            <Text style={styles.cardLink}>See History</Text>
          </TouchableOpacity>
        ) : null}
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
              No symptoms logged today yet.
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
        <Text style={styles.symptomEmptyText}>No symptoms logged yet.</Text>
      )}
    </View>
  );
}
