import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  phaseBody: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },
  spacedText: {
    fontSize: 12,
    color: colors.green,
    fontFamily: 'Inter-Light-BETA',
    letterSpacing: 3,
    marginBottom: 8,
  },
  cyclePhaseCard: {
    width: sizes.screenWidth * 0.82,
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  numberTextMedium: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },
  dayTextContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderPink,
  },
  textBlackNormal: {
    fontSize: 14,
    color: colors.maroonText,
    fontFamily: 'Inter-SemiBold',
  },
  progressIndicator: {
    width: '100%',
    height: 8,
    backgroundColor: colors.borderColor,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progress: {
    height: '100%',
    borderRadius: 4,
  },
  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
  babySizeText: {
    fontSize: 18,
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginBottom: 8,
  },
  insightItem: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: '#FFF4E6',
    borderWidth: 1,
    borderColor: '#FFD699',
  },
  warningTitle: {
    color: '#D97706',
  },
  warningItem: {
    fontSize: 12,
    color: '#D97706',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    lineHeight: 18,
  },
  actionsContainer: {
    width: sizes.screenWidth * 0.82,
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: colors.heading,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.heading,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButtonText: {
    color: colors.heading,
  },
});

export default styles;


