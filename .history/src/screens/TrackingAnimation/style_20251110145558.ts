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
    // top: '35%',
    // left: '35%',
  },

  microscopeImg: {
    width: sizes.screenWidth * 0.35,
    height: sizes.screenWidth * 0.35,
    resizeMode: 'contain',
  },
});

export default styles;
