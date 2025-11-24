import React from 'react';
import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';
import { sizes } from '../../constants/sizes';

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

  const gradientColors = gradients[variant];

  const start = isBasic ? { x: 0.5, y: 0 } : { x: 0, y: 0 };
  const end = isBasic ? { x: 0.5, y: 1 } : { x: 1, y: 0 };

  // Internal consistent styling
  const containerStyle: ViewStyle = {
    width: sizes.screenWidth * 0.9,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: isBasic ? 1 : 0,
    borderColor: isBasic ? '#EEEEEE' : 'transparent',
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
