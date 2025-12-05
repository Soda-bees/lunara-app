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
    zIndex: 10,
  },

  profileButton: {
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

  profileIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },

  profileText: {
    fontSize: fontSize.regular,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  contentContainer: {
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingBottom: 32,
    gap: 20,
  },

  quickGuideButton: {
    borderRadius: 50,
    overflow: 'hidden',

    backgroundColor: colors.heading,
    alignSelf: 'center',
    paddingVertical: 2,
    paddingHorizontal: 14,
  },

  quickGuideGradient: {
    alignItems: 'center',
  },

  quickGuideText: {
    color: colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },

  mainTitle: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },

  subtitle: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: sizes.screenWidth * 0.7,
  },

  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },

  downloadIcon: {
    fontSize: 18,
  },

  downloadText: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: fontSize.regular,
  },

  sectionSmall: {
    width: sizes.screenWidth * 0.8,
  },

  section: {
    width: sizes.screenWidth * 0.8,
    alignSelf: 'center',
    gap: 16,
  },

  sectionTitle: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },

  sectionHeading: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 16,
    alignSelf: 'center',
  },

  infoText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Phase Card Styles
  phaseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 16,
  },

  phaseHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },

  phaseIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  phaseIconContainer: {
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headingLight,
    borderRadius: 50,
  },

  phaseHeaderText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },

  phaseName: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 16,
  },

  phaseDuration: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  phaseDurationContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
  },

  hormoneStatus: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginBottom: 8,
  },

  themeTag: {
    backgroundColor: colors.headingLight,
    borderRadius: 20,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 12,
  },

  themeTagText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },

  phaseSection: {
    marginBottom: 10,
  },

  phaseSectionTitle: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  phaseSectionText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  // Benefits Section
  benefitsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  benefitCard: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 16,
  },

  benefitIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  benefitTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    marginBottom: 4,
  },

  principleTitle: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
    marginBottom: 4,
  },

  benefitDescription: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    maxWidth: sizes.screenWidth * 0.65,
  },

  // Principles Section
  principleCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E4D4',
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },

  principleIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  principleDescription: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.regular,
    lineHeight: 20,
  },

  // CTA Section
  ctaText: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.regular,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },

  beginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 8,
  },

  beginButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },

  beginButtonText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: fontSize.medium,
  },
});

export default styles;
