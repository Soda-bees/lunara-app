import React from 'react';
import { StyleSheet, ViewStyle, StatusBar, Platform, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sizes } from '../../constants/sizes';

interface Props {
  children?: React.ReactNode;
  style?: ViewStyle;
  hideBG?: boolean;
}

const SoftGradientBackground: React.FC<Props> = ({
  children,
  hideBG,
  style,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={
          hideBG
            ? ['#FFFFFF', '#FFFFFF', '#FFFFFF']
            : ['#FFF4E3', '#FFFFFF', '#FFF4E3']
        }
        start={{ x: 2, y: 0.2 }}
        end={{ x: 0.1, y: 1 }}
        style={[styles.gradient, style]}
      >
        <SafeAreaView
          style={[styles.safeAreaContent]}
          edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']} // already handling top/bottom manually
        >
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: sizes.screenWidth * 0.04,
  },
  safeAreaContent: {
    flex: 1,
  },
});

export default SoftGradientBackground;
