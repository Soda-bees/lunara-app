import { StyleSheet } from 'react-native';
import { fontSize } from '../../../constants/fonts';
import { colors } from '../../../constants/colors';
import { sizes } from '../../../constants/sizes';

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
    alignItems: 'center',
  },

  forgotText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
    textAlign: 'center',
  },

  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    marginTop: 5,
  },

  mainHeading: {
    color: colors.green,
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    marginTop: 15,
  },

  featuresView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  imageMainView: {
    backgroundColor: colors.lightOranger,
    borderRadius: 10,
    width: sizes.screenWidth * 0.1,
    height: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageView: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  subHeading: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },

  arrowImage: {
    tintColor: colors.green,
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.03,
    height: sizes.screenWidth * 0.03,
  },

  phaseBody: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'center',
    flexDirection: 'row',
  },

  settingImageView: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.08,
    height: sizes.screenWidth * 0.08,
  },

  settingMainHeading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 16,
  },

  settingSubHeading: {
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },

  updateButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: sizes.screenWidth * 0.82,
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
});

export default styles;
