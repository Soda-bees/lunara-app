import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
  },

  phaseBody: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },

  progressIndicator: {
    width: '100%',
    height: 4,
    borderRadius: 3,
    backgroundColor: '#E4E4E4',
    marginBottom: 12,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    width: '30%', // example, dynamic based on progress
    borderRadius: 3,
  },

  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },

  textBlackNormal: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  softCopyContainer: {
    backgroundColor: '#ECF0F6',
    width: sizes.screenWidth * 0.82,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },

  rowFlexBox: {
    width: sizes.screenWidth * 0.82,
    gap: 12,
    flexDirection: 'row',
    marginTop: 12,
  },

  flexBox: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  greenText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },

  textBlackSmall: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  icon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },

  textBlackBold: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  container2: {
    paddingHorizontal: sizes.screenWidth * 0.04,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderRadius: 16,
    borderColor: colors.borderColor,
    gap: 16,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
  },

  headerProgress: {
    fontSize: 14,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },

  sectionHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.green,
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 1,
  },

  ritualsSection: {
    gap: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#00000015',
    marginVertical: 15,
  },

  /* Ritual item */
  itemContainer: {
    gap: 6,
  },

  itemHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkIcon: {
    width: 18,
    height: 18,
    tintColor: '#9FADBD',
  },

  itemTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.black,
  },

  actionLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#E7A169',
  },

  tagRow: {},

  tagText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Light',
  },

  itemDescription: {
    marginLeft: 24,
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },

  /* Bottom button */
  updateButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
  updateButtonGradient: {
    paddingVertical: 10,
    borderRadius: 12,
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
  },
  sectionTitleGreen: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  row2: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  optionBox: {
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  optionEmojiText: {
    fontSize: 22,
  },
  optionEmoji: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  subText: {
    color: '#777',
    fontSize: 12,
  },
  sleepRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagGreen: {
    backgroundColor: '#E1F8E8',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  linkRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 16,
    alignItems: 'center',
  },
  link: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  arrow: {
    marginLeft: 5,
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  insightCard: {
    gap: 4,
    width: sizes.screenWidth * 0.39,
  },

  insightLabel: {
    fontSize: 14,
    color: colors.green,
    fontFamily: 'Inder-Regular',
  },
  insightValue: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Inder-Regular',
  },
  insightStatus: {
    fontSize: 14,
    color: colors.heading,
    fontFamily: 'Inder-Regular',
  },
  noteBox: {
    marginTop: 14,
    backgroundColor: '#F3F3F3',
    padding: 12,
    borderRadius: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#555',
  },
  challengeTitle: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading,
  },
  challengeDisclaimer: {
    marginTop: 4,
    color: colors.darkGrey,
    fontSize: 12,
  },
  challengeButton: {
    marginTop: 16,
    backgroundColor: '#E4AF5D',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  challengeBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  plusBtn: {
    backgroundColor: '#F7DEE7',
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  textMaroon: {
    fontSize: 14,
    color: '#901933',
    fontFamily: 'Inder-Regular',
  },

  /* -------------------------------------------
     WHITE CARD CONTAINER  (container2)
  -------------------------------------------- */

  cardHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.black,
  },

  cardSubText: {
    fontSize: 12,
    color: colors.darkGray,
    marginTop: 2,
  },

  /* -------------------------------------------
     8+ HOURS GOAL - PROGRESS DAYS
  -------------------------------------------- */
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dayBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 2,
  },

  // GREEN for > 8 hours
  dayBoxGood: {
    backgroundColor: colors.heading,
    borderColor: colors.heading,
  },

  // ORANGE / RED for < 8 hours
  dayBoxLow: {
    backgroundColor: '#EEEEEE',
    borderColor: '#EEEEEE',
  },

  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#C5C5C5',
  },

  dayTextGood: {
    color: '#ffffff',
  },

  dayTextLow: {},

  percentText: {
    alignSelf: 'flex-end',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },

  /* -------------------------------------------
     SLEEP PATTERNS PROGRESS BAR
  -------------------------------------------- */
  smallIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },

  phaseProgressBarBackground: {
    width: '100%',
    // height: 4,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    marginTop: 4,
  },

  phaseProgressBarBackground2: {
    width: '100%',
    // height: 4,
    borderRadius: 8,
    backgroundColor: '#DBDBDB',
    marginTop: 4,
  },

  phaseProgress: {
    height: 4,
    borderRadius: 8,
  },

  /* -------------------------------------------
     RECENT SLEEP LOG
  -------------------------------------------- */
  logRow: {},

  logDate: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
  },

  logTime: {
    fontSize: 12,
    marginTop: 2,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },

  logRight: {
    alignItems: 'flex-end',
  },

  logHours: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },

  /* Badge */
  badge: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F7DEE7', // soft pink badge
    borderRadius: 20,
  },

  badgeText: {
    color: colors.maroonText,
    fontSize: 12,
    fontWeight: '600',
  },

  /* -------------------------------------------
     SLEEP INSIGHTS CARD
  -------------------------------------------- */
  insightHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.white,
  },

  insightText: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 6,
    lineHeight: 20,
  },
});

export default styles;
