import { StyleSheet } from 'react-native';
import { fontSize } from '../../constants/fonts';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

const SIZE = sizes.screenWidth * 0.45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
    backgroundColor: 'white',
  },

  mainContainer: {
    flex: 1,
  },

  outerContainer: {
    width: SIZE + 20,
    height: SIZE + 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingBorder: {
    position: 'absolute',
    width: SIZE + 20,
    height: SIZE + 20,
    borderRadius: 200,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#A1CBD4',
  },
  imageView: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  images: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  imageText: {
    marginTop: 9,
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  line: {
    height: 1,
    width: sizes.screenWidth * 0.35,
    backgroundColor: '#CCCCCC',
    marginTop: 5,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: fontSize.large,
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
  },
  openCameraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  cameraIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  cameraText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },

  inputContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.03,
    borderRadius: 16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
  },

  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.disabledText,
    width: sizes.screenWidth * 0.64,
    marginLeft: 3,
  },

  namePlaceholder: {
    color: colors.disabledText,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 5,
  },

  nameBirthdayView: {
    marginTop: sizes.screenHeight * 0.06,
    // flex:1
  },

  birthdayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingHorizontal: sizes.screenWidth * 0.03,
    borderRadius: 16,
    width: sizes.screenWidth * 0.9,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: 16,
    marginTop:10
  },

  profileproIconStyle: {
    resizeMode: 'contain',
    height: 17,
    width: 17,
    marginLeft: 4,
    marginRight: 3,
  },

  dateText: {
    marginLeft: 10,
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },

  bottomButton: {
    position: 'absolute',
    bottom: sizes.screenWidth * 0.05,
    alignSelf: 'center',
  },
});

export default styles;
