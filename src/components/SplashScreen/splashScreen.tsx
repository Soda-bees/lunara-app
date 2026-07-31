import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Video from 'react-native-video';
import SplashScreen from 'react-native-splash-screen';
import { sizes } from '../../constants/sizes';
import { useCycleData } from '../../context/CycleDataContext';
import { useSleepData } from '../../context/SleepDataContext';
import {
  resolveSessionRoute,
  resolveSessionRouteFallback,
  type SessionRoute,
} from '../../utils/resolveSessionRoute';

interface AnimatedSplashProps {
  /** Called when splash video + preloads are done; route is where navigation should start. */
  onFinish: (initialRoute: SessionRoute) => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
  const { refreshCycleData } = useCycleData();
  const { refreshSleepData } = useSleepData();
  const [videoEnded, setVideoEnded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sessionResolved, setSessionResolved] = useState(false);
  const sessionRouteRef = useRef<SessionRoute>(null);
  const hasCalledOnFinish = useRef(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    resolveSessionRoute()
      .then(route => {
        sessionRouteRef.current = route;
      })
      .catch(async () => {
        sessionRouteRef.current = await resolveSessionRouteFallback();
      })
      .finally(() => {
        setSessionResolved(true);
      });
  }, []);

  // Bootstrap (MOB-016): preload without force so STALE_TIME_MS / in-flight
  // dedupe in CycleDataContext & SleepDataContext skip a duplicate analytics pack
  // when providers already refreshed (or are refreshing) on mount.
  useEffect(() => {
    Promise.all([
      refreshCycleData().catch(err => {
        console.error('Error preloading cycle data:', err);
      }),
      refreshSleepData().catch(err => {
        console.error('Error preloading sleep data:', err);
      }),
    ]).finally(() => {
      setDataLoaded(true);
    });
  }, [refreshCycleData, refreshSleepData]);

  const tryFinish = useCallback(() => {
    if (
      hasCalledOnFinish.current ||
      !videoEnded ||
      !dataLoaded ||
      !sessionResolved
    ) {
      return;
    }
    hasCalledOnFinish.current = true;
    onFinish(sessionRouteRef.current);
  }, [videoEnded, dataLoaded, sessionResolved, onFinish]);

  useEffect(() => {
    const maxTimeout = setTimeout(async () => {
      if (hasCalledOnFinish.current) return;
      hasCalledOnFinish.current = true;
      const route = sessionRouteRef.current ?? (await resolveSessionRouteFallback());
      onFinish(route);
    }, 6000);

    return () => clearTimeout(maxTimeout);
  }, [onFinish]);

  useEffect(() => {
    tryFinish();
  }, [tryFinish]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  useEffect(() => {
    const videoTimeout = setTimeout(() => {
      if (!videoEnded) {
        setVideoEnded(true);
      }
    }, 8000);

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
    backgroundColor: '#FDCDDB',
  },
  video: {
    width: sizes.screenWidth,
    height: sizes.screenHeight,
  },
});

export default AnimatedSplash;
