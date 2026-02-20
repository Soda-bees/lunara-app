import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: sizes.screenWidth * 0.05,
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
    marginBottom: 25,
  },

  phaseBody: {
    width: sizes.screenWidth * 0.9,
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowFull: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  numberTextMedium: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },

  risingMainView: {
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.05,
    backgroundColor: colors.lightOranger,
    borderColor: colors.heading,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    width: sizes.screenWidth * 0.42,
    marginTop: 5,
  },

  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    width: '100%',
  },

  icon: {
    width: 15,
    height: 15,
    tintColor: colors.heading,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginRight: 5,
    marginTop: 3,
  },

  movementIcon: {
    tintColor: colors.heading,
    alignSelf: 'flex-start',
    marginRight: 10,
    fontSize: 13,
  },

  dumbellsIcon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.1,
    height: sizes.screenHeight * 0.05,
  },

  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.green,
  },

  heading: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },

  cautionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  movementScienceView: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },

  mainHeading: {
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-Medium',
    color: colors.black,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontFamily: 'Inter-Regular',
  },
});

export default styles;
