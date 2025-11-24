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
    fontSize: fontSize.regular,
    color: colors.green,
    fontFamily: 'Inter-Light-BETA',
    letterSpacing: 6,
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
    paddingVertical: 18,
  },

  mainContainer: {
    flex: 1,
  },

  textContainer: {
    marginTop: sizes.screenHeight * 0.05,
    marginBottom: sizes.screenHeight * 0.08,
  },

  forgotText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
  },

  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.disabledText,
    marginTop: 6,
  },

  inputContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.03,
    borderRadius: 16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  input: {
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.regular,
    color: colors.disabledText,
    width: sizes.screenWidth * 0.64,
    marginLeft: 3,
  },

  inputIcon: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },

  emailIconStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
    // backgroundColor:'red'
  },

  textInput: {
    marginLeft: 5,
    width: sizes.screenWidth * 0.7,
    fontSize: fontSize.smallM,
    color: colors.black,
    fontFamily: 'MP-Medium',

    // backgroundColor:'red'
  },

  iconInputView: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: sizes.screenHeight * 0.07,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.04,
    borderRadius: sizes.screenWidth * 0.1,
    width: sizes.screenWidth * 0.9,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: colors.inputBorderGray,
    marginTop: sizes.screenHeight * 0.04,
    color: colors.black,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },
});

export default styles;
