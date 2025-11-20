import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet } from 'react-native';

interface AnimatedTabIconProps {
  source: ImageSourcePropType;
  focused: boolean;
  animateTrigger: boolean;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  source,
  focused,
  animateTrigger,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animateTrigger) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animateTrigger]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Image
        source={source}
        style={[styles.icon, { opacity: focused ? 1 : 1 }]}
      />
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
