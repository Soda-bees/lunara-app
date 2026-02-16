import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { spacing } from '../../constants/theme/theme';
import Nutrition from '../../components/Nutrition';

export const NutritionScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Nutrition />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});