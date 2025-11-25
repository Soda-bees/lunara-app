import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
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
  },

  greenText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Regular',
    // height: 2000,
  },
});

export default styles;
