import { StyleSheet } from 'react-native';
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

  flexRowContainer: {
    flexDirection: 'row',
    // alignItems:'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    // backgroundColor:'red'
  },

  challengeText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  daysText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
  },

  completionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.disabledText,
    marginLeft: 20,
    marginTop: 5,
  },

  phaseProgressBarBackground: {
    width: '95%',
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    marginTop: 20,
  },

  phaseProgress: {
    height: 4,
    borderRadius: 8,
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 4,
    marginTop: 20,
  },
});

export default styles;
