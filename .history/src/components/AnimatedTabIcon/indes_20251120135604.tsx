import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface AnimatedTabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  source,
  focused,
}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.4,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: focused ? -4 : 0, // tiny lift, no bounce
        duration: 680,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
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

export default AnimatedTabIcon;
