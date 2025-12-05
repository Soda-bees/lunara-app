import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import images from '../../constants/images';
import styles from './style';
import GradientWrapper from '../../components/GradientWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type TabType = 'Insights' | 'Tracking' | 'Achievements';

export default function Profile() {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Insights');
  const [dailyReminders, setDailyReminders] = useState(true);
  const [phaseNotifications, setPhaseNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <BackButton />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Profile Info Section */}
          <View style={styles.profileInfoSection}>
            <Image source={images.profileIcon} style={styles.profilePicture} />
            <Text style={styles.profileName}>Luna Goddess</Text>
            <Text style={styles.profileEmail}>luna@example.com</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Image source={images.challengesIcon} style={styles.statIcon} />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Image source={images.feelingsIcon} style={styles.statIcon} />
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Total Day</Text>
            </View>
            <View style={styles.statCard}>
              <Image source={images.badgesIcon} style={styles.statIcon} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Insights' && styles.tabActive]}
              onPress={() => setActiveTab('Insights')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Insights' && styles.tabTextActive,
                ]}
              >
                Insights
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Tracking' && styles.tabActive]}
              onPress={() => setActiveTab('Tracking')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Tracking' && styles.tabTextActive,
                ]}
              >
                Tracking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'Achievements' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('Achievements')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'Achievements' && styles.tabTextActive,
                ]}
              >
                Achievements
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'Insights' && <InsightsTab />}
          {activeTab === 'Tracking' && <TrackingTab />}
          {activeTab === 'Achievements' && <AchievementsTab />}

          {/* Common Sections (visible in all tabs) */}
          <PreferencesSection
            dailyReminders={dailyReminders}
            phaseNotifications={phaseNotifications}
            setDailyReminders={setDailyReminders}
            setPhaseNotifications={setPhaseNotifications}
          />
          <UnitsDisplaySection />
          <AccountActionsSection navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Insights Tab Component
