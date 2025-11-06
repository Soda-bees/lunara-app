import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.05,
  },
  // container: {
  //     left: -sizes.screenWidth * 0.04,
  //     backgroundColor: 'rgba(255, 255, 255, 0.7)',
  //     zIndex: 9999,
  //     elevation: 9999,
  // },
  flatList: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: sizes.screenWidth * 0.8,
    height: sizes.screenWidth * 0.8,
    resizeMode: 'contain',
    marginTop: sizes.screenHeight * 0.12,
  },
  textView: {
    alignSelf: 'center',
    position: 'absolute',
    top: sizes.screenHeight * 0.55,
  },
  title: { textAlign: 'center', fontSize: fontSize.h5, fontWeight: '500' },
  desc: {
    textAlign: 'center',
    width: sizes.screenWidth * 0.9,
    fontSize: fontSize.regular,
    marginTop: 6,
    color: colors.disabledText,
  },
  lastView: { position: 'absolute', paddingBottom: sizes.screenHeight * 0.03 },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: sizes.screenWidth * 0.8,
    alignSelf: 'center',
    marginTop: sizes.screenHeight * 0.05,
    height: sizes.screenWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: sizes.screenWidth * 0.06,
  },
});

export default styles;
