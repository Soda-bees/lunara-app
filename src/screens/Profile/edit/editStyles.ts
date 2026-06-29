import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';
import { fontSize } from '../../../constants/fonts';
import { sizes } from '../../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingBottom: sizes.screenHeight * 0.08,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: fontSize.regular,
  },
  title: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 15,
  },
  label: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  helper: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    backgroundColor: '#F8FAFC',
  },
  unitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: '#fff',
  },
  unitPillActive: {
    borderColor: colors.maroonText,
    backgroundColor: '#F7DEE7',
  },
  unitPillText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.darkGrey,
  },
  unitPillTextActive: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
  },
  optionCard: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
  },
  optionCardSelected: {
    borderColor: colors.maroonText,
    backgroundColor: '#F7DEE7',
  },
  optionTitle: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  optionTitleSelected: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderColor,
    backgroundColor: '#fff',
  },
  chipSelected: {
    borderColor: colors.maroonText,
    backgroundColor: '#F7DEE7',
  },
  chipText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  chipTextSelected: {
    color: colors.maroonText,
    fontFamily: 'Inter-Medium',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  dateButtonText: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});

export default styles;
