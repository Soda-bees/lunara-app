import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Regular',
    color: colors.black,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  historyList: {
    gap: 16,
  },
  historyCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: sizes.screenWidth * 0.03,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyHeaderLeft: {
    flex: 1,
  },
  historyDay: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },
  phasePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F3D8EA',
    borderRadius: 20,
    marginLeft: 12,
  },
  phaseText: {
    color: '#8A4676',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  symptomKey: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    flex: 1,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  noteContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderColorLight,
  },
  noteText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBoldItalic',
    color: colors.green,
    fontStyle: 'italic',
  },
});

export default styles;
