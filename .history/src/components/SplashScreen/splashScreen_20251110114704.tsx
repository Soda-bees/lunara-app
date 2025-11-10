import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import { sizes } from '../../constants/sizes';

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  useEffect(() => {
    SplashScreen.hide();

    const timer = setTimeout(() => {
      onFinish();
    }, 400000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LottieView
        source={require('../../assets/animations/animatedSplashScreen.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDCDDB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lottie: {
    height: sizes.screenHeight,
    width: sizes.screenWidth,
    backgroundColor: '#FDCDDB',
  },
});

export default AnimatedSplash;
