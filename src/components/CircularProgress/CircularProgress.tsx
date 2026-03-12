import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = '#F3F4F6',
  children,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Create rotation for the progress arc starting from top (-90deg)
  const rotation = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '270deg'],
  });

  // Determine opacity for left and right halves
  const leftHalfOpacity = animatedProgress.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const rightHalfOpacity = animatedProgress.interpolate({
    inputRange: [0, 0.5, 0.5, 1],
    outputRange: [0, 0, 1, 1],
  });

  // For right half, calculate rotation based on progress
  const rightHalfRotation = animatedProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '0deg', '180deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View
        style={[
          styles.backgroundCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: backgroundColor,
          },
        ]}
      />

      {/* Progress overlay */}
      <View
        style={[
          styles.progressContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        pointerEvents="none"
      >
        {/* Left half - visible for first 50% */}
        <Animated.View
          style={[
            styles.halfCircle,
            {
              width: size / 2,
              height: size,
              borderTopLeftRadius: size / 2,
              borderBottomLeftRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRightWidth: 0,
              opacity: leftHalfOpacity,
            },
          ]}
        />

        {/* Right half - visible for second 50% */}
        <Animated.View
          style={[
            styles.halfCircle,
            {
              width: size / 2,
              height: size,
              left: size / 2,
              borderTopRightRadius: size / 2,
              borderBottomRightRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderLeftWidth: 0,
              opacity: rightHalfOpacity,
              transform: [{ rotate: rightHalfRotation }],
            },
          ]}
        />

        {/* Mask to clip progress based on rotation */}
        <Animated.View
          style={[
            styles.maskContainer,
            {
              width: size,
              height: size,
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <View
            style={[
              styles.maskHalf,
              {
                width: size / 2,
                height: size,
                backgroundColor: '#FDFBF7', // Match background
              },
            ]}
          />
        </Animated.View>
      </View>

      {/* Center content */}
      <View style={[styles.centerContent]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    borderStyle: 'solid',
  },
  progressContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  maskContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  maskHalf: {
    position: 'absolute',
    left: '50%',
    top: 0,
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
