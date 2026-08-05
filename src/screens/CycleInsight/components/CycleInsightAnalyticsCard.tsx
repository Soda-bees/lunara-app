import React from 'react';
import { Image, Text, View } from 'react-native';
import images from '../../../constants/images';
import { colors } from '../../../constants/colors';
import { PeriodAnalyticsResponse } from '../../../services/api';
import { hasAnalyticsData } from '../cycleInsightUtils';
import styles from '../style';

type Props = {
  analyticsData: PeriodAnalyticsResponse['data'] | null | undefined;
};

export default function CycleInsightAnalyticsCard({ analyticsData }: Props) {
  if (!hasAnalyticsData(analyticsData)) return null;

  return (
    <View style={styles.analyticsCard}>
      <View style={styles.headerRow}>
        <Image source={images.periodCalender} style={styles.calenderImage} />
        <Text style={styles.cycleText}>Cycle Analytics</Text>
      </View>
      {analyticsData.cycleTrend && analyticsData.cycleRange && (
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Cycle Length Trend:</Text>
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    analyticsData.cycleTrend === 'increasing'
                      ? colors.heading
                      : analyticsData.cycleTrend === 'decreasing'
                      ? colors.maroonText
                      : colors.green,
                },
              ]}
            >
              {analyticsData.cycleTrend === 'increasing'
                ? '↑ Increasing'
                : analyticsData.cycleTrend === 'decreasing'
                ? '↓ Decreasing'
                : '→ Stable'}
            </Text>
            {analyticsData.cycleRange.min &&
              analyticsData.cycleRange.max &&
              analyticsData.cycleRange.average && (
                <Text style={styles.analyticsValue}>
                  Range: {analyticsData.cycleRange.min}–
                  {analyticsData.cycleRange.max} days
                  {' • '}Avg: {analyticsData.cycleRange.average} days
                </Text>
              )}
          </View>
        </View>
      )}
      {analyticsData.periodTrend && analyticsData.periodRange && (
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Period Length Trend:</Text>
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                {
                  color:
                    analyticsData.periodTrend === 'increasing'
                      ? colors.heading
                      : analyticsData.periodTrend === 'decreasing'
                      ? colors.maroonText
                      : colors.green,
                },
              ]}
            >
              {analyticsData.periodTrend === 'increasing'
                ? '↑ Increasing'
                : analyticsData.periodTrend === 'decreasing'
                ? '↓ Decreasing'
                : '→ Stable'}
            </Text>
            {analyticsData.periodRange.min &&
              analyticsData.periodRange.max &&
              analyticsData.periodRange.average && (
                <Text style={styles.analyticsValue}>
                  Range: {analyticsData.periodRange.min}–
                  {analyticsData.periodRange.max} days
                  {' • '}Avg: {analyticsData.periodRange.average} days
                </Text>
              )}
          </View>
        </View>
      )}
      {analyticsData.topSymptoms && analyticsData.topSymptoms.length > 0 && (
        <View style={styles.analyticsRow}>
          <Text style={styles.analyticsLabel}>Most Common Symptoms:</Text>
          <View style={styles.symptomsContainer}>
            {analyticsData.topSymptoms.map((item, index) => (
              <View key={index} style={styles.symptomTag}>
                <Text style={styles.symptomTagText}>
                  {item.symptom} ({item.count})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
