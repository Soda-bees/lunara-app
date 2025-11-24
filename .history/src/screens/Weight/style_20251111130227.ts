import { Dimensions, StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20;
const VISIBLE_ITEMS = Math.floor(width / ITEM_WIDTH);
const TOTAL_INCHES = 96;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
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
    maxWidth: sizes.screenWidth * 0.7,
  },

  mainContainer: {
    flex: 1,
  },

  numberSLiderContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    width: sizes.screenWidth * 0.9,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 20,
    alignSelf: 'center',
  },

  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },

  value: {
    fontSize: 40,
    marginBottom: 15,
    marginTop: sizes.screenHeight * 0.06,
    fontFamily: 'Inter-SemiBold',
  },

  rulerContainer: {
    height: sizes.screenHeight * 0.1,
    paddingHorizontal: 10,
  },

  tickContainer: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  tick: {
    width: 2,
    height: 35,
    backgroundColor: '#D4D4D4',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },

  halfFootTick: {
    height: 60,
    backgroundColor: '#E4AF5D',
    width: 4,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },

  footTick: {
    height: 40,
    backgroundColor: 'red',
  },

  tickLabel: {
    fontSize: fontSize.medium,
    marginTop: 2,
    color: colors.disabledText,
    fontFamily: 'MP-Medium',
    maxWidth: sizes.screenWidth * 0.1,
    marginLeft: 7,
    backgroundColor: 'red',
    textAlign: 'center',
  },

  heightView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: sizes.screenWidth * 0.9,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 17,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },

  unit: {
    fontSize: 18,
    fontWeight: '400',
    color: '#555',
    textAlignVertical: 'top',
    fontFamily: 'Inter-Medium',
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },

  btnSelected: {
    width: sizes.screenWidth * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    backgroundColor: colors.heading,
    borderRadius: 50,
  },

  btn: {
    width: sizes.screenWidth * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },

  btnText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.black,
  },
});

export default styles;
