import { StyleSheet } from 'react-native';
import { sizes } from '../../constants/sizes';
import { colors } from '../../constants/colors';

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
    marginBottom: 15,
  },

  ourStoryTopView: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    backgroundColor: colors.heading,
    width: sizes.screenWidth * 0.24,
    height: sizes.screenHeight * 0.035,
    borderRadius: sizes.screenWidth * 0.05,
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 15,
  },

  gradientMainView: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
  },

  movementMainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  feelingsIconStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
    marginRight: 5,
  },

  mainHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },

  myStory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.disabledText,
    marginTop: 10,
    lineHeight: 18,
  },

  visionBehindView: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
  },

  visionBehindBottomView: {
    backgroundColor: '#F4F4F4',
    borderRadius: sizes.screenWidth * 0.04,
    width: sizes.screenWidth * 0.83,
    padding: 15,
    marginTop: 10,
  },

  visionBehindBottomText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.disabledText,
  },

  timelineContainer: {
    marginTop: 10,
  },

  timelineRow: {
    flexDirection: 'row',
    marginBottom: 28,
  },

  iconColumn: {
    width: sizes.screenWidth * 0.12,
    alignItems: 'center',
    position: 'relative',
  },

  //   iconStyle: {
  //     width: 32,
  //     height: 32,
  //     resizeMode: 'contain',
  //     marginTop: 2,
  //   },

  imageMainView: {
    backgroundColor: colors.lightOranger,
    borderRadius: sizes.screenWidth * 0.1,
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

  verticalLine: {
    width: 2,
    height: sizes.screenHeight * 0.1,
    backgroundColor: '#DADADA',
    marginTop: 5,
  },

  textColumn: {
    flex: 1,
    paddingLeft: 12,
  },

  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginBottom: 6,
  },

  descText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    lineHeight: 18,
  },
});

export default styles;
