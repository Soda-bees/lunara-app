import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingBottom: sizes.screenHeight * 0.01,
  },
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
    textAlign: 'center',
  },
  profileEmail: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 4,
  },
  profileBodyLine: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  unitPrefRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  unitPrefPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: '#fff',
  },
  unitPrefPillActive: {
    borderColor: colors.maroonText,
    backgroundColor: '#F7DEE7',
  },
  unitPrefText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
  },
  unitPrefTextActive: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
  },
  sectionHeading: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: (sizes.screenWidth * 0.9 - 24) / 3,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 12,
    alignItems: 'center',
    minHeight: 96,
  },
  statIcon: {
    height: 20,
    width: 20,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  statNumber: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.medium,
    textAlign: 'center',
    marginBottom: 4,
  },
  statNumberMuted: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  statLabel: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    textAlign: 'center',
  },
  settingsList: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    backgroundColor: '#fff',
  },
  settingsTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 2,
  },
  settingsSubtitle: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  settingsChevron: {
    color: colors.darkGrey,
    fontSize: 22,
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#FFF5F7',
  },
  signOutIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  signOutText: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});

export default styles;
