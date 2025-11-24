import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';

type GradientVariant = 'primary' | 'basic';

interface GradientWrapperProps {
  variant?: GradientVariant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;

  // optional overrides
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
}

const GradientWrapper: React.FC<GradientWrapperProps> = ({
  variant = 'primary',
  style,
  children,
  colors,
  start,
  end,
  borderColor,
  borderWidth,
  borderRadius = 16,
}) => {
  const gradientColors = colors || gradients[variant];

  const isBasic = variant === 'basic';

  // Default gradient directions
  const defaultStart = start || (isBasic ? { x: 0.5, y: 0 } : { x: 0, y: 0 });
  const defaultEnd = end || (isBasic ? { x: 0.5, y: 1 } : { x: 1, y: 0 });

  // Borders: basic has border, primary does not
  const appliedBorderWidth = borderWidth ?? (isBasic ? 1 : 0);
  const appliedBorderColor =
    borderColor ?? (isBasic ? '#00000020' : 'transparent');

  return (
    <LinearGradient
      colors={gradientColors}
      start={defaultStart}
      end={defaultEnd}
      style={[
        {
          borderRadius,
          borderWidth: appliedBorderWidth,
          borderColor: appliedBorderColor,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;
