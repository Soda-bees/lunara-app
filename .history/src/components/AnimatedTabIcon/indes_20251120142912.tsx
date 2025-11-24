import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface AnimatedTabIconProps {
  source: ImageSourcePropType;
  triggerAnimation: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  source,
  triggerAnimation,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (triggerAnimation) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 0.85,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [triggerAnimation]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <Image source={source} style={styles.icon} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});

// Optimization to avoid useless re-renders
export default React.memo(AnimatedTabIcon);
