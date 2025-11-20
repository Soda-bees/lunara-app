import { Dimensions, StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
const { width } = Dimensions.get('window');
const ITEM_WIDTH = 20;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 7;

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
    justifyContent: 'center',
    height: sizes.screenHeight * 0.63,
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
    fontFamily: 'Inter-Medium',
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
    width: sizes.screenWidth * 0.2,
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

  centerHighlight: {
    position: 'absolute',
    top: (ITEM_HEIGHT * VISIBLE_ITEMS) / 2 - ITEM_HEIGHT / 2,
    height: ITEM_HEIGHT * 1,
    width: SCREEN_WIDTH * 0.4,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.heading,
    zIndex: 1,
    alignSelf: 'center',
    // backgroundColor: 'rgba(255,255,255,0.7)', // optional
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: sizes.screenWidth,
    paddingRight: ITEM_HEIGHT * 0.3,
  },

  selectedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    // justifyContent:'flex-start',
    // backgroundColor:'red',
    width: sizes.screenWidth * 0.35,
  },

  daysLabel: {
    fontSize: 16,
    color: colors.black,
    fontFamily: 'Inter-Medium',
    position: 'absolute',
    left: 10,
    // marginRight:sizes.screenWidth * 0.05
  },

  selectedText: {
    fontSize: 36,
    color: '#000',
    fontFamily: 'MP-Bold',
    textAlign: 'center',
  },

  itemText: {
    fontSize: 23,
    color: '#999',
    fontFamily: 'MP-Medium',
    textAlign: 'center',
  },
});

export default styles;
