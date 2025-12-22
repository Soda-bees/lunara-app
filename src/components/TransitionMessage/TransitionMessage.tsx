import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EmpatheticButton } from '../EmpatheticButton/EmpatheticButton';
import { colors } from '../../constants/colors';
import { radius, spacing } from '../../constants/theme/theme';

type Props = {
  emoji: string;
  title: string;
  message: string;
  buttonText: string;
  onNext: () => void;
};

export const TransitionMessage: React.FC<Props> = ({
  emoji,
  title,
  message,
  buttonText,
  onNext,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <EmpatheticButton title={buttonText} onPress={onNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 32,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

