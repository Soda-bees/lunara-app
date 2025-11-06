import React from 'react';
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';

type Props = {
  title: string;
  onPress: () => void;
  loader?: boolean;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  loader = false,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      disabled={disabled || loader}
      onPress={onPress}
      activeOpacity={0.8}
      style={{ alignSelf: 'center' }}
    >
      <LinearGradient
        colors={['#E4AF5D', '#E799AD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, disabled && styles.disabled]}
      >
        {loader ? (
          <ActivityIndicator size={24} color={colors.white} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: sizes.screenHeight * 0.06,
    borderRadius: sizes.screenWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.medium,
    color: colors.white,
    fontFamily: 'MP-Semibold',
  },
});
