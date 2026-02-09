// import React, { useEffect } from 'react';
// import { View, StyleSheet, StatusBar } from 'react-native';
// import LottieView from 'lottie-react-native';
// import SplashScreen from 'react-native-splash-screen';
// import { sizes } from '../../constants/sizes';

// interface AnimatedSplashProps {
//   onFinish: () => void;
// }

// const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
//   useEffect(() => {
//     SplashScreen.hide();

//     const timer = setTimeout(() => {
//       onFinish();
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, [onFinish]);

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle="dark-content"
//         hidden
//       />
//       <LottieView
//         source={require('../../assets/animations/animatedSplashScreenNew.json')}
//         autoPlay
//         loop={false}
//         style={styles.lottie}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: '#FDCDDB',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   lottie: {
//     height: sizes.screenHeight,
//     width: sizes.screenWidth,
//   },
// });

// export default AnimatedSplash;

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';
import SplashScreen from 'react-native-splash-screen';
import { sizes } from '../../constants/sizes';
import { useCycleData } from '../../context/CycleDataContext';
import { useSleepData } from '../../context/SleepDataContext';

interface AnimatedSplashProps {
  onFinish: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const { refreshCycleData } = useCycleData();
  const { refreshSleepData } = useSleepData();
  const [videoEnded, setVideoEnded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const hasCalledOnFinish = useRef(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  // Preload data when component mounts (non-blocking)
  useEffect(() => {
    // Start both data loads in parallel, but don't wait for them
    Promise.all([
      refreshCycleData({ force: true }).catch(err => {
        console.error('Error preloading cycle data:', err);
      }),
      refreshSleepData({ force: true }).catch(err => {
        console.error('Error preloading sleep data:', err);
      }),
    ]).finally(() => {
      setDataLoaded(true);
    });
  }, [refreshCycleData, refreshSleepData]);

  // Absolute maximum timeout - always proceed after 6 seconds no matter what
  useEffect(() => {
    const maxTimeout = setTimeout(() => {
      console.log('Splash screen maximum timeout reached - proceeding to app');
      if (!hasCalledOnFinish.current) {
        hasCalledOnFinish.current = true;
        onFinish();
      }
    }, 6000); // 6 second absolute maximum

    return () => clearTimeout(maxTimeout);
  }, [onFinish]);

  // Proceed when video ends (wait max 1 second for data if not loaded)
  useEffect(() => {
    if (hasCalledOnFinish.current || !videoEnded) return;

    if (dataLoaded) {
      // Data already loaded, proceed immediately
      hasCalledOnFinish.current = true;
      onFinish();
    } else {
      // Video ended but data not loaded, wait max 1 second
      const waitForData = setTimeout(() => {
        if (!hasCalledOnFinish.current) {
          hasCalledOnFinish.current = true;
          onFinish();
        }
      }, 1000);

      return () => clearTimeout(waitForData);
    }
  }, [videoEnded, dataLoaded, onFinish]);

  // Proceed when data loads (if video has ended)
  useEffect(() => {
    if (hasCalledOnFinish.current || !dataLoaded || !videoEnded) return;

    hasCalledOnFinish.current = true;
    onFinish();
  }, [videoEnded, dataLoaded, onFinish]);

  const handleVideoEnd = () => {
    console.log('Video ended');
    setVideoEnded(true);
  };

  // Fallback: If video doesn't end after 8 seconds, assume it's done
  useEffect(() => {
    const videoTimeout = setTimeout(() => {
      if (!videoEnded) {
        console.log('Video timeout - assuming video ended');
        setVideoEnded(true);
      }
    }, 8000); // 8 second max for video

    return () => clearTimeout(videoTimeout);
  }, [videoEnded]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
        hidden
      />

      <Video
        source={require('../../assets/animations/animatedSplashScreen.mp4')}
        style={styles.video}
        resizeMode="cover"
        muted
        repeat={false}
        onEnd={handleVideoEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDCDDB', // fallback color
  },
  video: {
    width: sizes.screenWidth,
    height: sizes.screenHeight,
  },
});

export default AnimatedSplash;
