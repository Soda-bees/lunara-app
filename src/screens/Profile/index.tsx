import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import images from '../../constants/images/more';
import styles from './style';
import { colors } from '../../constants/colors';
import {
  clearToken,
  getAllChallenges,
  getCurrentCycleStatus,
  getFastingInsights,
  getMe,
  getSleepStatistics,
  updateProfile,
  type MeUser,
  isOwnerMeUser,
} from '../../services/api';
import { useOnboarding } from '../../context/OnboardingContext';
import {
  DEFAULT_MEASUREMENT_SYSTEM,
  type MeasurementSystem,
} from '../../utils/measurement';
import { formatBodySummary } from './edit/EditBodyMetricsScreen';
import { formatGoalLabel } from './edit/EditGoalsCycleScreen';
import { formatDietarySummary } from './edit/EditDietaryScreen';
import { formatDaysUntilPeriodStat } from '../../utils/cycleUtils';
import { usePartnerMode } from '../../context/PartnerModeContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

type ProfileStats = {
  cycleLabel: string;
  cycleDetail: string;
  fastingLabel: string;
  fastingDetail: string;
  challengeLabel: string;
  challengeDetail: string;
  sleepLabel: string;
  sleepDetail: string;
  nextPeriodLabel: string;
  nextPeriodDetail: string;
  avgFastLabel: string;
  avgFastDetail: string;
};

