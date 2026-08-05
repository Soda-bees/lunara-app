import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import GradientWrapper from '../../../components/GradientWrapper';
import GradientText from '../../../components/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  Period,
  PeriodAnalyticsResponse,
  PregnancyStatusResponse,
  PregnancySymptom,
} from '../../../services/api';
import { getDaysText, getTrimesterText } from '../cycleInsightUtils';
import CycleInsightPeriodHistoryCard from './CycleInsightPeriodHistoryCard';
import CycleInsightAnalyticsCard from './CycleInsightAnalyticsCard';
import styles from '../style';

type Props = {
  pregnancyStatus: PregnancyStatusResponse['data'];
  pregnancySymptoms: PregnancySymptom[];
  periodList: Period[];
  analyticsData: PeriodAnalyticsResponse['data'] | null | undefined;
  onLogSymptom: () => void;
  onNavigatePregnancyHistory: () => void;
  onNavigateCycleHistory: () => void;
};

export default function CycleInsightPregnancyView({
  pregnancyStatus,
  pregnancySymptoms,
  periodList,
  analyticsData,
  onLogSymptom,
  onNavigatePregnancyHistory,
  onNavigateCycleHistory,
}: Props) {
  const {
    pregnancyWeek = 0,
    trimester = 1,
    dueDate,
    daysUntilDueDate,
    babyDevelopment,
    trimesterInsights,
    progressPercentage = 0,
  } = pregnancyStatus;

  return (
    <>
      <View style={{ marginBottom: 16 }}>
        <View style={styles.topContainer}>
          <Text style={styles.heading}>Insights</Text>
          <Text style={styles.subHeading}>
            Your complete health intelligence dashboard
          </Text>
        </View>

        <GradientWrapper variant="basic">
          <View style={styles.phaseBody}>
            <View style={styles.row}>
              <Text style={styles.heading}>Pregnancy Progress</Text>
            </View>

            <View style={styles.cyclePhaseCard}>
              <Text style={styles.spacedText}>PREGNANCY WEEK</Text>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <GradientText fontSize={46} fontFamily="Inter-Regular">
                    {pregnancyWeek || '—'}
                  </GradientText>
                  <Text style={[styles.numberTextMedium, { top: 8 }]}>
                    {' '}
                    / 40
                  </Text>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>
                    {getTrimesterText(trimester)}
                  </Text>
                </View>
              </View>
              <View style={styles.progressIndicator}>
                <LinearGradient
                  style={[
                    styles.progress,
                    {
                      width: `${progressPercentage}%`,
                    },
                  ]}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              {dueDate && (
                <Text style={styles.textDarkGrey}>
                  Due date: {moment(dueDate).format('MMMM D, YYYY')} (
                  {getDaysText(daysUntilDueDate)})
                </Text>
              )}
            </View>

            {babyDevelopment && (
              <View style={styles.cyclePhaseCard}>
                <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                <Text style={styles.babySizeText}>
                  Size of a {babyDevelopment.size}
                </Text>
                <Text style={styles.textDarkGrey}>
                  {babyDevelopment.development}
                </Text>
              </View>
            )}

            {trimesterInsights && (
              <>
                {trimesterInsights.nutrition &&
                  trimesterInsights.nutrition.length > 0 && (
                    <View style={styles.cyclePhaseCard}>
                      <Text style={styles.spacedText}>NUTRITION</Text>
                      {trimesterInsights.nutrition.map((item, index) => (
                        <Text key={index} style={styles.insightItem}>
                          • {item}
                        </Text>
                      ))}
                    </View>
                  )}

                {trimesterInsights.exercise &&
                  trimesterInsights.exercise.length > 0 && (
                    <View style={styles.cyclePhaseCard}>
                      <Text style={styles.spacedText}>EXERCISE</Text>
                      {trimesterInsights.exercise.map((item, index) => (
                        <Text key={index} style={styles.insightItem}>
                          • {item}
                        </Text>
                      ))}
                    </View>
                  )}

                {trimesterInsights.symptoms &&
                  trimesterInsights.symptoms.length > 0 && (
                    <View style={styles.cyclePhaseCard}>
                      <Text style={styles.spacedText}>COMMON SYMPTOMS</Text>
                      {trimesterInsights.symptoms.map((item, index) => (
                        <Text key={index} style={styles.insightItem}>
                          • {item}
                        </Text>
                      ))}
                    </View>
                  )}

                {trimesterInsights.whatToExpect &&
                  trimesterInsights.whatToExpect.length > 0 && (
                    <View style={styles.cyclePhaseCard}>
                      <Text style={styles.spacedText}>WHAT TO EXPECT</Text>
                      {trimesterInsights.whatToExpect.map((item, index) => (
                        <Text key={index} style={styles.insightItem}>
                          {item}
                        </Text>
                      ))}
                    </View>
                  )}

                {trimesterInsights.warnings &&
                  trimesterInsights.warnings.length > 0 && (
                    <View style={[styles.cyclePhaseCard, styles.warningCard]}>
                      <Text style={[styles.spacedText, styles.warningTitle]}>
                        WARNINGS
                      </Text>
                      {trimesterInsights.warnings.map((item, index) => (
                        <Text key={index} style={styles.warningItem}>
                          ⚠️ {item}
                        </Text>
                      ))}
                    </View>
                  )}
              </>
            )}

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={onLogSymptom}
              >
                <Text style={styles.actionButtonText}>Log Symptom</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GradientWrapper>

        <View style={styles.symptomHistorySection}>
          <Text style={styles.symptomHistoryTitle}>Symptom History</Text>
          {pregnancySymptoms.length > 0 ? (
            <>
              {pregnancySymptoms
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 3)
                .map((symptom, index) => (
                  <View key={index} style={styles.symptomItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.symptomItemDate}>
                        {moment(symptom.date).format('MMM D, YYYY')}
                      </Text>
                      <Text style={styles.symptomItemName}>
                        {symptom.symptom}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.symptomSeverityBadge,
                        {
                          backgroundColor:
                            symptom.severity === 'mild'
                              ? '#5BCE8B20'
                              : symptom.severity === 'moderate'
                              ? '#E7A16920'
                              : '#D9770620',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.symptomSeverityText,
                          {
                            color:
                              symptom.severity === 'mild'
                                ? '#5BCE8B'
                                : symptom.severity === 'moderate'
                                ? '#E7A169'
                                : '#D97706',
                          },
                        ]}
                      >
                        {symptom.severity.charAt(0).toUpperCase() +
                          symptom.severity.slice(1)}
                      </Text>
                    </View>
                  </View>
                ))}
              <TouchableOpacity
                style={styles.viewFullHistoryLink}
                onPress={onNavigatePregnancyHistory}
              >
                <Text style={styles.viewFullHistoryLinkText}>
                  View Full History
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.noSymptomsText}>
              No symptoms logged yet. Log your first symptom to start tracking.
            </Text>
          )}
        </View>

        {periodList.length > 0 && (
          <>
            <View style={{ marginTop: 16, marginBottom: 8 }}>
              <Text
                style={[
                  styles.subHeading,
                  { textAlign: 'left', marginBottom: 8 },
                ]}
              >
                Before pregnancy: Your cycle history
              </Text>
              <Text
                style={[
                  styles.textDarkGrey,
                  { fontSize: 11, marginBottom: 12 },
                ]}
              >
                You're in pregnancy mode. These insights are based on your
                cycles before pregnancy.
              </Text>
            </View>

            <CycleInsightPeriodHistoryCard
              periodList={periodList}
              readOnly
              onNavigateCycleHistory={onNavigateCycleHistory}
            />

            <CycleInsightAnalyticsCard analyticsData={analyticsData} />
          </>
        )}
      </View>
    </>
  );
}
