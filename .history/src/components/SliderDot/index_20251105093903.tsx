// components/SliderDot.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type Props = {
  active: boolean;
};

export default function SliderDot({ active }: Props) {
  const animatedWidth = useRef(new Animated.Value(active ? 24 : 8)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: active ? 24 : 8,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [active]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: animatedWidth,
          backgroundColor: active ? '#000' : '#C4C4C4',
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
