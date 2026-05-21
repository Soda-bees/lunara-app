import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGrey,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerBlock: {
    marginBottom: 12,
  },
  progressCardWrap: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 4,
  },
  weekLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 14,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: colors.black,
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F6F6F6',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.heading,
    minWidth: 0,
  },
  progressFillDynamic: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  progressFillRemainder: {
    height: 6,
    minWidth: 0,
  },
  toolsCard: {
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 12,
    backgroundColor: '#FFF8EB',
    padding: 14,
    marginBottom: 16,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: colors.heading,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 64,
    alignItems: 'center',
  },
  addBtnText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  regenBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  regenBtnText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  listCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderColor,
    overflow: 'hidden',
  },
  listContent: {
    paddingVertical: 4,
    flexGrow: 1,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginHorizontal: 14,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 40,
    height: 40,
    tintColor: colors.heading,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyRegenBtn: {
    borderWidth: 1,
    borderColor: colors.heading,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF8EB',
  },
  emptyRegenText: {
    color: colors.heading,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  planCtaWrap: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  itemMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    marginRight: 12,
    resizeMode: 'contain',
  },
  itemTextBlock: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  itemTextDone: {
    textDecorationLine: 'line-through',
    color: colors.green,
  },
  itemMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
    marginTop: 2,
  },
  sourceBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#F6F6F6',
  },
  sourceBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: colors.darkGrey,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 18,
    height: 18,
    tintColor: colors.darkGrey,
    resizeMode: 'contain',
  },
});

export default styles;
