import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default function SliderDot({ active }: { active: boolean }) {
  const animatedWidth = useRef(new Animated.Value(active ? 24 : 8)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: active ? 24 : 8,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [active]);

  return (
    <Animated.View style={[styles.dot, { width: animatedWidth }]}>
      {active ? (
        <LinearGradient
          colors={['#FF70A6', '#B388EB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      ) : (
        <Animated.View
          style={[styles.gradient, { backgroundColor: '#C8C8C8' }]}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    overflow: 'hidden', // important so gradient respects border radius
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    borderRadius: 4,
  },
});
