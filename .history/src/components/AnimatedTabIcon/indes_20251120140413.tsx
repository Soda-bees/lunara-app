import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from 'react-native';

interface AnimatedTabIconProps {
  source: ImageSourcePropType;
  onPress?: () => void;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({
  source,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const animate = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.8, // shrink
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1, // back to normal
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3, // fade out
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1, // fade back
          duration: 120,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <Pressable
      onPress={() => {
        animate();
        onPress && onPress();
      }}
    >
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Image source={source} style={styles.icon} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});

export default AnimatedTabIcon;
