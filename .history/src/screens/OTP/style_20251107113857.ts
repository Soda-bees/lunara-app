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
    fontSize: 16,
    color: colors.disabledText,
    marginTop: 6,
  },

  inputContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.04,
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

  codeFieldRoot: {
    width: sizes.screenWidth * 0.85,
    alignSelf: 'center',
  },
  cell: {
    backgroundColor: colors.white,
    fontFamily: 'MP-Medium',
    width: sizes.screenWidth * 0.18,
    fontSize: fontSize.h4,
    textAlign: 'center',
    color: colors.black,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: colors.borderColor,
    borderWidth: 1,
    paddingVertical: 8,
  },
  cellIOS: {
    backgroundColor: colors.white,
    fontFamily: 'MP-Medium',
    width: sizes.screenWidth * 0.16,
    height: sizes.screenHeight * 0.08,
    lineHeight: sizes.screenHeight * 0.08,
    fontSize: fontSize.h4,
    textAlign: 'center',
    color: colors.black,
    borderRadius: sizes.screenWidth * 0.1,
    overflow: 'hidden',
    borderColor: colors.borderColor,
    borderWidth: 1,
  },

  focusCell: {
    // backgroundColor: colors.inputGrey,
    borderColor: colors.borderColorLight,
    borderWidth: 1,
  },
});

export default styles;
