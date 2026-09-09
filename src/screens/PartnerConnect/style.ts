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
  textContainer: {
    marginTop: sizes.screenHeight * 0.05,
    marginBottom: sizes.screenHeight * 0.04,
  },
  title: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
  },
  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.disabledText,
    marginTop: 6,
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.disabledText,
    marginBottom: 4,
  },
  statusValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.heading,
  },
  codeBox: {
    backgroundColor: '#F8F4EE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    letterSpacing: 2,
    color: colors.heading,
  },
  codeHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.disabledText,
    textAlign: 'center',
    marginTop: 8,
  },
  actionRow: {
    marginTop: 12,
    gap: 10,
  },
  bottomButton: {
    marginTop: 'auto',
    paddingBottom: sizes.screenHeight * 0.02,
  },
  inputContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sizes.screenWidth * 0.04,
    borderRadius: 16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginTop: 24,
    minHeight: 52,
  },
  inputPlaceholder: {
    position: 'absolute',
    left: sizes.screenWidth * 0.04,
    right: sizes.screenWidth * 0.04,
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    letterSpacing: 2,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: colors.heading,
    letterSpacing: 2,
    textAlign: 'center',
    minWidth: 12,
    paddingVertical: 10,
  },
});

export default styles;
