import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { sizes } from '../../../constants/sizes';

const SECTION_GAP = sizes.screenHeight * 0.02;

export const partnerProfileStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingBottom: SECTION_GAP,
    gap: SECTION_GAP,
  },
  topContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
    textAlign: 'center',
  },
  subHeading: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  profileHero: {
    alignItems: 'center',
    gap: 4,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  profileName: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
    textAlign: 'center',
  },
  profileEmail: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  profileBodyLine: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeading: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  container2: {
    paddingHorizontal: sizes.screenWidth * 0.04,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    gap: 6,
  },
  accountSection: {
    gap: SECTION_GAP,
  },
  cardTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  cardSubtitle: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default partnerProfileStyles;
