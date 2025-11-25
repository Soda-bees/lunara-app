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

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  currentPhaseIconMain: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },

  phaseTextContainer: {
    borderWidth: 1.5,
    borderColor: colors.heading,
    borderRadius: 50,
    paddingHorizontal: 12,
    marginTop: sizes.screenHeight * 0.01,
    marginBottom: sizes.screenHeight * 0.03,
  },

  textPrimary: {
    fontSize: fontSize.regular,
    color: colors.heading,
    fontFamily: 'Inter-Regular',
  },

  colCenter: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
  },

  spacedText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Light-BETA',
    letterSpacing: 3,
  },

  textBlackMedium: {
    fontSize: fontSize.medium,
    color: colors.black,
    fontFamily: 'Inter-Regular',
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
  },

  numberTextGradient: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading, // default, can replace with gradient later
  },

  numberTextMedium: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },

  dayTextContainer: {
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#D4D4D4',
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

  lutealIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
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

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },

  slideIcon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },

  rowFlexBox: {
    width: sizes.screenWidth * 0.82,
    gap: 16,
    flexDirection: 'row',
  },

  flexBox: {
    flex: 1,
    backgroundColor: '#DFE7F7',
    gap: 4,
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

  thisPhaseDataContainer: {
    marginVertical: 16,
    gap: 18,
  },

  section: {
    gap: 8,
  },

  bulletPoint: {
    height: 6,
    width: 6,
    backgroundColor: colors.heading,
    borderRadius: 5,
  },

  pinkishGradient: {
    borderWidth: 1.5,
    borderColor: '#E799AD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 18,
    gap: 8,
  },

  container: {
    paddingHorizontal: sizes.screenWidth * 0.04,
    paddingVertical: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.borderColor,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
  },
  headerProgress: {
    fontSize: 14,
    color: colors.green,
    fontFamily: 'Inter-Regular',
  },

  sectionHeading: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: colors.greyDark,
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
    gap: 6,
  },

  checkIcon: {
    width: 18,
    height: 18,
    tintColor: '#9FADBD',
  },

  itemTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: colors.black,
  },

  actionLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#E7A169',
  },

  tagRow: {
    marginLeft: 24,
  },

  tagText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Light',
  },

  itemDescription: {
    marginLeft: 24,
    fontSize: 13,
    color: '#6A6A6A',
    fontFamily: 'Inter-Light',
    lineHeight: 18,
  },

  /* Bottom button */
  updateButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '100%',
  },
  updateButtonGradient: {
    paddingVertical: 14,
    borderRadius: 50,
  },
  updateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  row2: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  optionBox: {
    width: '23%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
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
    color: '#E29A35',
    fontWeight: '600',
  },
  arrow: {
    color: '#E29A35',
    marginLeft: 5,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777',
  },
  insightValue: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  insightStatus: {
    fontSize: 12,
    color: '#E29A35',
    marginTop: 2,
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
    fontWeight: '700',
    marginTop: 4,
  },
  challengeDisclaimer: {
    marginTop: 4,
    color: '#666',
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
});

export default styles;
