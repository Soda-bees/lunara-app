import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Pressable,
} from 'react-native';

interface AnimatedTabIconProps {
  source: ImageSourcePropType;
}

const AnimatedTabIcon: React.FC<AnimatedTabIconProps> = ({ source }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={{ opacity, transform: [{ translateY }] }}>
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
