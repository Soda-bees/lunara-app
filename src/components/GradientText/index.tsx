import React from 'react';
import { Text, TextProps, StyleProp, TextStyle, View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import { gradients } from '../../constants/gradientColors';

interface GradientTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: number;
}

const GradientText: React.FC<GradientTextProps> = ({
  style,
  children,
  fontFamily,
  fontSize,
  ...props
}) => {
  const textStyle: TextStyle = {
    backgroundColor: 'transparent',
    color: 'black', // mask needs a color
    fontFamily: fontFamily || 'MP-Bold',
    fontSize: fontSize,
  };

  return (
    <View style={{ alignSelf: 'flex-start' }}>
      <MaskedView
        maskElement={
          <Text style={[textStyle, style]} {...props}>
            {children}
          </Text>
        }
      >
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[textStyle, style, { opacity: 0 }]}>{children}</Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

export default GradientText;
