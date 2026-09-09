import React, { useCallback, useEffect } from 'react';
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
import InitialsAvatar from '../../components/InitialsAvatar';
import images from '../../constants/images/more';
import styles from './style';
import { colors } from '../../constants/colors';
import {
  clearToken,
  updateProfile,
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
import { usePartnerMode } from '../../context/PartnerModeContext';
import { useUserIdentity } from '../../context/UserIdentityContext';
import { useProfile } from '../../context/ProfileContext';
import { showPartnerReadOnlyAlert } from '../../utils/partnerReadOnly';
import { useDisplayName } from '../../hooks/useDisplayName';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();
  const { resetData } = useOnboarding();
  const { isPartnerMode, primaryUserName } = usePartnerMode();
  const { clearDisplayName, setDisplayName } = useUserIdentity();
  const identityName = useDisplayName();
  const {
    user,
    stats,
    statEmptyFlags,
    loading,
    refreshProfile,
    applyUser,
    clearProfile,
  } = useProfile();

  useFocusEffect(
    useCallback(() => {
      void refreshProfile();
    }, [refreshProfile]),
  );

  useEffect(() => {
    if (user?.fullName) {
      void setDisplayName(user.fullName);
    }
  }, [user?.fullName, setDisplayName]);

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
        applyUser(res.user);
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
            await clearDisplayName();
            clearProfile();
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
    ? identityName || primaryUserName || user?.fullName || 'Partner view'
    : identityName || user?.fullName || 'Your profile';

  const displayEmailLine = isPartnerMode
    ? 'Partner access (read-only)'
    : ownerUser?.email || '—';

  const profileBodyLine = isPartnerMode
    ? 'Health summary via shared APIs'
    : bodySummary;

  const showHeaderLoader = loading && !user && !identityName;

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'bottom']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.profileInfoSection}>
            <View style={styles.profilePicture}>
              <InitialsAvatar name={identityName} size={100} />
            </View>
            {showHeaderLoader ? (
              <ActivityIndicator
                color={colors.maroonText}
                style={{ marginVertical: 12 }}
              />
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
