import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { getInitials } from '../../utils/getInitials';

type InitialsAvatarProps = {
  name?: string | null;
  size?: number;
};

export default function InitialsAvatar({
  name,
  size = 26,
}: InitialsAvatarProps) {
  const initials = getInitials(name);
  const fontSize = Math.max(10, Math.round(size * 0.38));

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={name ? `Avatar for ${name}` : 'Avatar'}
    >
      <Text
        style={[styles.letter, { fontSize, lineHeight: fontSize * 1.15 }]}
        allowFontScaling={false}
      >
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.lightOranger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: colors.maroonText,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});
