import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme/theme';
import { sizes } from '../../constants/sizes';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  header: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    // fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  body: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  actions: {
    gap: spacing.sm,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
  },
  prettyLadyStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.5,
    height: sizes.screenWidth * 0.5,
    backgroundColor: 'red',
    alignSelf: 'center',
    marginTop: sizes.screenHeight * 0.15,
  },
  prettyLadyView: {
    // resizeMode: 'contain',
    width: sizes.screenWidth * 0.8,
    height: sizes.screenWidth * 0.8,
    // backgroundColor:'red',
    alignSelf: 'center',
    marginTop: sizes.screenHeight * 0.035,
  },
  bottomText: {
    fontSize: 12,
    color: colors.darkGrey,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  lottie: {
    height: sizes.screenHeight,
    width: sizes.screenWidth,
  },
});
export default styles;
