import { StyleSheet } from 'react-native';
import { fontSize } from '../../../constants/fonts';
import { colors } from '../../../constants/colors';
import { sizes } from '../../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: sizes.screenWidth * 0.05,
  },

  mainContainer: {
    flex: 1,
  },

  forgotText: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-Medium',
    fontSize: 22,
    textAlign: 'center',
  },

  paraText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    textAlign: 'center',
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
  logMovementButton: {
    marginTop: 14,
    backgroundColor: colors.heading,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logMovementButtonText: {
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  dailyLogCard: {
    marginVertical: 12,
    borderRadius: 14,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    padding: 12,
    backgroundColor: colors.white,
  },
  dailyLogTitle: {
    color: colors.black,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  logTitle: {
    color: colors.black,
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  logMeta: {
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});

export default styles;
