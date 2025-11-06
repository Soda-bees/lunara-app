import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { sizes } from '../constants/sizes';

export default function useSlideAnim(currentIndex: number) {
  const translateX = useRef(new Animated.Value(0)).current;
  const prevIndex = useRef(0);

  useEffect(() => {
    if (currentIndex !== prevIndex.current) {
      const direction = currentIndex > prevIndex.current ? 1 : -1;

      translateX.setValue(direction * sizes.screenWidth);

      Animated.spring(translateX, {
        toValue: 0,
        speed: 1,
        bounciness: 4,
        useNativeDriver: true,
      }).start();

      prevIndex.current = currentIndex;
    }
  }, [currentIndex]);

  return translateX;
}
