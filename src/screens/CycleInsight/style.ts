import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
  },

  phaseBody: {
    width: sizes.screenWidth * 0.9,
    alignItems: 'flex-start',
    paddingHorizontal:10,
  },

  topContainer: {
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
  },

  rowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heading: {
    color: colors.heading,
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 22,
  },

  subHeading: {
    color: colors.green,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 20,
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  numberTextGradient: {
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-SemiBold',
    color: colors.heading,
  },

  numberTextMedium: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.darkGrey,
  },

  dayTextContainer: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: sizes.screenWidth * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderPink,
  },

  textDarkGrey: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Inter-Regular',
    width: '100%',
  },

  textBlackNormal: {
    fontSize: 14,
    color: colors.maroonText,
    fontFamily: 'Inter-SemiBold',
  },

  phasesView: {
    marginLeft: 8,
  },

  logButton: {
    backgroundColor: colors.heading,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 46,
    borderRadius: 16,
    marginVertical: 20,
  },

  dropImg: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
  },

  text: {
    fontSize: fontSize.medium,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 7,
  },

  pregnancyView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF5',
    borderColor: '#95E5B6',
    borderWidth: 1,
    borderRadius: sizes.screenWidth * 0.03,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },

  heartImageView: {
    borderWidth: 1,
    padding: 13,
    borderRadius: sizes.screenWidth * 0.1,
    borderColor: '#A6E9C2',
    backgroundColor: '#CDFFEA',
    alignSelf: 'flex-start',
  },

  phaseImageView: {
    padding: 13,
    borderRadius: sizes.screenWidth * 0.1,
    alignSelf: 'flex-start',
  },

  pregnanyHeartImage: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  pregnancyIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  pregnancyText: {
    color: colors.black,
    fontSize: 14,
    fontFamily: 'PlayfairDisplay-SemiBold',
    marginRight: 10,
  },

  lowTextView: {
    backgroundColor: '#CDFFEA',
    width: sizes.screenWidth * 0.15,
    borderRadius: sizes.screenWidth * 0.1,
    paddingVertical: 4,
    marginVertical: 7,
  },

  lowText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#3FCE91',
    textAlign: 'center',
  },

  trackSymptomsView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 18,
    justifyContent: 'space-between',
    borderRadius: sizes.screenWidth * 0.03,
  },

  trackActiveStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  trackText: {
    color: colors.black,
    fontSize: 18,
    fontFamily: 'PlayfairDisplay-SemiBold',
  },

  trackSubText: {
    color: colors.green,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },

  logNowView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: sizes.screenWidth * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.borderPink,
  },

  marginLeft: {
    marginLeft: 10,
  },

  weeklyUpdateMaincontainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: sizes.screenWidth * 0.03,
    padding: 18,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  calenderImage: {
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
    resizeMode: 'contain',
  },

  cycleText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 16,
    marginLeft: 8,
    color: colors.black,
  },

  listWrapper: {
    marginTop: 4,
  },

  weeklyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.04,
    height: sizes.screenWidth * 0.04,
  },

  textWrapper: {
    flex: 1,
  },

  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.black,
  },

  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.green,
    marginTop: 2,
  },

  ideaImage: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.11,
    height: sizes.screenWidth * 0.11,
  },

  infoText: {
    color: colors.black,
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 14,
  },

  infoSubText: {
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 5,
  },

  creditText: {
    color: colors.green,
    fontFamily: 'Inter-SemiBoldItalic',
    fontSize: 12,
    marginTop: 10,
  },

  journalStyle: {
    resizeMode: 'contain',
    width: sizes.screenWidth * 0.05,
    height: sizes.screenWidth * 0.05,
  },

  bottomEntryButton:{
    // borderWidth:1,
    paddingHorizontal:sizes.screenWidth * 0.1,
    paddingVertical:9,
    borderRadius:sizes.screenWidth * 0.03,
    marginTop:sizes.screenHeight * 0.02
  },

    bottomButtonView: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    // borderRadius: sizes.screenWidth * 0.03,
    // padding: 18,
  },

  buttonText:{
    color:colors.white,
    fontSize:16,
    fontFamily:'Inter-Medium'
  },
});

export default styles;
