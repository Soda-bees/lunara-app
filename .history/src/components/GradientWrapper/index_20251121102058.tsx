import React from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';

type GradientVariant = 'primary' | 'basic';

interface GradientWrapperProps {
  variant?: GradientVariant;
  children?: React.ReactNode;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({
  variant = 'primary',
  children,
}) => {
  const isBasic = variant === 'basic';

  // Gradient colors from constants
  const gradientColors = gradients[variant];

  // Default gradient directions
  const start = isBasic ? { x: 0.5, y: 0 } : { x: 0, y: 0 };
  const end = isBasic ? { x: 0.5, y: 1 } : { x: 1, y: 0 };

  // Internal consistent styling
  const containerStyle: ViewStyle = {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: isBasic ? 1 : 0,
    borderColor: isBasic ? '#00000020' : 'transparent',
    justifyContent: 'center',
    // alignItems: 'center',
  };

  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={containerStyle}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;
