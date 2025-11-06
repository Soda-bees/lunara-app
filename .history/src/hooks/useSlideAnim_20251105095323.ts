import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

export default function useSlideAnim(currentIndex: number) {
  const { width } = Dimensions.get('window');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slideAnim.setValue(width);
    Animated.spring(slideAnim, {
      toValue: 0,
      speed: 1,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  return slideAnim;
}
