import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StepIndicator } from '../StepIndicator/StepIndicator';
import { spacing, colors } from '../../constants/colors';

type Props = {
  title: string;
  subtitle: string;
  currentStep: number;
  totalSteps: number;
};

export const OnboardingHeader: React.FC<Props> = ({
  title,
  subtitle,
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.container}>
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    color: colors.black,
    fontFamily:'PlayfairDisplay-Medium'
  },
  subtitle: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
    fontFamily:'Inter-Regular'
  },
});

