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
    maxWidth: sizes.screenWidth * 0.8,
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },

  dateBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#F7DEE7',
  },

  dateBoxText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.maroonText,
  },
});

export default styles;
