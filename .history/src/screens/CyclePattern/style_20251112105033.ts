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
    // marginBottom: sizes.screenHeight * 0.08,
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
    marginTop: sizes.screenHeight * 0.1,
  },

  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: sizes.screenWidth * 0.9,
  },

  selectedText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },

  toggleButton: {
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },

  selectedButton: {
    backgroundColor: colors.heading,
    borderRadius: 100,
  },

  toggleText: {
    color: '#000',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },

  inputWrapper: {
    height: sizes.screenHeight * 0.07,
    width: sizes.screenWidth * 0.9,
    marginTop: 16,
  },

  inputContainer: {
    borderColor: colors.inputBorderGrey,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: sizes.screenHeight * 0.07,
    paddingHorizontal: sizes.screenWidth * 0.04,
    borderRadius: 16,
    borderWidth: 1,
  },

  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: sizes.screenHeight * 0.07,
  },

  inputBoxEditable: {
    fontSize: 18,
    color: colors.black,
    fontFamily: 'Inter-Medium',
    width: sizes.screenWidth * 0.3,
  },

  separator: {
    width: sizes.screenWidth * 0.03,
    height: 3,
    backgroundColor: colors.black,
    marginVertical: 'auto',
    marginHorizontal: 10,
  },
});

export default styles;
