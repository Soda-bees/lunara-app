import React from 'react';
import { View, StyleSheet, ImageBackground, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme/theme';
import images from '../../constants/images/common';
import { sizes } from '../../constants/sizes';
type Props = {
  children: React.ReactNode;
  padded?: boolean;
  color?: string;
  backgroundImage?: boolean;
};
export const ScreenContainer: React.FC<Props> = ({
  children,
  padded = true,
  color,
  backgroundImage,
}) => {
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: color ?? 'white' }]}
    >
      {backgroundImage && (
        <Image
          source={images.backgroundEffect}
          style={styles.backgroundImageStyle}
        />
      )}
      <View style={[styles.flex, padded && styles.padded]}>{children}</View>
      {/* <ImageBackground
        source={images.backgroundEffect}
        style={styles.backgroundImageStyle}
        resizeMode="contain"
      >
        <View style={[styles.flex, padded && styles.padded]}>{children}</View>
      </ImageBackground> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    // backgroundColor: 'white',
  },
  padded: {
    paddingHorizontal: spacing.lg,
  },
  backgroundImageStyle: {
    width: sizes.screenWidth,
    height: sizes.screenWidth,
    resizeMode: 'contain',
    position: 'absolute',
    top: 80,
    // backgroundColor:'red'
  },
});
