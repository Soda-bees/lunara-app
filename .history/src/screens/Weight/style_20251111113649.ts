// import { StyleSheet } from 'react-native';
// import { fontSize } from '../../constants/fonts';
// import { colors } from '../../constants/colors';
// import { sizes } from '../../constants/sizes';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: sizes.screenWidth * 0.05,
//     backgroundColor: 'white',
//   },

//   mainContainer: {
//     flex: 1,
//   },

//   inputContainer: {
//     paddingVertical: 5,
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     alignItems: 'center',
//     paddingHorizontal: sizes.screenWidth * 0.03,
//     borderRadius: 16,
//     width: sizes.screenWidth * 0.9,
//     alignSelf: 'center',
//     borderWidth: 1,
//     borderColor: colors.borderColor,
//   },

//   input: {
//     fontFamily: 'Inter-Regular',
//     fontSize: fontSize.regular,
//     color: colors.disabledText,
//     width: sizes.screenWidth * 0.64,
//     marginLeft: 3,
//   },

//   inputIcon: {
//     height: 15,
//     width: 15,
//     resizeMode: 'contain',
//   },

//   emailIconStyle: {
//     resizeMode: 'contain',
//     width: sizes.screenWidth * 0.05,
//     height: sizes.screenWidth * 0.05,
//     // backgroundColor:'red'
//   },

//   textInput: {
//     marginLeft: 5,
//     width: sizes.screenWidth * 0.7,
//     fontSize: fontSize.smallM,
//     color: colors.black,
//     fontFamily: 'MP-Medium',

//     // backgroundColor:'red'
//   },

//   iconInputView: {
//     flexDirection: 'row',
//     backgroundColor: colors.white,
//     height: sizes.screenHeight * 0.07,
//     alignItems: 'center',
//     paddingHorizontal: sizes.screenWidth * 0.04,
//     borderRadius: sizes.screenWidth * 0.1,
//     width: sizes.screenWidth * 0.9,
//     marginVertical: 4,
//     borderWidth: 1,
//     borderColor: colors.inputBorderGray,
//     marginTop: sizes.screenHeight * 0.04,
//     color: colors.black,
//   },

//   bottomButton: {
//     position: 'absolute',
//     bottom: sizes.screenWidth * 0.05,
//     alignSelf: 'center',
//   },
// });

// export default styles;

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
  },

  heading: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.h4,
    fontWeight: '500',
    color: colors.black,
    marginTop: sizes.screenHeight * 0.02,
  },

  disabledText: {
    fontFamily: 'HBG-Medium',
    fontSize: fontSize.medium,
    color: colors.disabledText,
    marginBottom: sizes.screenHeight * 0.03,
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
    borderRadius: 26,
    alignSelf: 'center',
  },

  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },

  unitToggle: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
  },

  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 35,
    backgroundColor: '#eee',
  },

  activeToggle: {
    backgroundColor: colors.primary,
  },

  activeText: {
    color: '#fff',
    fontFamily: 'MP-Medium',
  },

  inactiveText: {
    color: '#333',
    fontFamily: 'MP-Medium',
  },

  value: {
    fontSize: 40,
    marginBottom: 15,
    marginTop: sizes.screenHeight * 0.06,
    fontFamily: 'MP-Bold',
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
    backgroundColor: 'gray',
  },

  halfFootTick: {
    height: 60,
    backgroundColor: '#FF70A6',
    width: sizes.screenWidth * 0.007,
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
    width: sizes.screenWidth * 0.07,
    marginLeft: 7,
  },

  centerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'black',
    left: width / 2.3,
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
    marginTop: -10,
    textAlignVertical: 'top',
    fontFamily: 'MP-Medium',
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EED9B3',
    borderRadius: 40,
    overflow: 'hidden',
  },

  btn: {
    width: sizes.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    backgroundColor: 'white',
    borderRadius: 50,
  },

  btnSelected: {
    width: sizes.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },

  btnTextSelected: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.white,
  },

  btnText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.black,
  },
});

export default styles;
