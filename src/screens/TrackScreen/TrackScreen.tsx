import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors, spacing } from '../../constants/theme/theme';

export const TrackScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Track</Text>
        <Text style={styles.subtitle}>Log meals, movement, symptoms, and more.</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center' },
});


