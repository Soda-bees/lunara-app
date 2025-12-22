import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants/theme/theme';

type Props = {
  children: React.ReactNode;
  padded?: boolean;
  color?: string;
};

export const ScreenContainer: React.FC<Props> = ({
  children,
  padded = true,
  color,
}) => {
  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.flex, { backgroundColor: color ?? 'white' }]}
    >
      {/* <LinearGradient
        colors={[colors.gradientTop, '#FFFFFF', colors.gradientBottom]}
        style={styles.flex}
      > */}
      <View style={[styles.flex, padded && styles.padded]}>{children}</View>
      {/* </LinearGradient> */}
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
});
