import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import GradientWrapper from '../../../components/GradientWrapper';
import GradientText from '../../../components/GradientText';
import LinearGradient from 'react-native-linear-gradient';
import images from '../../../constants/images';
import { fontSize } from '../../../constants/fonts';
import { colors } from '../../../constants/colors';
import { CycleStatusResponse, Period } from '../../../services/api';
import { PHASE_DESCRIPTIONS } from '../cycleInsightConstants';
import {
  getCycleDayText,
  getDataQualityColor,
  getDataQualityLabel,
  getNextPeriodText,
  getPhaseDisplayName,
  getRegularityLabel,
} from '../cycleInsightUtils';
import styles from '../style';

type PhaseDataStatus = {
  isPredicted: boolean;
  reason: string | null;
};

type Props = {
  cycle: CycleStatusResponse['data'];
  periodList: Period[];
  phaseDataStatus: PhaseDataStatus;
  isOverdue: boolean;
  isPregnant: boolean;
  onLogPeriodStart: () => void;
  onPregnancyPrompt: () => void;
};

export default function CycleInsightPhaseOverview({
  cycle,
  periodList,
  phaseDataStatus,
  isOverdue,
  isPregnant,
  onLogPeriodStart,
  onPregnancyPrompt,
}: Props) {
  return (
    <>
      {isOverdue && !isPregnant && (
        <View style={styles.overdueCard}>
          <Text style={styles.overdueTitle}>Period later than expected</Text>
          <Text style={styles.overdueText}>
            Your next period was predicted {getNextPeriodText(cycle)}. If it
            has already started, log it now so we can keep your calendar
            accurate. Are you possibly pregnant?
          </Text>
          <View style={styles.overdueActions}>
            <TouchableOpacity
              style={styles.overduePrimaryButton}
              activeOpacity={0.8}
              onPress={onLogPeriodStart}
            >
              <Text style={styles.overduePrimaryText}>Log period start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.overduePrimaryButton,
                styles.overduePrimaryButtonSecondary,
              ]}
              activeOpacity={0.8}
              onPress={onPregnancyPrompt}
            >
              <Text
                style={[
                  styles.overduePrimaryText,
                  styles.overduePrimaryTextSecondary,
                ]}
              >
                I might be pregnant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <GradientWrapper variant="basic">
        <View style={styles.phaseBody}>
          <View style={styles.rowFull}>
            <View style={styles.rowBottom}>
              <LinearGradient
                style={[styles.phaseImageView]}
                colors={['#E4AF5D', '#E799AD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Image
                  source={images.phasesImage}
                  style={styles.pregnanyHeartImage}
                />
              </LinearGradient>
              <View style={styles.phasesView}>
                <Text style={styles.numberTextMedium}>
                  {phaseDataStatus.isPredicted
                    ? 'Predicted to be in'
                    : 'Currently in'}
                </Text>
                <GradientText
                  fontSize={fontSize.large}
                  fontFamily="PlayfairDisplay-SemiBold"
                >
                  {getPhaseDisplayName(cycle?.phase)}
                </GradientText>
                <Text style={styles.numberTextMedium}>
                  {getCycleDayText(cycle)}
                </Text>
              </View>
            </View>
            <View style={styles.dayTextContainer}>
              <Text style={styles.textBlackNormal}>
                {cycle?.cycleDay ? `Day ${cycle.cycleDay}` : '—'}
              </Text>
            </View>
          </View>
          <Text style={styles.textDarkGrey}>
            {cycle?.description ||
              (cycle?.phase ? PHASE_DESCRIPTIONS[cycle.phase] : '') ||
              'Your body is preparing for the next cycle phase.'}
          </Text>

          {cycle?.regularityScore !== null &&
            cycle?.regularityScore !== undefined && (
              <View style={styles.regularityContainer}>
                <View style={styles.regularityRow}>
                  <Text style={styles.regularityLabel}>Cycle Regularity:</Text>
                  <View
                    style={[
                      styles.regularityBadge,
                      {
                        backgroundColor:
                          cycle?.regularityClassification === 'very_regular'
                            ? '#E6FFF5'
                            : cycle?.regularityClassification === 'regular'
                            ? '#FFF8EB'
                            : cycle?.regularityClassification === 'irregular'
                            ? '#FFF5F5'
                            : '#F5F5F5',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.regularityBadgeText,
                        {
                          color:
                            cycle?.regularityClassification === 'very_regular'
                              ? colors.green
                              : cycle?.regularityClassification === 'regular'
                              ? colors.heading
                              : cycle?.regularityClassification === 'irregular'
                              ? colors.maroonText
                              : colors.darkGrey,
                        },
                      ]}
                    >
                      {getRegularityLabel(cycle)} ({cycle?.regularityScore}%)
                    </Text>
                  </View>
                </View>
                {cycle?.predictionConfidence !== undefined && (
                  <View style={styles.confidenceRow}>
                    <Text style={styles.confidenceLabel}>
                      Prediction Confidence:
                    </Text>
                    <View style={styles.confidenceBarContainer}>
                      <View
                        style={[
                          styles.confidenceBar,
                          {
                            width: `${cycle?.predictionConfidence}%`,
                            backgroundColor: getDataQualityColor(cycle),
                          },
                        ]}
                      />
                    </View>
                    <Text
                      style={[
                        styles.confidenceText,
                        { color: getDataQualityColor(cycle) },
                      ]}
                    >
                      {cycle?.predictionConfidence}% •{' '}
                      {getDataQualityLabel(cycle)}
                    </Text>
                  </View>
                )}
                {periodList.length > 0 && (
                  <Text style={styles.dataQualityText}>
                    Based on {periodList.length} logged period
                    {periodList.length === 1 ? '' : 's'}
                    {cycle?.regularityClassification === 'irregular' ||
                    cycle?.regularityClassification === 'very_irregular'
                      ? ' • Your cycle varies. Predictions may be less accurate.'
                      : ''}
                  </Text>
                )}
              </View>
            )}

          {cycle?.hasIrregularCycles && cycle?.irregularCycleMessage && (
            <View style={styles.irregularCycleCard}>
              <Text style={styles.irregularCycleTitle}>
                Cycle Variation Detected
              </Text>
              <Text style={styles.irregularCycleText}>
                {cycle.irregularCycleMessage}
              </Text>
            </View>
          )}

          {phaseDataStatus.isPredicted && (
            <View style={styles.predictionInfoContainer}>
              <Text style={styles.predictionInfoText}>
                This information is based on our advanced cycle prediction
                calculations. To get the most accurate cycle tracking
                personalized to your body, please log your period start date.
              </Text>
            </View>
          )}

          {cycle?.hasMissingPeriods &&
            cycle?.missingPeriodMessage &&
            !isOverdue && (
              <View style={styles.missingPeriodCard}>
                <Text style={styles.missingPeriodTitle}>
                  Missing Period Detected
                </Text>
                <Text style={styles.missingPeriodText}>
                  {cycle.missingPeriodMessage}
                </Text>
                {cycle?.missingPeriods && cycle.missingPeriods.length > 0 && (
                  <TouchableOpacity
                    style={styles.missingPeriodButton}
                    onPress={onLogPeriodStart}
                  >
                    <Text style={styles.missingPeriodButtonText}>
                      Log Missing Period
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
        </View>
      </GradientWrapper>
    </>
  );
}
