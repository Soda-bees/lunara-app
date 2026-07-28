import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../../components/BackButton';
import images from '../../../constants/images';
import { colors } from '../../../constants/colors';
import { usePartnerMode } from '../../../context/PartnerModeContext';
import ProfileStatCard from '../../Profile/components/ProfileStatCard';
import { useProfileDashboard } from '../../Profile/useProfileDashboard';
import ownerStyles from '../../Profile/style';
import {
  DEFAULT_MEASUREMENT_SYSTEM,
  type MeasurementSystem,
} from '../../../utils/measurement';
import { formatBodySummary } from '../../Profile/edit/EditBodyMetricsScreen';
import { getPartnerDisplayNames } from '../Track/partnerTrackUtils';
import PartnerExitSection from '../Home/components/PartnerExitSection';
import PartnerProfileHeader from './components/PartnerProfileHeader';
import PartnerReadOnlyAccountSection from './components/PartnerReadOnlyAccountSection';
import { partnerProfileStyles as styles } from './style';

export default function PartnerProfileView() {
  const { primaryUserName } = usePartnerMode();
  const { partnerName, partnerNamePossessive } =
    getPartnerDisplayNames(primaryUserName);
  const { user, stats, statEmptyFlags, loading } = useProfileDashboard();

  const sys: MeasurementSystem =
    user?.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;

  const bodySummary =
    user?.heightCm != null || user?.weightKg != null
      ? formatBodySummary(user.heightCm, user.weightKg, sys)
      : 'Not set';

  const statsHeading = primaryUserName
    ? `${partnerNamePossessive} stats`
    : 'Their stats';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PartnerProfileHeader />

        <View style={styles.profileHero}>
          <Image source={images.profileIcon} style={styles.profilePicture} />
          {loading && !user ? (
            <ActivityIndicator
              color={colors.maroonText}
              style={{ marginVertical: 12 }}
            />
          ) : (
            <>
              <Text style={styles.profileName}>
                {user?.fullName || partnerName}
              </Text>
              <Text style={styles.profileEmail}>{user?.email || '—'}</Text>
              <Text style={styles.profileBodyLine}>{bodySummary}</Text>
            </>
          )}
        </View>

        <View>
          <Text style={styles.sectionHeading}>{statsHeading}</Text>
          <View style={ownerStyles.statsContainer}>
            <ProfileStatCard
              icon={images.btCycleActive}
              label={stats.cycleLabel}
              detail={stats.cycleDetail}
            />
            <ProfileStatCard
              icon={images.clockIcon}
              label={stats.fastingLabel}
              detail={stats.fastingDetail}
            />
            <ProfileStatCard
              icon={images.challengesIcon}
              label={stats.challengeLabel}
              detail={stats.challengeDetail}
            />
            <ProfileStatCard
              icon={images.sleepQualityIcon}
              label={stats.sleepLabel}
              detail={stats.sleepDetail}
              isEmpty={statEmptyFlags.sleep}
            />
            <ProfileStatCard
              icon={images.periodCalender}
              label={stats.nextPeriodLabel}
              detail={stats.nextPeriodDetail}
            />
            <ProfileStatCard
              icon={images.eggOut}
              label={stats.avgFastLabel}
              detail={stats.avgFastDetail}
              isEmpty={statEmptyFlags.avgFast}
            />
          </View>
        </View>

        <PartnerReadOnlyAccountSection user={user} />

        <PartnerExitSection />
      </ScrollView>
    </SafeAreaView>
  );
}
