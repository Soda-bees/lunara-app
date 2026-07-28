import { StyleSheet } from 'react-native';
import { fontSize } from '../../../constants/fonts';
import { colors } from '../../../constants/colors';
import { sizes } from '../../../constants/sizes';

const SECTION_GAP = sizes.screenHeight * 0.02;

const styles = StyleSheet.create({
  scrollContent: {
    gap: SECTION_GAP,
    paddingBottom: SECTION_GAP,
  },

  flushOuterMargin: {
    marginTop: 0,
    marginBottom: 0,
    marginVertical: 0,
  },

  didYouKnowCard: {
    flexDirection: 'row',
    padding: 15,
  },

  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
  },

  phaseBody: {
    width: sizes.screenWidth * 0.9,
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  topContainer: {
    alignItems: 'center',
    alignSelf: 'center',
  },

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },

  subHeading: {
    color: colors.green,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  cyclePhaseCard: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginVertical: 16,
  },

  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },

  numberTextGradient: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading,
  },

  numberTextMedium: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },

  dayTextContainer: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderPink,
  },

  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },

  textDarkGreyWidht: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    width: sizes.screenWidth * 0.7,
  },

  textBlackNormal: {
    fontSize: 14,
    color: colors.maroonText,
    fontFamily: 'Inter-SemiBold',
  },

  phasesView: {
    marginLeft: 8,
  },

  logButton: {
    backgroundColor: colors.heading,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderRadius: 16,
    marginVertical: 20,
  },

  dropImg: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
  },

  text: {
    fontSize: fontSize.medium,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 7,
  },

  overdueCard: {
    padding: 14,
    backgroundColor: '#FFF8EB',
    borderWidth: 1,
    borderColor: colors.heading + '40',
    borderRadius: 12,
    gap: 8,
  },

  overdueTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    marginBottom: 4,
  },

  overdueText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 18,
  },

  overdueActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 4,
  },

  overduePrimaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.heading,
  },

  overduePrimaryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
  overduePrimaryButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.heading,
  },
  overduePrimaryTextSecondary: {
    color: colors.heading,
  },

  overdueSecondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  overdueSecondaryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.green,
  },

  inProgressCard: {
    padding: 12,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderPink,
    backgroundColor: '#FFF8FB',
  },

  inProgressTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.maroonText,
    marginBottom: 4,
  },

  inProgressText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.darkGrey,
    marginBottom: 10,
  },

  inProgressButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: sizes.screenWidth * 0.03,
    backgroundColor: colors.heading,
  },

  inProgressButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.white,
  },

  pregnancyView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF5',
    borderColor: '#95E5B6',
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.03,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },

  heartImageView: {
    borderWidth: 1,
    padding: 13,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: '#A6E9C2',
    backgroundColor: '#CDFFEA',
    alignSelf: 'flex-start',
  },

  phaseImageView: {
    padding: 13,
    borderRadius: sizes.screenWidth * 0.1,
    alignSelf: 'flex-start',
  },

  pregnanyHeartImage: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  pregnancyIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pregnancyText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginRight: 10,
  },

  lowTextView: {
    backgroundColor: '#CDFFEA',
    width: sizes.screenWidth * 0.15,
    borderRadius: sizes.screenWidth * 0.1,
    paddingVertical: 4,
    marginVertical: 7,
  },

  lowText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3FCE91',
    textAlign: 'center',
  },

  trackSymptomsView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 18,
    justifyContent: 'space-between',
    borderRadius: sizes.screenWidth * 0.03,
  },

  trackActiveStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  trackText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  trackSubText: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  logNowView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: sizes.screenWidth * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderPink,
  },

  marginLeft: {
    marginLeft: 10,
  },

  weeklyUpdateMaincontainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 18,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  headerRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    justifyContent: 'space-between',
  },

  calenderImage: {
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
    resizeMode: 'contain',
  },

  cycleText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    marginLeft: 8,
    color: colors.black,
  },

  listWrapper: {
    marginTop: 4,
  },

  historyCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 16,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },

  historyRangeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.black,
  },

  historyMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.green,
    marginTop: 2,
  },

  historyFooter: {
    marginTop: 8,
    alignItems: 'center',
  },
  historyFooterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.darkGrey,
    marginBottom: 8,
    textAlign: 'center',
  },
  viewAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewAllButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.primary,
  },

  weeklyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    marginTop: 2,
  },

  ideaImage: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.11,
    height: sizes.screenWidth * 0.11,
  },

  infoText: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
  },

  infoSubText: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 5,
  },

  creditText: {
    color: colors.green,
    fontFamily: 'Inter-SemiBoldItalic',
    fontSize: 12,
    marginTop: 10,
  },

  journalStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  bottomEntryButton: {
    // borderWidth:1,
    paddingHorizontal: sizes.screenWidth * 0.1,
    paddingVertical: 9,
    borderRadius: sizes.screenWidth * 0.03,
    marginTop: SECTION_GAP,
  },

  bottomButtonView: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    // borderRadius: sizes.screenWidth * 0.03,
    // padding: 18,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },

  regularityContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
    alignSelf: 'flex-start',
  },

  regularityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  regularityLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.darkGrey,
  },

  regularityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.05,
  },

  regularityBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },

  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },

  confidenceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.darkGrey,
    minWidth: 140,
  },

  confidenceBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.borderColor,
    borderRadius: 3,
    overflow: 'hidden',
  },

  confidenceBar: {
    height: '100%',
    borderRadius: 3,
  },

  confidenceText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    minWidth: 100,
  },

  dataQualityText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginTop: 6,
    fontStyle: 'italic',
  },

  analyticsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 16,
  },

  analyticsRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColor,
  },

  analyticsLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 6,
  },

  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },

  trendText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },

  analyticsValue: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },

  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },

  symptomTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.05,
    backgroundColor: colors.borderPink,
  },

  symptomTagText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.maroonText,
  },

  irregularCycleCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF8EB',
    borderRadius: sizes.screenWidth * 0.02,
    borderWidth: 1,
    borderColor: colors.heading,
  },

  irregularCycleTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
    marginBottom: 4,
  },

  irregularCycleText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 18,
  },

  missingPeriodCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: sizes.screenWidth * 0.02,
    borderWidth: 1,
    borderColor: colors.maroonText,
  },

  missingPeriodTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.maroonText,
    marginBottom: 4,
  },

  missingPeriodText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 18,
    marginBottom: 8,
  },

  missingPeriodButton: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.maroonText,
    borderRadius: sizes.screenWidth * 0.02,
    alignSelf: 'flex-start',
  },

  missingPeriodButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },

  firstPeriodCard: {
    backgroundColor: '#E6FFF5',
    borderRadius: sizes.screenWidth * 0.03,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.green,
  },

  firstPeriodTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    marginBottom: 8,
  },

  firstPeriodText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
    marginBottom: 16,
  },

  firstPeriodButton: {
    backgroundColor: colors.green,
    borderRadius: sizes.screenWidth * 0.02,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },

  firstPeriodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
  pregnantCtaButton: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.lightPrimary + '40',
  },
  pregnantCtaText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  progressIndicator: {
    width: '100%',
    height: 8,
    backgroundColor: colors.borderColor,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  babySizeText: {
    fontSize: 18,
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginBottom: 8,
  },
  insightItem: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FFD699',
  },
  warningTitle: {
    color: '#D97706',
  },
  warningItem: {
    fontSize: 12,
    color: '#D97706',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    lineHeight: 18,
  },
  actionsContainer: {
    width: sizes.screenWidth * 0.82,
    gap: 12,
    marginTop: 20,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: colors.heading,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.heading,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    minHeight: 50,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: colors.heading + '25',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 50,
  },
  actionButtonText: {
    fontSize: 15,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  secondaryButtonText: {
    color: colors.heading,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spacedText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Light-BETA',
    letterSpacing: 3,
    marginBottom: 8,
  },
  predictionInfoContainer: {
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.heading,
  },
  predictionInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 18,
  },
  symptomHistorySection: {
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  symptomHistoryTitle: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading,
    marginBottom: 16,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  symptomItemDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginBottom: 4,
  },
  symptomItemName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  symptomSeverityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  symptomSeverityText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  viewFullHistoryLink: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewFullHistoryLinkText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.heading,
  },
  symptomPatternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  symptomPatternName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.black,
    marginRight: 12,
  },
  noSymptomsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default styles;
