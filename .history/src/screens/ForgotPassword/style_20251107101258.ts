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

  forgotText: {
    fontSize: fontSize.h4,
    fontFamily: 'MP-Semibold',
    marginTop: sizes.screenHeight * 0.02,
  },

  paraText: {
    color: colors.disabledText,
    // width: sizes.screenWidth * 0.8,
    fontSize: fontSize.medium,
    marginTop: sizes.screenHeight * 0.01,
    fontFamily: 'HBG-Medium',
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
