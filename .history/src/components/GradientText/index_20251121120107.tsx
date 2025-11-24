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
        <Text
          {...props}
          style={[
            style,
            {
              backgroundColor: 'transparent',
              // ensure Android renders correctly
              textAlign: 'left',
            },
          ]}
        >
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }} // Important: fill the masked area
      >
        {/* invisible text just to fill size */}
        <Text style={[style, { opacity: 0 }]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
