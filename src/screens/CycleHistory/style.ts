import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.04,
  },
  statisticsCard: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  statisticsHeader: {
    marginBottom: 12,
  },
  statisticsTitle: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.black,
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statisticItem: {
    alignItems: 'center',
  },
  statisticValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statisticLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    textAlign: 'center',
  },
  dateRangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.02,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    backgroundColor: colors.white,
    borderRadius: sizes.screenWidth * 0.02,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  sortButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    textAlign: 'center',
  },
});

export default styles;

