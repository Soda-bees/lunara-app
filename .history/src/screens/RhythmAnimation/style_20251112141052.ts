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
    alignItems: 'center',
    paddingTop: sizes.screenHeight * 0.18,
  },

  resetSuccess: {
    height: sizes.screenHeight * 0.28,
    width: sizes.screenHeight * 0.28,
    resizeMode: 'contain',
  },

  textContainer: {
    marginTop: sizes.screenHeight * 0.05,
    marginBottom: sizes.screenHeight * 0.08,
    alignItems: 'center',
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
    textAlign: 'center',
    maxWidth: sizes.screenWidth * 0.7,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },

  microscopePivot: {
    position: 'absolute',
    top: sizes.screenHeight * 0.28,
    left: sizes.screenWidth * 0.28,
  },

  microscopeImg: {
    width: sizes.screenWidth * 0.35,
    height: sizes.screenWidth * 0.35,
    resizeMode: 'contain',
  },

  heading: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
    textAlign: 'center',
    fontSize: 18,
  },

  centerText: {
    color: colors.primary,
    textAlign: 'center',
    width: sizes.screenWidth * 0.8,
    alignSelf: 'center',
    fontSize: fontSize.medium,
    fontFamily: 'Inter-Medium',
  },

  circleContainer: {
    width: sizes.screenWidth * 0.65,
    height: sizes.screenWidth * 0.65,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  staticImage: {
    width: sizes.screenWidth * 0.65,
    height: sizes.screenWidth * 0.65,
    position: 'absolute',
  },
  rotatingLayer: {
    position: 'absolute',
    width: sizes.screenWidth * 0.65,
    height: sizes.screenWidth * 0.65,
  },
  icon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.15,
    height: sizes.screenWidth * 0.15,
    position: 'absolute',
  },
});

export default styles;
