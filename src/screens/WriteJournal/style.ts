import {StyleSheet} from 'react-native';
import {colors} from '../../constants/colors';
import {fontSize} from '../../constants/fonts';
import {sizes} from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: sizes.screenWidth * 0.01,
  },

  profileStyle: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.h5,
    color: colors.black,
  },

  clearTextStyle: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.large,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backArrow: {
    height: 28,
    width: 28,
    resizeMode: 'contain',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  icon: {
    height: sizes.screenWidth * 0.13,
    width: sizes.screenWidth * 0.13,
    resizeMode: 'contain',
  },

  btnContainer: {
    position: 'absolute',
    bottom: sizes.screenHeight * 0.06,
    alignSelf: 'center',
  },

  title: {
    // fontWeight: '600',
    fontFamily: 'MP-Semibold',
    fontSize: 18,
    marginBottom: 4,
  },
  message: {
    fontFamily: 'HBG-Medium',
    color: colors.disabledText,
    fontSize: fontSize.regular,
  },

  tickStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  titleInput: {
    fontFamily: 'MP-Bold',
    fontSize: fontSize.h5,
    fontWeight: '600',
    color: colors.black,
    marginTop: 20,
    marginBottom: 10,
  },

  notesInput: {
    fontSize: 16,
    color: colors.black,
    fontFamily: 'HBG-Medium',
    backgroundColor: '#FAF8F6',
    padding: 15,
    borderRadius: 12,
    minHeight: 200,
    maxHeight: 200,
  },
});

export default styles;
