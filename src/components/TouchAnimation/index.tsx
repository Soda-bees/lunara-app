import { useRef } from 'react';
import {
  Animated,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type TouchAnimationProps = {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle | TextStyle>;
  containerStyle?: StyleProp<ViewStyle | TextStyle>;
  onPress?: () => void;
  isSelected?: boolean;
  gradientStyle?: StyleProp<ViewStyle>;
  slow?: boolean;
  disabledTouchAnimation?: boolean;
};

const TouchAnimation = ({
  title,
  children,
  style,
  containerStyle,
  onPress,
  isSelected: _isSelected,
  gradientStyle: _gradientStyle,
  slow,
  disabledTouchAnimation = false,
}: TouchAnimationProps) => {
  const animationflowsRefs = useRef<{ [key: string]: Animated.Value }>({});

  const getAnimatedValue = (key: string) => {
    if (!animationflowsRefs.current[key]) {
      animationflowsRefs.current[key] = new Animated.Value(1);
    }
    return animationflowsRefs.current[key];
  };

  const handlePress = (title: string) => {
    if (disabledTouchAnimation) return;
    const animatedValue = getAnimatedValue(title);

    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: slow ? 0.97 : 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => (onPress ? onPress() : null));
  };

  const content = title ? <Text style={style}>{title}</Text> : children;

  return (
    <TouchableOpacity
      disabled={disabledTouchAnimation}
      activeOpacity={1}
      onPress={() => handlePress(title || 'default')}
      style={[
        containerStyle,
        {
          transform: [{ scale: getAnimatedValue(title || 'default') }],
        },
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

export default TouchAnimation;
