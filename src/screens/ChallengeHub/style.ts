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
    marginTop: 10,
  },

  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },

  challengeMainView: {
    backgroundColor: colors.white,
    // padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f2f2f2',
    marginTop: 16,
  },

  updateButtonGradient: {
    width: '100%',
    height: sizes.screenHeight * 0.17,
    borderTopRightRadius: 13,
    borderTopLeftRadius: 13,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  challengeName: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 24,
  },

  challengesubTitle: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },

  calenderImageStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
    tintColor: colors.disabledText,
    marginLeft: 13,
  },

  daysText: {
    color: colors.disabledText,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },

  flexRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  startChallenge: {
    marginTop: 20,
    alignSelf: 'center',
    width: sizes.screenWidth * 0.82,
    marginBottom:15
  },

  startChallengeGradient: {
    paddingVertical: 10,
    borderRadius: 12,
  },

  startChallengeText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});

export default styles;
