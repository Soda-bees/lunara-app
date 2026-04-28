import React, {useEffect, useRef} from 'react';
import {View, Animated, Easing, StyleSheet} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';
import {colors} from '../../constants/colors';

interface LoaderProps {
  size: number;
  fast?: boolean;
  white?: boolean;
}

const Loader: React.FC<LoaderProps> = ({size, fast, white}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: fast ? 600 : 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim, fast]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const strokeWidth = 10;
  const radius = 40;
  const center = 50;

  // Dot position calculation
  const dotX = center - radius;
  const dotY = center;

  return (
    <View style={styles(size).container}>
      <Animated.View
        style={{
          transform: [{rotate: spin}],
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Svg height={size} width={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop
                offset="0%"
                stopColor={white ? colors.white : '#FDCDDC'}
                stopOpacity="1"
              />
              <Stop
                offset="50%"
                stopColor={white ? colors.white : '#FEE2F8'}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={colors.primaryLight}
                stopOpacity="0"
              />
            </LinearGradient>
          </Defs>

          {/* Arc with rotation */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="url(#grad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="250"
            strokeDashoffset="60"
            transform="rotate(-90 50 50)" // ✅ Rotate arc to match dot
          />

          {/* Red dot */}
          <Circle
            cx={dotX}
            cy={dotY}
            r={strokeWidth / 2}
            fill={white ? colors.white : '#FDCDDC'}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Loader;

const styles = (size: number) =>
  StyleSheet.create({
    container: {
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
