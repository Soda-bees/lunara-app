import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { sizes } from '../../../constants/sizes';

const SECTION_GAP = sizes.screenHeight * 0.02;

export const partnerTrackStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: sizes.screenWidth * 0.05,
  },
  scrollContent: {
    gap: SECTION_GAP,
    paddingBottom: SECTION_GAP,
  },
  flushOuterMargin: {
    marginTop: 0,
    marginBottom: 0,
    marginVertical: 0,
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
  sectionContent: {
    gap: SECTION_GAP,
  },
  container2: {
    paddingHorizontal: sizes.screenWidth * 0.04,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: colors.borderColor,
    backgroundColor: colors.white,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
  },
  sectionIntroTitle: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  sectionIntroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    marginTop: 4,
  },
  appleIcon: {
    width: 22,
    height: 22,
    tintColor: colors.heading,
    resizeMode: 'contain',
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayHeading: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  todayInnerBox: {
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 10,
  },
  phaseLabel: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  phaseSubheading: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  emptyBody: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    lineHeight: 20,
  },
  errorText: {
    color: '#C62828',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  mutedText: {
    color: colors.darkGrey,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  dayContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  dayHeaderLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  dateTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginTop: 2,
  },
  todayTag: {
    backgroundColor: colors.heading,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  todayTagText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: colors.white,
  },
  dayCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.green,
  },
  mealCard: {
    paddingHorizontal: 15,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dot: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 8,
  },
  mealTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.heading,
  },
  mealTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 4,
  },
  mealDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    marginBottom: 6,
  },
  macroText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  logMeta: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  phaseBody: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseLabelSmall: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },
  phaseTitleLarge: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
    marginTop: 2,
  },
  phasePill: {
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.05,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  phasePillText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.heading,
  },
  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  dumbellIcon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.1,
    height: sizes.screenHeight * 0.05,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  infoIcon: {
    width: 15,
    height: 15,
    tintColor: colors.heading,
    resizeMode: 'contain',
    marginTop: 2,
  },
  infoHeading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  infoValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 2,
  },
  scienceEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  scienceTitle: {
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 14,
    color: colors.black,
  },
  scienceDesc: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 2,
    lineHeight: 18,
  },
  loadingRow: {
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
});

export default partnerTrackStyles;
