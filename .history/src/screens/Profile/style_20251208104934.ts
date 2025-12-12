import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingTop: 8,
    paddingBottom: 8,
    position: 'relative',
  },

  profileHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
    position: 'absolute',
    right: sizes.screenWidth * 0.05,
    top: 8,
  },

  profileHeaderIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },

  profileHeaderText: {
    fontSize: fontSize.regular,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  contentContainer: {
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingBottom: 32,
  },

  // Profile Info Section
  profileInfoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },

  profileName: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
    marginBottom: 4,
  },

  profileEmail: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 10,
  },

  editProfileButton: {
    backgroundColor: '#F7DEE7',
    borderRadius: 30,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },

  editProfileText: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 12,
    alignItems: 'center',
  },

  statIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },

  statNumber: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24,
    marginBottom: 4,
  },

  statLabel: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECF3EF',
    borderRadius: 25,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },

  tabActive: {
    backgroundColor: '#fff',
  },

  tabText: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  tabTextActive: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  tabContent: {
    marginBottom: 16,
    gap: 16,
  },

  sectionSmall: {
    width: sizes.screenWidth * 0.8,
    gap: 12,
  },

  // Section Styles
  section: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: sizes.screenWidth * 0.9,
  },

  sectionIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },

  sectionTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 14,
  },

  sectionSubtitle: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
    marginTop: 2,
  },

  // Insight Cards
  insightCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 6,
  },

  insightCardIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },

  insightCardTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  insightCardText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Pattern Cards
  patternCard: {
    marginVertical: 8,
  },

  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  patternTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  patternBadge: {
    backgroundColor: '#EDF8F1',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  patternBadgePink: {
    backgroundColor: '#FFE8EC',
  },

  patternBadgeText: {
    color: '#5BCE8B',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  progressBar: {
    height: 5,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 2,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  patternDescription: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Energy Map
  energyMapCard: {
    gap: 8,
    marginTop: 12,
  },

  energyPhaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F4F4F4',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  energyPhaseName: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.regular,
    width: 120,
  },

  energyBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    overflow: 'hidden',
    marginLeft: 12,
  },

  energySegment: {
    height: '100%',
    backgroundColor: colors.heading,
    borderRadius: 6,
  },

  // Weight Tracking
  logButton: {
    backgroundColor: '#FFE8EC',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },

  logButtonText: {
    color: '#F1557A',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.regular,
  },

  weightTrendCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 16,
    marginBottom: 16,
  },

  weightTrendTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },

  weightTrendSubtitle: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
    marginBottom: 16,
  },

  weightStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  weightStatCard: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  weightStatLabel: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
    marginBottom: 4,
  },

  weightStatValue: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24,
    marginBottom: 2,
  },

  weightStatUnit: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
  },

  weightChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },

  weightChangeIcon: {
    fontSize: 16,
  },

  weightChangeValue: {
    color: colors.green,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24,
  },

  weightChangePercent: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
  },

  // Graph
  graphContainer: {
    height: 120,
    position: 'relative',
    marginTop: 8,
  },

  graphLine: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E4AF5D',
    borderRadius: 1,
  },

  graphPoints: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },

  graphPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.heading,
  },

  graphLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  graphLabel: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
  },

  // Recent Entries
  recentEntriesSection: {
    marginTop: 8,
  },

  recentEntriesTitle: {
    color: colors.black,
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.small,
    letterSpacing: 1,
    marginBottom: 12,
  },

  recentEntryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#D4F4DD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  recentEntryWeight: {
    color: colors.black,
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.regular,
    marginBottom: 2,
  },

  recentEntryDate: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
  },

  recentEntryNote: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
    marginTop: 4,
  },

  recentEntryTag: {
    backgroundColor: '#FFE8EC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  recentEntryTagText: {
    color: '#F1557A',
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.small,
  },

  // Active Tracking
  activeTrackingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 12,
    marginBottom: 8,
  },

  activeTrackingIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  activeTrackingInfo: {
    flex: 1,
  },

  activeTrackingName: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.regular,
    marginBottom: 2,
  },

  activeTrackingFrequency: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
  },

  activeTag: {
    backgroundColor: '#D4F4DD',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  activeTagText: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.small,
  },

  // Summary Cards
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },

  summaryCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 16,
    alignItems: 'center',
  },

  summaryCardValue: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 28,
    marginBottom: 4,
  },

  summaryCardLabel: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.small,
    textAlign: 'center',
  },

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },

  badgeCard: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },

  badgeIcon: {
    fontSize: 24,
    marginBottom: 6,
  },

  badgeTitle: {
    color: colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.small,
    textAlign: 'center',
  },

  // Completed Challenges
  completedChallengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  challengeIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  challengeInfo: {
    flex: 1,
  },

  challengeTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  challengeDate: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  checkmarkIcon: {
    fontSize: 24,
    color: colors.green,
  },

  // Current Challenge
  currentChallengeTitle: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 16,
  },

  currentChallengeCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 16,
  },

  currentChallengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  currentChallengeName: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 4,
  },

  currentChallengeProgress: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  calendarIcon: {
    fontSize: 24,
  },

  continueChallengeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  continueChallengeGradient: {
    paddingVertical: 8,
    alignItems: 'center',
  },

  continueChallengeText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.regular,
  },

  // Preferences
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  preferenceIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },

  preferenceInfo: {
    flex: 1,
  },

  preferenceTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  preferenceSubtitle: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Units & Display
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },

  unitLabel: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  unitValue: {
    color: colors.heading,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Account Actions
  accountActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 16,
    gap: 8,
  },

  accountActionIcon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },

  accountActionText: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },

  signOutIcon: {
    color: '#F1557A',
  },

  signOutText: {
    color: '#D6757B',
  },

  energyBarContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'flex-end',
  },

  energyBarItem: {
    width: 6,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#D9D9D9',
  },

  energyBarItemActive: {
    backgroundColor: colors.heading, // your pink theme color
  },
});

export default styles;
