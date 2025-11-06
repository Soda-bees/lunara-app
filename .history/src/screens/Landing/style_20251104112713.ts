import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  topCart: {
    position: 'absolute',
    backgroundColor: '#FDF9FD',
    borderWidth: 1,
    borderRadius: sizes.screenHeight * 0.04,
    borderColor: colors.white,
    width: sizes.screenWidth * 0.8,
    height: sizes.screenHeight * 0.18,
    zIndex: 0,
  },

  mainCart: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: sizes.screenHeight * 0.04,
    borderColor: colors.white,
    width: sizes.screenWidth * 0.9,
    paddingVertical: sizes.screenHeight * 0.03,
    marginTop: sizes.screenHeight * 0.025,
    zIndex: 1,
  },

  heading: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.h5,
    fontWeight: '500',
    color: colors.black,
    marginTop: 20,
  },

  disabledText: {
    fontFamily: 'HBG-Medium',
    fontSize: fontSize.medium,
    color: colors.disabledText,
    marginBottom: sizes.screenHeight * 0.03,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: sizes.screenWidth * 0.8,
    justifyContent: 'center',
    height: sizes.screenHeight * 0.07,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.06,
    marginBottom: sizes.screenHeight * 0.015,
  },

  buttonIcon: {
    height: sizes.screenHeight * 0.03,
    width: sizes.screenHeight * 0.03,
    resizeMode: 'contain',
    marginRight: sizes.screenWidth * 0.04,
  },

  textBlack: {
    fontFamily: 'HBG-Bold',
    fontSize: fontSize.regular,
    color: colors.black,
  },

  verticalLine: {
    height: sizes.screenHeight * 0.002,
    width: sizes.screenWidth * 0.8,
    backgroundColor: colors.lineGray,
    marginVertical: sizes.screenHeight * 0.05,
  },

  buttonContainer: {
    gap: sizes.screenHeight * 0.01,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes.screenHeight * 0.05,
    justifyContent: 'center',
  },

  textBlackSmall: {
    fontFamily: 'MP-Bold',
    fontSize: fontSize.medium,
    color: colors.black,
  },

  dot: {
    height: 6,
    width: 6,
    borderRadius: 8,
    backgroundColor: '#cdcdcd',
    marginHorizontal: sizes.screenWidth * 0.03,
  },

  textView: {
    marginLeft: 15,
  },

  impImg: {
    width: sizes.screenWidth * 0.7,
    height: sizes.screenWidth * 0.7,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
});

export default styles;
