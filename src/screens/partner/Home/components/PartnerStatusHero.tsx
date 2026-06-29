import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import GradientWrapper from '../../../../components/GradientWrapper';
import CycleIndicatorCard from '../../../../components/CycleIndicatorCard';
import GradientText from '../../../../components/GradientText';
import images from '../../../../constants/images';
import type { PregnancyStatusResponse } from '../../../../services/api';
import type { CycleStatusResponse } from '../../../../services/api';
import { getPhaseDisplayName } from '../partnerHomeUtils';
import { partnerHomeStyles as styles } from '../style';

type CycleData = CycleStatusResponse['data'];
type PregnancyData = PregnancyStatusResponse['data'];

type Props = {
  loading: boolean;
  cycleLoading: boolean;
  primaryUserName: string;
  pregnancyStatus: PregnancyData | null;
  cycleStatus: CycleData | null | undefined;
  onViewInsights: () => void;
};

export default function PartnerStatusHero({
  loading,
  cycleLoading,
  primaryUserName,
  pregnancyStatus,
  cycleStatus,
  onViewInsights,
}: Props) {
  const name = primaryUserName || 'Their';
  const todayDate = moment().format('dddd, MMMM D');

  if (loading) {
    return (
      <GradientWrapper variant="basic">
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#E4AF5D" />
        </View>
      </GradientWrapper>
    );
  }

  if (pregnancyStatus?.isPregnant) {
    const trimesterLabel =
      pregnancyStatus.trimester === 1
        ? 'First Trimester'
        : pregnancyStatus.trimester === 2
          ? 'Second Trimester'
          : pregnancyStatus.trimester === 3
            ? 'Third Trimester'
            : 'Pregnancy';

    return (
      <GradientWrapper variant="basic">
        <View style={styles.phaseBody}>
          <View style={styles.cyclePhaseCard}>
            <Text style={styles.spacedText}>PREGNANCY PROGRESS</Text>
            <View style={styles.rowFull}>
              <View style={styles.rowBottom}>
                <GradientText fontSize={46} fontFamily="Inter-Regular">
                  {pregnancyStatus.pregnancyWeek ?? '—'}
                </GradientText>
                <Text style={[styles.numberTextMedium, { top: 8 }]}> / 40</Text>
              </View>
              <View style={styles.dayTextContainer}>
                <Text style={styles.textBlackNormal}>{trimesterLabel}</Text>
              </View>
            </View>
            <View style={styles.progressIndicator}>
              <LinearGradient
                style={[
                  styles.progress,
                  {
                    width: `${pregnancyStatus.progressPercentage ?? 0}%`,
                  },
                ]}
                colors={['#E4AF5D', '#E799AD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            {pregnancyStatus.dueDate ? (
              <Text style={styles.textDarkGrey}>
                Due date:{' '}
                {moment(pregnancyStatus.dueDate).format('MMMM D, YYYY')}
                {pregnancyStatus.daysUntilDueDate != null ? (
                  <Text>
                    {' '}
                    (
                    {pregnancyStatus.daysUntilDueDate > 0
                      ? `${pregnancyStatus.daysUntilDueDate} days to go`
                      : pregnancyStatus.daysUntilDueDate === 0
                        ? 'Due date is today!'
                        : `${Math.abs(pregnancyStatus.daysUntilDueDate)} days past due date`}
                    )
                  </Text>
                ) : null}
              </Text>
            ) : null}
          </View>

          {pregnancyStatus.babyDevelopment ? (
            <TouchableOpacity
              style={styles.cyclePhaseCard}
              onPress={onViewInsights}
              activeOpacity={0.7}
            >
              <Text style={styles.spacedText}>BABY DEVELOPMENT</Text>
              <Text style={styles.babyDevelopmentText}>
                Size of a {pregnancyStatus.babyDevelopment.size}
              </Text>
              <Text style={styles.textDarkGrey}>
                {pregnancyStatus.babyDevelopment.development}
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity onPress={onViewInsights} activeOpacity={0.7}>
            <Text style={styles.heroLink}>View pregnancy insights →</Text>
          </TouchableOpacity>
        </View>
      </GradientWrapper>
    );
  }

  if (!cycleStatus?.isTracking) {
    return (
      <GradientWrapper variant="basic">
        <View style={styles.phaseBody}>
          <View style={styles.cyclePhaseCard}>
            <Text style={styles.spacedText}>CYCLE</Text>
            <Text style={styles.heading}>Not tracking cycle</Text>
            <Text style={[styles.textDarkGrey, { marginTop: 8 }]}>
              {name} has not enabled cycle tracking yet.
            </Text>
          </View>
        </View>
      </GradientWrapper>
    );
  }

  return (
    <GradientWrapper variant="basic">
      <View style={styles.phaseBody}>
        <View style={styles.row}>
          <Image
            style={styles.currentPhaseIconMain}
            source={images.currentPhaseIconMain}
          />
          <Text style={styles.heading}>{name}&apos;s Cycle</Text>
        </View>
        <View style={styles.phaseTextContainer}>
          <Text style={styles.textPrimary}>
            {getPhaseDisplayName(cycleStatus.phase)} - Day{' '}
            {cycleStatus.cycleDay ?? '—'}
          </Text>
        </View>
        <View style={styles.colCenter}>
          <Text style={styles.spacedText}>TODAY</Text>
          <Text style={styles.textBlackMedium}>{todayDate}</Text>
        </View>
        <CycleIndicatorCard
          loading={cycleLoading}
          isTracking={Boolean(cycleStatus.isTracking)}
          isPregnant={false}
          cycleDay={cycleStatus.cycleDay}
          averageCycleLength={cycleStatus.averageCycleLength || 28}
          phase={cycleStatus.phase}
          tagline={cycleStatus.tagline}
          widthMultiplier={0.82}
        />
        <View style={styles.softCopyContainer}>
          <Text style={styles.textDarkGrey}>
            {cycleStatus.description ||
              'No description available for this phase.'}
          </Text>
        </View>
        {cycleStatus.daysUntilNextPeriod != null &&
        cycleStatus.daysUntilNextPeriod >= 0 ? (
          <Text style={[styles.textBlackNormal, { marginTop: 8 }]}>
            Next period in ~{cycleStatus.daysUntilNextPeriod} days
          </Text>
        ) : null}
        <TouchableOpacity onPress={onViewInsights} activeOpacity={0.7}>
          <Text style={styles.heroLink}>View cycle insights →</Text>
        </TouchableOpacity>
      </View>
    </GradientWrapper>
  );
}
