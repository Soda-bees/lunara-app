import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';

interface GradientTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const GradientText: React.FC<GradientTextProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]} {...props}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
