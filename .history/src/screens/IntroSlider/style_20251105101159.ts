import { StyleSheet } from 'react-native';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {},
  flatList: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: sizes.screenWidth * 0.76,
    height: sizes.screenWidth * 0.76,
    resizeMode: 'contain',
    marginTop: sizes.screenWidth * 0.1,
  },
  textView: {
    alignSelf: 'center',
    position: 'absolute',
    top: sizes.screenHeight * 0.55,
  },
  title: {
    fontFamily: 'Playfair-Display-Bold',
    textAlign: 'center',
    fontSize: fontSize.h5,
    fontWeight: '500',
  },
  desc: {
    textAlign: 'center',
    maxWidth: sizes.screenWidth * 0.84,
    fontSize: 18,
    marginTop: 6,
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
  },
  lastView: { position: 'absolute', paddingBottom: sizes.screenHeight * 0.03 },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: sizes.screenWidth * 0.8,
    alignSelf: 'center',
    marginTop: sizes.screenHeight * 0.05,
    height: sizes.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: sizes.screenWidth * 0.06,
  },
  skipBtn: {
    position: 'absolute',
    right: sizes.screenWidth * 0.05,
    top: sizes.screenHeight * 0.03,
    zIndex: 99,
    padding: 10,
  },
  skipTxt: {
    fontSize: fontSize.regular,
    color: colors.textBlack,
  },
});

export default styles;
