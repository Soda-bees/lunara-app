import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fontSize } from '../../constants/fonts';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  mainContainer: {
    padding: sizes.screenWidth * 0.01,
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
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 24,
  },

  list: {
    marginTop: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
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
    borderColor: '#FDCDDB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: colors.white,
    gap: 8,
    alignSelf: 'center',
  },

  searchIcon: {
    height: 20,
    width: 20,
  },

  searchInput: {
    flex: 1,
    fontFamily: 'HBG-Semibold',
    fontSize: fontSize.medium,
    color: colors.black,
  },

  dateContainer: {
    alignItems: 'flex-end',
  },

  dateText: {
    fontFamily: 'HBG-MediumIt',
    fontSize: 12,
    color: colors.black,
  },

  backButton: {},
  backIcon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },

  dots: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },

  body: {
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.screenWidth * 0.05,
    paddingVertical: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    flex: 1,
    marginBottom: 24,
    elevation: 10,
    shadowColor: colors.heading,
  },

  heading: {
    fontFamily: 'MP-Bold',
    fontSize: fontSize.h4,
    color: colors.black,
    marginBottom: 10,
  },

  note: {
    fontFamily: 'HBG-Regular',
    fontSize: 18,
    color: colors.disabledText,
  },

  dropDownContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 66,
    elevation: 2,
    right: 15,
  },

  dropDown: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    width: sizes.screenWidth * 0.25,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
    elevation: 10,
  },

  dropDownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  icon: {
    height: 18,
    width: 18,
    resizeMode: 'contain',
  },

  textBlack: {
    fontFamily: 'HBG-Regular',
    fontSize: 16,
    color: colors.black,
  },
});

export default styles;
