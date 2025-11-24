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
  },

  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default styles;
