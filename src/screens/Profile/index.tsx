import React from 'react';
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
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import images from '../../constants/images';
import styles from './style';
import { colors } from '../../constants/colors';
import { updateProfile } from '../../services/api';
import {
  DEFAULT_MEASUREMENT_SYSTEM,
  type MeasurementSystem,
} from '../../utils/measurement';
import { formatBodySummary } from './edit/EditBodyMetricsScreen';
import { formatGoalLabel } from './edit/EditGoalsCycleScreen';
import { formatDietarySummary } from './edit/EditDietaryScreen';
import { usePartnerMode } from '../../context/PartnerModeContext';
import PartnerProfileView from '../partner/Profile/PartnerProfileView';
import ProfileStatCard from './components/ProfileStatCard';
import { useProfileDashboard } from './useProfileDashboard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const { isPartnerMode } = usePartnerMode();

  if (isPartnerMode) {
    return <PartnerProfileView />;
  }

  return <OwnerProfile />;
}

function OwnerProfile() {
  const navigation = useNavigation<NavigationProp>();
  const { user, setUser, stats, statEmptyFlags, loading } = useProfileDashboard();

  const sys: MeasurementSystem =
    user?.measurementSystem ?? DEFAULT_MEASUREMENT_SYSTEM;

  const saveMeasurementSystem = async (next: MeasurementSystem) => {
    try {
      const res = await updateProfile({ measurementSystem: next });
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch {
      Alert.alert('Error', 'Could not update unit preference.');
    }
  };

  const bodySummary =
    user?.heightCm != null || user?.weightKg != null
      ? formatBodySummary(user.heightCm, user.weightKg, sys)
      : 'Add height and weight';

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
              <ActivityIndicator
                color={colors.maroonText}
                style={{ marginVertical: 12 }}
              />
            ) : (
              <>
                <Text style={styles.profileName}>
                  {user?.fullName || 'Your profile'}
                </Text>
                <Text style={styles.profileEmail}>{user?.email || '—'}</Text>
                <Text style={styles.profileBodyLine}>{bodySummary}</Text>
              </>
            )}

            {user && (
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

          <Text style={styles.sectionHeading}>Account</Text>
          <View style={styles.settingsList}>
            <SettingsRow
              title="Body Metrics"
              subtitle={bodySummary}
              onPress={() => navigation.navigate('EditProfileBody')}
            />
            <SettingsRow
              title="Goals & Cycle"
              subtitle={`${formatGoalLabel(user?.primaryGoal)} · ${
                user?.isTrackingCycle ? 'Tracking on' : 'Tracking off'
              }`}
              onPress={() => navigation.navigate('EditProfileGoals')}
            />
            <SettingsRow
              title="Dietary Preferences"
              subtitle={formatDietarySummary(user?.dietaryRestrictions)}
              onPress={() => navigation.navigate('EditProfileDietary')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
