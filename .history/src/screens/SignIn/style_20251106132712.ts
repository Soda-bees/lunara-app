import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
  },

  mainCart: {
    marginTop: sizes.screenHeight * 0.1,
  },

  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
  },

  disabledText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.disabledText,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: sizes.screenHeight * 0.07,
    width: sizes.screenHeight * 0.07,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenHeight * 0.1,
  },

  buttonIcon: {
    height: sizes.screenHeight * 0.032,
    width: sizes.screenHeight * 0.032,
    resizeMode: 'contain',
  },

  textBlack: {
    fontFamily: 'MP-Bold',
    fontSize: fontSize.medium,
    color: colors.black,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },

  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.screenHeight * 0.01,
    marginTop: sizes.screenHeight * 0.05,
    alignSelf: 'center',
  },

  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: sizes.screenHeight * 0.02,
  },

  row4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: sizes.screenHeight * 0.04,
    width: sizes.screenWidth * 0.86,
    alignSelf: 'center',
  },

  hr: {
    height: 2,
    backgroundColor: '#D3D3D3',
    width: sizes.screenWidth * 0.25,
  },

  inputContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.04,
    borderRadius: sizes.screenWidth * 0.16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,

    borderColor: colors.borderColor,
  },

  input: {
    fontFamily: 'MP-Medium',
    fontSize: fontSize.regular,
    color: colors.disabledText,
    width: sizes.screenWidth * 0.64,
    marginLeft: 3,
  },

  inputIcon: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
  },

  showHideContainer: {
    position: 'absolute',
    right: sizes.screenWidth * 0.04,
  },

  hideIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },

  forgotPassContainer: {
    alignSelf: 'flex-end',
    marginTop: sizes.screenHeight * 0.014,
  },

  textBlackSmall: {
    fontFamily: 'MP-Medium',
    fontSize: fontSize.regular,
    color: colors.black,
  },

  underlineText: {
    fontFamily: 'MP-Bold',
    fontSize: fontSize.large,
    textDecorationLine: 'underline',
    color: 'transparent',
  },

  logoFull: {
    width: 134,
    height: 40,
    resizeMode: 'contain',
  },
});

export default styles;