const EMPTY_STATS: ProfileStats = {
  cycleLabel: '—',
  cycleDetail: 'Not available',
  fastingLabel: '—',
  fastingDetail: 'Not available',
  challengeLabel: '—',
  challengeDetail: 'Not available',
  sleepLabel: 'No logs',
  sleepDetail: 'Sleep tracker',
  nextPeriodLabel: '—',
  nextPeriodDetail: 'Not tracking',
  avgFastLabel: 'No fasts',
  avgFastDetail: 'Last 7 days',
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMinutesAsHours(minutes: number | null | undefined): string | null {
  if (minutes == null || Number.isNaN(minutes)) {
    return null;
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `${hours}h`;
}

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();
  const { resetData } = useOnboarding();
  const { isPartnerMode, primaryUserName } = usePartnerMode();
  const [user, setUser] = useState<MeUser | null>(null);
  const [stats, setStats] = useState<ProfileStats>(EMPTY_STATS);
  const [statEmptyFlags, setStatEmptyFlags] = useState({
    sleep: true,
    avgFast: true,
  });
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [meRes, cycleRes, fastingRes, challengesRes, sleepRes] =
        await Promise.allSettled([
          getMe(),
          getCurrentCycleStatus(),
          getFastingInsights(7),
          getAllChallenges(),
          getSleepStatistics(),
        ]);

      if (meRes.status === 'fulfilled' && meRes.value.success && meRes.value.user) {
        setUser(meRes.value.user);
      }

      const nextStats: ProfileStats = { ...EMPTY_STATS };

      if (
        cycleRes.status === 'fulfilled' &&
        cycleRes.value.success &&
        cycleRes.value.data
      ) {
        const cycle = cycleRes.value.data;
        if (cycle.isTracking && cycle.phase) {
          nextStats.cycleLabel = capitalize(cycle.phase);
          nextStats.cycleDetail =
            cycle.cycleDay != null ? `Day ${cycle.cycleDay}` : 'Tracking active';
        } else {
          nextStats.cycleLabel = 'Off';
          nextStats.cycleDetail = cycle.message || 'Not tracking';
        }

        if (cycle.isTracking && cycle.daysUntilNextPeriod != null) {
          const periodStat = formatDaysUntilPeriodStat(cycle.daysUntilNextPeriod);
          nextStats.nextPeriodLabel = periodStat.label;
          nextStats.nextPeriodDetail = periodStat.detail;
        }
      }

      let hasSleepData = false;
      if (
        sleepRes.status === 'fulfilled' &&
        sleepRes.value.success &&
        sleepRes.value.data
      ) {
        const sleep = sleepRes.value.data;
        if (sleep.averages.duration != null && sleep.totalLogs > 0) {
          hasSleepData = true;
          nextStats.sleepLabel = `${Math.round(sleep.averages.duration * 10) / 10}h`;
          nextStats.sleepDetail = '7-day avg';
        }
      }

      let hasAvgFastData = false;
      if (
        fastingRes.status === 'fulfilled' &&
        fastingRes.value.success &&
        fastingRes.value.data
      ) {
        const fasting = fastingRes.value.data;
        nextStats.fastingLabel = String(fasting.currentStreakDays ?? 0);
        nextStats.fastingDetail = 'Day streak';

        const avgFast = formatMinutesAsHours(fasting.averageDurationMinutes);
        if (avgFast) {
          hasAvgFastData = true;
          nextStats.avgFastLabel = avgFast;
          nextStats.avgFastDetail = 'Avg fast (7d)';
        }
      }

      if (
        challengesRes.status === 'fulfilled' &&
        challengesRes.value.success &&
        challengesRes.value.data
      ) {
        const active = challengesRes.value.data.find(
          item => item.userInstance?.status === 'active',
        );
        if (active?.userInstance) {
          nextStats.challengeLabel = active.title;
          nextStats.challengeDetail = `Day ${active.userInstance.currentDay}/${active.duration}`;
        } else {
          nextStats.challengeLabel = 'None';
          nextStats.challengeDetail = 'No active challenge';
        }
      }

      setStats(nextStats);
      setStatEmptyFlags({
        sleep: !hasSleepData,
        avgFast: !hasAvgFastData,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const sys: MeasurementSystem =
    user && isOwnerMeUser(user)
      ? user.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM
      : DEFAULT_MEASUREMENT_SYSTEM;

  const ownerUser = user && isOwnerMeUser(user) ? user : null;

  const saveMeasurementSystem = async (next: MeasurementSystem) => {
    if (isPartnerMode) {
      showPartnerReadOnlyAlert();
      return;
    }
    try {
      const res = await updateProfile({ measurementSystem: next });
      if (res.success && res.user && isOwnerMeUser(res.user)) {
        setUser(res.user);
      }
    } catch {
      Alert.alert('Error', 'Could not update unit preference.');
    }
  };

  const handleSignOut = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearToken();
            resetData();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          } catch {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const bodySummary =
    ownerUser?.heightCm != null || ownerUser?.weightKg != null
      ? formatBodySummary(ownerUser.heightCm, ownerUser.weightKg, sys)
      : 'Add height and weight';

  const displayName = isPartnerMode
    ? primaryUserName || user?.fullName || 'Partner view'
    : user?.fullName || 'Your profile';

  const displayEmailLine = isPartnerMode
    ? 'Partner access (read-only)'
    : ownerUser?.email || '—';

  const profileBodyLine = isPartnerMode
    ? 'Health summary via shared APIs'
    : bodySummary;

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.profileInfoSection}>
            <Image source={images.profileIcon} style={styles.profilePicture} />
            {loading && !user ? (
              <ActivityIndicator color={colors.maroonText} style={{ marginVertical: 12 }} />
            ) : (
              <>
                <Text style={styles.profileName}>{displayName}</Text>
                <Text style={styles.profileEmail}>{displayEmailLine}</Text>
                <Text style={styles.profileBodyLine}>{profileBodyLine}</Text>
              </>
            )}

            {user && !isPartnerMode && (
              <View style={styles.unitPrefRow}>
                <TouchableOpacity
                  style={[
                    styles.unitPrefPill,
                    sys === 'metric' && styles.unitPrefPillActive,
                  ]}
                  onPress={() => saveMeasurementSystem('metric')}
                >
                  <Text
                    style={[
                      styles.unitPrefText,
                      sys === 'metric' && styles.unitPrefTextActive,
                    ]}
                  >
                    Metric
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitPrefPill,
                    sys === 'imperial' && styles.unitPrefPillActive,
                  ]}
                  onPress={() => saveMeasurementSystem('imperial')}
                >
                  <Text
                    style={[
                      styles.unitPrefText,
                      sys === 'imperial' && styles.unitPrefTextActive,
                    ]}
                  >
                    Imperial
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <Text style={styles.sectionHeading}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <StatCard
              icon={images.btCycleActive}
              label={stats.cycleLabel}
              detail={stats.cycleDetail}
            />
            <StatCard
              icon={images.clockIcon}
              label={stats.fastingLabel}
              detail={stats.fastingDetail}
            />
            <StatCard
              icon={images.challengesIcon}
              label={stats.challengeLabel}
              detail={stats.challengeDetail}
            />
            <StatCard
              icon={images.sleepQualityIcon}
              label={stats.sleepLabel}
              detail={stats.sleepDetail}
              isEmpty={statEmptyFlags.sleep}
            />
            <StatCard
              icon={images.periodCalender}
              label={stats.nextPeriodLabel}
              detail={stats.nextPeriodDetail}
            />
            <StatCard
              icon={images.eggOut}
              label={stats.avgFastLabel}
              detail={stats.avgFastDetail}
              isEmpty={statEmptyFlags.avgFast}
            />
          </View>

          <Text style={styles.sectionHeading}>Account</Text>
          <View style={styles.settingsList}>
            <SettingsRow
              title="Body Metrics"
              subtitle={isPartnerMode ? 'Owner account settings' : bodySummary}
              onPress={() => {
                if (isPartnerMode) {
                  showPartnerReadOnlyAlert();
                  return;
                }
                navigation.navigate('EditProfileBody');
              }}
            />
            <SettingsRow
              title="Goals & Cycle"
              subtitle={
                isPartnerMode
                  ? 'Owner account settings'
                  : `${formatGoalLabel(ownerUser?.primaryGoal)} · ${
                      ownerUser?.isTrackingCycle ? 'Tracking on' : 'Tracking off'
                    }`
              }
              onPress={() => {
                if (isPartnerMode) {
                  showPartnerReadOnlyAlert();
                  return;
                }
                navigation.navigate('EditProfileGoals');
              }}
            />
            <SettingsRow
              title="Dietary Preferences"
              subtitle={
                isPartnerMode
                  ? 'Owner account settings'
                  : formatDietarySummary(ownerUser?.dietaryRestrictions)
              }
              onPress={() => {
                if (isPartnerMode) {
                  showPartnerReadOnlyAlert();
                  return;
                }
                navigation.navigate('EditProfileDietary');
              }}
            />
          </View>

          {/* <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Image source={images.logoutIcon} style={styles.signOutIcon} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  detail,
  isEmpty = false,
}: {
  icon: number;
  label: string;
  detail: string;
  isEmpty?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <Image source={icon} style={styles.statIcon} />
      <Text
        style={[styles.statNumber, isEmpty && styles.statNumberMuted]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {detail}
      </Text>
    </View>
  );
}

function SettingsRow({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.settingsTitle}>{title}</Text>
        <Text style={styles.settingsSubtitle} numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
      <Text style={styles.settingsChevron}>›</Text>
    </TouchableOpacity>
  );
}
