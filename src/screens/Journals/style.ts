import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize } from '../../constants/fonts';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: sizes.screenWidth * 0.01,
    flex: 1,
  },

  profileStyle: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.h5,
    color: colors.black,
  },

  clearTextStyle: {
    fontFamily: 'MP-Semibold',
    fontSize: fontSize.large,
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  list: {
    paddingVertical: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.heading,
  },
  iconWrapper: {
    marginRight: 12,
    marginTop: 5,
  },
  textWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    // fontWeight: '600',
    fontFamily: 'MP-Semibold',
    fontSize: 18,
    marginBottom: 4,
  },
  message: {
    fontFamily: 'HBG-Medium',
    color: colors.disabledText,
    fontSize: fontSize.regular,
  },

  tickStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  btnContainer: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: sizes.screenHeight * 0.06,
  },

  searchContainer: {
    width: sizes.screenWidth * 0.9,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: colors.heading,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: colors.white,
    gap: 8,
    alignSelf: 'center',
  },

  searchIcon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },

  searchInput: {
    flex: 1,
    fontFamily: 'HBG-Semibold',
    fontSize: fontSize.medium,
    color: colors.black,
  },

  dateContainer: {
    paddingHorizontal: 16,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    fontFamily: 'HBG-MediumIt',
    fontSize: 12,
    color: colors.black,
  },

  addJournalIconContainer: {
    position: 'absolute',
    bottom: 50,
    right: 16,
    borderRadius: 100,
  },
  addJournalIcon: {
    height: 70,
    width: 70,
    resizeMode: 'contain',
  },

  pinIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default styles;