function InsightsTab() {
  return (
    <View style={styles.tabContent}>
      {/* Deep Insights Section */}
      <GradientWrapper variant="basic">
        <View style={styles.sectionSmall}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🧠</Text>
            <Text style={styles.sectionTitle}>Deep Insights</Text>
          </View>

          <View style={styles.insightCard}>
            <Image source={images.mindsetIcon} style={styles.insightCardIcon} />
            <View>
              <Text style={styles.insightCardTitle}>Your Cycle Superpower</Text>
              <Text style={styles.insightCardText}>
                You're most energetic during days 9-14. Consider scheduling
                important activities then.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Image source={images.energyHigh} style={styles.insightCardIcon} />

            <View>
              <Text style={styles.insightCardTitle}>Energy Trend</Text>
              <Text style={styles.insightCardText}>
                Your overall energy is up 23% this cycle compared to last month.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <Image source={images.mindsetIcon} style={styles.insightCardIcon} />

            <View>
              <Text style={styles.insightCardTitle}>Sleep Quality</Text>
              <Text style={styles.insightCardText}>
                You sleep 1.5 hours longer during your menstrual phase. Honor
                this rest.
              </Text>
            </View>
          </View>
        </View>
      </GradientWrapper>

      {/* Patterns Detected Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>💓</Text>
          <Text style={styles.sectionTitle}>Patterns Detected</Text>
        </View>

        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <Text style={styles.patternTitle}>Cycle Regularity</Text>
            <View style={styles.patternBadge}>
              <Text style={styles.patternBadgeText}>Excellent</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: '90%' }]}
            />
          </View>
          <Text style={styles.patternDescription}>
            28-day average, ±1 day variation
          </Text>
        </View>

        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <Text style={styles.patternTitle}>Movement Consistency</Text>
            <View style={[styles.patternBadge, styles.patternBadgePink]}>
              <Text style={styles.patternBadgeText}>Excellent</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: '85%' }]}
            />
          </View>
          <Text style={styles.patternDescription}>
            5-6 days active per week
          </Text>
        </View>

        <View style={styles.patternCard}>
          <View style={styles.patternHeader}>
            <Text style={styles.patternTitle}>Fasting Adherence</Text>
            <View style={styles.patternBadge}>
              <Text style={styles.patternBadgeText}>Strong</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: '80%' }]}
            />
          </View>
          <Text style={styles.patternDescription}>
            14-16 hour fasts, 4-5x weekly
          </Text>
        </View>
      </View>

      {/* Energy Map Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚡</Text>
          <Text style={styles.sectionTitle}>Your Energy Map</Text>
        </View>

        <View style={styles.energyMapCard}>
          <View style={styles.energyPhaseRow}>
            <Text style={styles.energyPhaseName}>Menstrual Phase</Text>
            <View style={styles.energyBar}>
              <View style={[styles.energySegment, { width: '60%' }]} />
            </View>
          </View>
          <View style={styles.energyPhaseRow}>
            <Text style={styles.energyPhaseName}>Follicular Phase</Text>
            <View style={styles.energyBar}>
              <View style={[styles.energySegment, { width: '80%' }]} />
            </View>
          </View>
          <View style={styles.energyPhaseRow}>
            <Text style={styles.energyPhaseName}>Ovulatory Phase</Text>
            <View style={styles.energyBar}>
              <View style={[styles.energySegment, { width: '100%' }]} />
            </View>
          </View>
          <View style={styles.energyPhaseRow}>
            <Text style={styles.energyPhaseName}>Luteal Phase</Text>
            <View style={styles.energyBar}>
              <View style={[styles.energySegment, { width: '80%' }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// Tracking Tab Component
function TrackingTab() {
  return (
    <View style={styles.tabContent}>
      {/* Weight Tracking Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚖️</Text>
            <View>
              <Text style={styles.sectionTitle}>Weight Tracking</Text>
              <Text style={styles.sectionSubtitle}>
                Monitor your progress over time
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logButton}>
            <Text style={styles.logButtonText}>+ Log</Text>
          </TouchableOpacity>
        </View>

        {/* Weight Trend */}
        <View style={styles.weightTrendCard}>
          <Text style={styles.weightTrendTitle}>Weight Trend</Text>
          <Text style={styles.weightTrendSubtitle}>
            Your progress over time
          </Text>

          <View style={styles.weightStatsRow}>
            <View style={styles.weightStatCard}>
              <Text style={styles.weightStatLabel}>Current</Text>
              <Text style={styles.weightStatValue}>149.8</Text>
              <Text style={styles.weightStatUnit}>lbs</Text>
            </View>
            <View style={styles.weightStatCard}>
              <Text style={styles.weightStatLabel}>Change</Text>
              <View style={styles.weightChangeRow}>
                <Text style={styles.weightChangeIcon}>📉</Text>
                <Text style={styles.weightChangeValue}>2.6</Text>
              </View>
              <Text style={styles.weightChangePercent}>-1.7% loss</Text>
            </View>
          </View>

          {/* Simple Graph Representation */}
          <View style={styles.graphContainer}>
            <View style={styles.graphLine} />
            <View style={styles.graphPoints}>
              <View style={[styles.graphPoint, { left: '5%', top: '20%' }]} />
              <View style={[styles.graphPoint, { left: '25%', top: '25%' }]} />
              <View style={[styles.graphPoint, { left: '45%', top: '30%' }]} />
              <View style={[styles.graphPoint, { left: '65%', top: '35%' }]} />
              <View style={[styles.graphPoint, { left: '85%', top: '40%' }]} />
            </View>
            <View style={styles.graphLabels}>
              <Text style={styles.graphLabel}>Oct 1</Text>
              <Text style={styles.graphLabel}>Oct 23</Text>
            </View>
          </View>
        </View>

        {/* Recent Entries */}
        <View style={styles.recentEntriesSection}>
          <Text style={styles.recentEntriesTitle}>RECENT ENTRIES</Text>
          {[
            { weight: '149.8 lbs', date: 'Oct 23, 2025', tag: 'Latest' },
            {
              weight: '150.3 lbs',
              date: 'Oct 20, 2025',
              note: 'Great progress!',
            },
            { weight: '150.6 lbs', date: 'Oct 15, 2025' },
            { weight: '151.2 lbs', date: 'Oct 10, 2025' },
            { weight: '151.8 lbs', date: 'Oct 5, 2025', note: 'Feeling good' },
          ].map((entry, index) => (
            <View key={index} style={styles.recentEntryCard}>
              <View>
                <Text style={styles.recentEntryWeight}>{entry.weight}</Text>
                <Text style={styles.recentEntryDate}>{entry.date}</Text>
                {entry.note && (
                  <Text style={styles.recentEntryNote}>{entry.note}</Text>
                )}
              </View>
              {entry.tag && (
                <View style={styles.recentEntryTag}>
                  <Text style={styles.recentEntryTagText}>{entry.tag}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Active Tracking Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Tracking</Text>
        {[
          { icon: '🌙', name: 'Cycle Phase', frequency: 'Daily' },
          { icon: '❤️', name: 'Mood & Energy', frequency: 'Daily' },
          { icon: '⚡', name: 'Movement', frequency: '5-6x/week' },
          { icon: '⭕', name: 'Fasting', frequency: '4-5x/week' },
          { icon: '✨', name: 'Nutrition', frequency: 'Daily' },
          { icon: '🧠', name: 'Mindfulness', frequency: '3-4x/week' },
        ].map((item, index) => (
          <View key={index} style={styles.activeTrackingItem}>
            <Text style={styles.activeTrackingIcon}>{item.icon}</Text>
            <View style={styles.activeTrackingInfo}>
              <Text style={styles.activeTrackingName}>{item.name}</Text>
              <Text style={styles.activeTrackingFrequency}>
                {item.frequency}
              </Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>active</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryCardsContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>23</Text>
          <Text style={styles.summaryCardLabel}>Days Logged</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>18h</Text>
          <Text style={styles.summaryCardLabel}>Avg Fast</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>142</Text>
          <Text style={styles.summaryCardLabel}>Workouts</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>4.2</Text>
          <Text style={styles.summaryCardLabel}>Avg Energy</Text>
        </View>
      </View>
    </View>
  );
}

// Achievements Tab Component
function AchievementsTab() {
  const badges = [
    { icon: '🔥', title: 'Week 1' },
    { icon: '⏰', title: 'Fast 16h' },
    { icon: '🌙', title: 'Cycle Sync' },
    { icon: '🧘', title: 'Mindful' },
    { icon: '✨', title: 'Week 2' },
    { icon: '💪', title: 'Move Daily' },
    { icon: '🎯', title: 'Week 3' },
    { icon: '⭐', title: 'Fast 18h' },
    { icon: '👑', title: '30 Days' },
  ];

  const completedChallenges = [
    { icon: '✨', title: '14-Day Sleep Reset', date: 'Days 6 - 13' },
    { icon: '💎', title: '21-Day Abundance', date: 'Nov 2024' },
    { icon: '🦋', title: '14-Day Nervous System', date: 'Oct 2024' },
  ];

  return (
    <View style={styles.tabContent}>
      {/* Your Badges Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>🏆</Text>
          <Text style={styles.sectionTitle}>Your Badges</Text>
        </View>
        <View style={styles.badgesGrid}>
          {badges.map((badge, index) => (
            <LinearGradient
              key={index}
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.badgeCard}
            >
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeTitle}>{badge.title}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* Completed Challenges Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>✅</Text>
          <Text style={styles.sectionTitle}>Completed Challenges</Text>
        </View>
        {completedChallenges.map((challenge, index) => (
          <View key={index} style={styles.completedChallengeCard}>
            <Text style={styles.challengeIcon}>{challenge.icon}</Text>
            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDate}>{challenge.date}</Text>
            </View>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        ))}
      </View>

      {/* Current Challenge Section */}
      <View style={styles.section}>
        <Text style={styles.currentChallengeTitle}>Current Challenge</Text>
        <View style={styles.currentChallengeCard}>
          <View style={styles.currentChallengeHeader}>
            <View>
              <Text style={styles.currentChallengeName}>
                21-Day Detox Reset
              </Text>
              <Text style={styles.currentChallengeProgress}>Day 8 of 21</Text>
            </View>
            <Text style={styles.calendarIcon}>📅</Text>
          </View>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: '38%' }]}
            />
          </View>
          <TouchableOpacity style={styles.continueChallengeButton}>
            <LinearGradient
              colors={gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueChallengeGradient}
            >
              <Text style={styles.continueChallengeText}>
                Continue Challenge
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Preferences Section (Common)
function PreferencesSection({
  dailyReminders,
  phaseNotifications,
  setDailyReminders,
  setPhaseNotifications,
}: {
  dailyReminders: boolean;
  phaseNotifications: boolean;
  setDailyReminders: (value: boolean) => void;
  setPhaseNotifications: (value: boolean) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceIcon}>🔔</Text>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Daily Reminders</Text>
          <Text style={styles.preferenceSubtitle}>Daily Reminders</Text>
        </View>
        <Switch
          value={dailyReminders}
          onValueChange={setDailyReminders}
          trackColor={{ false: '#E8E8E8', true: '#E4AF5D' }}
          thumbColor={dailyReminders ? '#ffffff' : '#f4f3f4'}
        />
      </View>
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceIcon}>🌙</Text>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Phase Notifications</Text>
          <Text style={styles.preferenceSubtitle}>Cycle phase changes</Text>
        </View>
        <Switch
          value={phaseNotifications}
          onValueChange={setPhaseNotifications}
          trackColor={{ false: '#E8E8E8', true: '#E4AF5D' }}
          thumbColor={phaseNotifications ? '#ffffff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

// Units & Display Section (Common)
function UnitsDisplaySection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Units & Display</Text>
      <View style={styles.unitItem}>
        <Text style={styles.unitLabel}>Weight</Text>
        <Text style={styles.unitValue}>lbs</Text>
      </View>
      <View style={styles.unitItem}>
        <Text style={styles.unitLabel}>Temperature</Text>
        <Text style={styles.unitValue}>F</Text>
      </View>
      <View style={styles.unitItem}>
        <Text style={styles.unitLabel}>Volume</Text>
        <Text style={styles.unitValue}>fl oz</Text>
      </View>
    </View>
  );
}

// Account Actions Section (Common)
function AccountActionsSection({ navigation }: { navigation: NavigationProp }) {
  return (
    <View style={styles.section}>
      <View style={styles.accountActionItem}>
        <Text style={styles.accountActionIcon}>⚙️</Text>
        <Text style={styles.accountActionText}>Account Settings</Text>
      </View>
      <View style={styles.accountActionItem}>
        <Text style={styles.accountActionIcon}>👥</Text>
        <Text style={styles.accountActionText}>Partner Connect</Text>
      </View>
      <View style={styles.accountActionItem}>
        <Text style={styles.accountActionIcon}>❤️</Text>
        <Text style={styles.accountActionText}>Connect Wearables</Text>
      </View>
      <TouchableOpacity style={styles.accountActionItem}>
        <Text style={[styles.accountActionIcon, styles.signOutIcon]}>🚪</Text>
        <Text style={[styles.accountActionText, styles.signOutText]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}
