import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CircularProgressProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  gradientColors?: string[]; // Optional gradient colors [startColor, endColor]
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = '#F3F4F6',
  gradientColors,
  children,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);

  // Calculate circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: Math.min(Math.max(progress, 0), 1),
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // strokeDashoffset doesn't support native driver
    }).start();
  }, [progress, animatedProgress]);

  // Update strokeDashoffset based on animated progress
  useEffect(() => {
    const listener = animatedProgress.addListener(({ value }) => {
      setStrokeDashoffset(circumference * (1 - value));
    });
    return () => {
      animatedProgress.removeListener(listener);
    };
  }, [animatedProgress, circumference]);

  // Use gradient if provided, otherwise use solid color
  const useGradient = gradientColors && gradientColors.length >= 2;
  const gradientId = 'progressGradient';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {useGradient && (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={gradientColors![0]} />
              <Stop offset="100%" stopColor={gradientColors![1]} />
            </LinearGradient>
          </Defs>
        )}

        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={useGradient ? `url(#${gradientId})` : color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

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
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
