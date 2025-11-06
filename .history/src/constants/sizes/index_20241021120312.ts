import {Dimensions, Platform, StatusBar} from 'react-native';

const {width, height} = Dimensions.get('window');

const totalSize = (percentage: number): number => {
  const smallerDimension = width < height ? width : height;
  return (percentage / 100) * smallerDimension;
};

const statusBarHeight = Platform.select({
  ios: height * 0.05,
  android: StatusBar.currentHeight,
});

const headerHeight = Platform.select({
  ios: height * 0.08,
  android: height * 0.1,
});

const tabBarHeight = Platform.select({
  ios: height * 0.07,
  android: height * 0.07,
});

// Sizes object with type annotations
const sizes: {
  marginBottom: number;
  marginTop: number;
  marginHorizontal: number;
  marginVertical: number;
  TinyMargin: number;
  smallMargin: number;
  baseMargin: number;
  doubleBaseMargin: number;
  horizontalLineHeight: number;
  screenWidth: number;
  screenHeight: number;
  buttonRadius: number;
  modalRadius: number;
  cardRadius: number;
  inputRadius: number;
  wrapperRadius: number;
  icons: {
    xxlSmall: number;
    extraSmall: number;
    tiny: number;
    small: number;
    medium: number;
    large: number;
    xl: number;
    xxl: number;
  };
  images: {
    small: number;
    medium: number;
    large: number;
    logo: number;
  };
} = {
  marginBottom: height * 0.025,
  marginTop: height * 0.025,
  marginHorizontal: width * 0.05,
  marginVertical: height * 0.025,
  TinyMargin: totalSize(0.5),
  smallMargin: totalSize(1),
  baseMargin: totalSize(2),
  doubleBaseMargin: totalSize(5),

  horizontalLineHeight: 1,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  buttonRadius: 100,
  modalRadius: 15,
  cardRadius: 15,
  inputRadius: 15,
  wrapperRadius: 25,

  icons: {
    xxlSmall: totalSize(0.5),
    extraSmall: totalSize(1),
    tiny: totalSize(1.5),
    small: totalSize(2),
    medium: totalSize(2.5),
    large: totalSize(3),
    xl: totalSize(4),
    xxl: totalSize(5),
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 100,
  },
};

export {sizes};
