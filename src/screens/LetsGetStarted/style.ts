import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../constants/theme/theme';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'white',
  },

  header: {
    gap: spacing.sm,
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: spacing.xl,
  },

  title: {
    fontSize: 24,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },

  body: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    marginTop: 10,
  },

  prettyLadyStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.5,
    height: sizes.screenWidth * 0.5,
    alignSelf: 'center',
    marginTop: sizes.screenHeight * 0.165,
  },

  selfCenter: {
    alignSelf: 'center',
    marginTop:10
  },

  actions: {
    // gap: spacing.sm,
    marginBottom: sizes.screenHeight * 0.03,
  },
});

export default styles;
