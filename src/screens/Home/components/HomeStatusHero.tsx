import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import GradientWrapper from '../../../components/GradientWrapper';
import GradientText from '../../../components/GradientText';
import CycleIndicatorCard from '../../../components/CycleIndicatorCard';
import images from '../../../constants/images';
import { gradients } from '../../../constants/gradientColors';
import type {
  CycleStatusResponse,
  Period,
  PregnancyStatusResponse,
} from '../../../services/api';
import { getPhaseDataStatus } from '../../../utils/cycleUtils';
import {
  getEnergyLevelText,
  getPhaseDisplayName,
} from '../homeUtils';
import styles from '../style';

type CycleData = CycleStatusResponse['data'];
type PregnancyData = PregnancyStatusResponse['data'];

type Props = {
  loading: boolean;
  cycleLoading: boolean;
  pregnancyStatus: PregnancyData | null;
  cycleStatus: CycleData | null | undefined;
  periodList: Period[];
  onNavigateToCycle: () => void;
  onLogPeriod: () => void;
  onAddPregnancy: () => void;
};

export default function HomeStatusHero({
  loading,
  cycleLoading,
  pregnancyStatus,
  cycleStatus,
  periodList,
  onNavigateToCycle,
  onLogPeriod,
  onAddPregnancy,
}: Props) {
  const [showInsightDetails, setShowInsightDetails] = useState<Boolean>(false);
  const todayDate = moment().format('dddd, MMMM D');

  const phaseDataStatus = cycleStatus
    ? getPhaseDataStatus(cycleStatus, periodList)
    : { isPredicted: true, reason: 'not_tracking' };

  const isOverdue =
    typeof cycleStatus?.daysUntilNextPeriod === 'number' &&
    cycleStatus.daysUntilNextPeriod < 0;

  return (
    <GradientWrapper variant="basic">
      <View style={styles.phaseBody}>
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#E4AF5D" />
          </View>
        ) : null}
        {!loading && pregnancyStatus && pregnancyStatus.isPregnant ? (
          <>
            {/* Pregnancy Progress Card */}
            <View style={styles.cyclePhaseCard}>
              <Text style={styles.spacedText}>PREGNANCY PROGRESS</Text>
              <View style={styles.rowFull}>
                <View style={styles.rowBottom}>
                  <GradientText fontSize={46} fontFamily="Inter-Regular">
                    {pregnancyStatus.pregnancyWeek || '—'}
                  </GradientText>
                  <Text style={[styles.numberTextMedium, { top: 8 }]}>
                    {' '}
                    / 40
                  </Text>
                </View>
                <View style={styles.dayTextContainer}>
                  <Text style={styles.textBlackNormal}>
                    {pregnancyStatus.trimester === 1
                      ? 'First Trimester'
                      : pregnancyStatus.trimester === 2
                        ? 'Second Trimester'
                        : 'Third Trimester'}
                  </Text>
                </View>
              </View>
              <View style={styles.progressIndicator}>
                <LinearGradient
                  style={[
                    styles.progress,
                    {
                      width: `${pregnancyStatus.progressPercentage || 0}%`,
                    },
                  ]}
                  colors={['#E4AF5D', '#E799AD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              {pregnancyStatus.dueDate && (
                <Text style={styles.textDarkGrey}>
                  Due date:{' '}
                  {moment(pregnancyStatus.dueDate).format('MMMM D, YYYY')}
                  {pregnancyStatus.daysUntilDueDate !== null &&
                    pregnancyStatus.daysUntilDueDate !== undefined && (
                      <Text>
                        {' '}
                        (
                        {pregnancyStatus.daysUntilDueDate > 0
                          ? `${pregnancyStatus.daysUntilDueDate} days to go`
                          : pregnancyStatus.daysUntilDueDate === 0
                            ? 'Due date is today!'
                            : `${Math.abs(
                                pregnancyStatus.daysUntilDueDate,
                              )} days past due date`}
                        )
                      </Text>
                    )}
                </Text>
              )}
            </View>

            {/* Baby Development Card */}
            {pregnancyStatus.babyDevelopment && (
              <TouchableOpacity
                style={styles.cyclePhaseCard}
                onPress={onNavigateToCycle}
              >
                <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
                <Text style={styles.babyDevelopmentText}>
                  Size of a {pregnancyStatus.babyDevelopment.size}
                </Text>
                <Text style={styles.textDarkGrey}>
                  {pregnancyStatus.babyDevelopment.development}
                </Text>
              </TouchableOpacity>
            )}

            {/* Today's Insights Card */}
            {pregnancyStatus.trimesterInsights &&
              pregnancyStatus.trimesterInsights.whatToExpect &&
              pregnancyStatus.trimesterInsights.whatToExpect.length > 0 && (
                <TouchableOpacity
                  style={styles.cyclePhaseCard}
                  onPress={onNavigateToCycle}
                >
                  <Text style={styles.spacedText}>TODAY'S INSIGHT</Text>
                  <Text style={styles.textDarkGrey}>
                    {pregnancyStatus.trimesterInsights.whatToExpect[0]}
                  </Text>
                </TouchableOpacity>
              )}

            {/* Link to Cycle History - Only show if user has cycle history */}
            {periodList.length > 0 && (
              <TouchableOpacity
                style={styles.cyclePhaseCard}
                onPress={onNavigateToCycle}
              >
                <Text style={styles.spacedText}>CYCLE HISTORY</Text>
                <Text style={styles.textDarkGrey}>
                  View your past cycles and insights from before pregnancy. Your
                  cycle data is preserved.
                </Text>
                <Text
                  style={[
                    styles.textDarkGrey,
                    {
                      marginTop: 8,
                      color: '#E799AD',
                      fontFamily: 'Inter-SemiBold',
                    },
                  ]}
                >
                  View Cycle Insights →
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : !cycleStatus || !cycleStatus.isTracking ? (
          <View>
            <Text style={styles.textDarkGrey}>
              Cycle tracking is not enabled. Please enable it in your profile
              settings to see phase insights.
            </Text>
          </View>
        ) : (
          <>
            {/* Prediction/Overdue Warning Banner */}
            {(phaseDataStatus.isPredicted || isOverdue) && (
              <View style={styles.predictionBanner}>
                {phaseDataStatus.isPredicted ? (
                  <>
                    <Text style={styles.predictionBannerTitle}>
                      This is a prediction
                    </Text>
                    <Text style={styles.predictionBannerText}>
                      Log your period or add pregnancy info for accurate cycle
                      tracking.
                    </Text>
                    <View style={styles.predictionBannerActions}>
                      <TouchableOpacity
                        style={styles.predictionBannerButton}
                        activeOpacity={0.8}
                        onPress={onLogPeriod}
                      >
                        <Text style={styles.predictionBannerButtonText}>
                          Log Period
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.predictionBannerButton,
                          styles.predictionBannerButtonSecondary,
                        ]}
                        activeOpacity={0.8}
                        onPress={onAddPregnancy}
                      >
                        <Text
                          style={[
                            styles.predictionBannerButtonText,
                            styles.predictionBannerButtonTextSecondary,
                          ]}
                        >
                          Add Pregnancy Info
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : isOverdue ? (
                  <>
                    <Text style={styles.predictionBannerTitle}>
                      Your period is late
                    </Text>
                    <Text style={styles.predictionBannerText}>
                      Your period was expected{' '}
                      {cycleStatus.daysUntilNextPeriod
                        ? `${Math.abs(
                            cycleStatus.daysUntilNextPeriod,
                          )} days ago`
                        : 'recently'}
                      . Are you possibly pregnant?
                    </Text>
                    <View style={styles.predictionBannerActions}>
                      <TouchableOpacity
                        style={styles.predictionBannerButton}
                        activeOpacity={0.8}
                        onPress={onLogPeriod}
                      >
                        <Text style={styles.predictionBannerButtonText}>
                          Log Period
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.predictionBannerButton,
                          styles.predictionBannerButtonSecondary,
                        ]}
                        activeOpacity={0.8}
                        onPress={onAddPregnancy}
                      >
                        <Text
                          style={[
                            styles.predictionBannerButtonText,
                            styles.predictionBannerButtonTextSecondary,
                          ]}
                        >
                          I might be pregnant
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}
              </View>
            )}
            <View
              style={[
                phaseDataStatus.isPredicted && styles.predictedPhaseCard,
              ]}
            >
              <View style={styles.row}>
                <Image
                  style={styles.currentPhaseIconMain}
                  source={images.currentPhaseIconMain}
                />
                <Text style={styles.heading}>Current Phase</Text>
              </View>
              <View style={styles.phaseTextContainer}>
                <Text style={styles.textPrimary}>
                  {phaseDataStatus.isPredicted ? 'Predicted: ' : ''}
                  {getPhaseDisplayName(cycleStatus.phase)} - Day{' '}
                  {cycleStatus.cycleDay || '—'}
                </Text>
              </View>
              <View style={styles.colCenter}>
                <Text style={styles.spacedText}>TODAY</Text>
                <Text style={styles.textBlackMedium}>{todayDate}</Text>
              </View>
              <CycleIndicatorCard
                loading={cycleLoading}
                isTracking={Boolean(cycleStatus?.isTracking)}
                isPregnant={Boolean(pregnancyStatus?.isPregnant)}
                cycleDay={cycleStatus?.cycleDay}
                averageCycleLength={cycleStatus?.averageCycleLength || 28}
                phase={cycleStatus?.phase}
                tagline={cycleStatus?.tagline}
                widthMultiplier={0.82}
              />
            </View>
            <View style={styles.softCopyContainer}>
              <Text style={styles.textDarkGrey}>
                {cycleStatus.description ||
                  'No description available for this phase.'}
              </Text>
            </View>
            {/* Prediction Info Message */}
            {phaseDataStatus.isPredicted && (
              <View style={styles.predictionInfoContainer}>
                <Text style={styles.predictionInfoText}>
                  This information is based on our advanced cycle prediction
                  calculations. To get the most accurate cycle tracking
                  personalized to your body, please log your period start date.
                </Text>
              </View>
            )}
          </>
        )}

        {cycleStatus && cycleStatus.isTracking && (
          <TouchableOpacity
            style={
              showInsightDetails
                ? [styles.sliderRow, { marginBottom: 15 }]
                : styles.sliderRow
            }
            onPress={() => setShowInsightDetails(prev => !prev)}
          >
            <Image
              source={images.slideDown}
              style={
                showInsightDetails
                  ? styles.slideActiveIcon
                  : styles.slideIcon
              }
            />
            <Text style={styles.greenText}>
              Tap to {showInsightDetails ? 'hide' : 'see'} detailed insights
            </Text>
          </TouchableOpacity>
        )}
        {showInsightDetails && cycleStatus && cycleStatus.isTracking && (
          <>
            <View style={styles.rowFlexBox}>
              <View style={styles.flexBox}>
                <Image source={images.energyHigh} style={styles.icon} />
                <Text style={styles.greenText}>Energy Level</Text>
                <Text style={styles.textBlackSmall}>
                  {getEnergyLevelText(cycleStatus.energyLevel)}
                </Text>
              </View>
              <View style={styles.flexBox}>
                <Image source={images.sparkle} style={styles.icon} />
                <Text style={styles.greenText}>Best For</Text>
                <Text style={styles.textBlackSmall}>
                  {cycleStatus.bestFor &&
                  Array.isArray(cycleStatus.bestFor) &&
                  cycleStatus.bestFor.length > 0
                    ? cycleStatus.bestFor.join(', ')
                    : '—'}
                </Text>
              </View>
            </View>

            <View style={styles.thisPhaseDataContainer}>
              {cycleStatus.nutrition &&
                Array.isArray(cycleStatus.nutrition) &&
                cycleStatus.nutrition.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.row}>
                      <Image
                        source={images.nutritionIcon}
                        style={styles.icon}
                      />
                      <Text style={styles.textBlackBold}>
                        Nutrition This Phase
                      </Text>
                    </View>
                    <View>
                      {cycleStatus.nutrition.map((item, index) => (
                        <View key={index} style={styles.row}>
                          <View style={styles.bulletPoint}></View>
                          <Text style={styles.textBlackNormal}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              {cycleStatus.movement &&
                Array.isArray(cycleStatus.movement) &&
                cycleStatus.movement.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.row}>
                      <Image
                        source={images.movementIcon}
                        style={styles.icon}
                      />
                      <Text style={styles.textBlackBold}>
                        Movement This Phase
                      </Text>
                    </View>
                    <View>
                      {cycleStatus.movement.map((item, index) => (
                        <View key={index} style={styles.row}>
                          <View style={styles.bulletPoint}></View>
                          <Text style={styles.textBlackNormal}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              {cycleStatus.mindset &&
                Array.isArray(cycleStatus.mindset) &&
                cycleStatus.mindset.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.row}>
                      <Image source={images.mindsetIcon} style={styles.icon} />
                      <Text style={styles.textBlackBold}>Mindset & Focus</Text>
                    </View>
                    <View>
                      {cycleStatus.mindset.map((item, index) => (
                        <View key={index} style={styles.row}>
                          <View style={styles.bulletPoint}></View>
                          <Text style={styles.textBlackNormal}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
            </View>

            {cycleStatus.understanding && (
              <LinearGradient
                colors={gradients.pinkish}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.pinkishGradient}
              >
                <View style={styles.row}>
                  <Image source={images.sparkle} style={styles.icon} />
                  <Text style={styles.textBlackBold}>
                    Understanding This Phase
                  </Text>
                </View>
                <Text style={styles.textBlackSmall}>
                  {cycleStatus.understanding}
                </Text>
              </LinearGradient>
            )}
          </>
        )}
      </View>
    </GradientWrapper>
  );
}
