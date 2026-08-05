// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { colors, radius, spacing } from '../../constants/colors';

// type Props = {
//   currentStep: number;
//   totalSteps: number;
// };

// export const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
//   return (
//     <View style={styles.container}>
//       {Array.from({ length: totalSteps }, (_, idx) => {
//         const step = idx + 1;
//         const active = step <= currentStep;
//         return (
//           <View key={step} style={[styles.dot, active && styles.dotActive]} />
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     gap: spacing.xs,
//     marginBottom: spacing.sm,
//   },
//   dot: {
//     flex: 1,
//     height: 6,
//     borderRadius: radius.sm,
//     backgroundColor: colors.border,
//   },
//   dotActive: {
//     backgroundColor: colors.heading,
//   },
// });

import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, radius, spacing } from '../../constants/colors';

type Props = {
  currentStep: number;
  totalSteps: number;
};

export const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, idx) => {
        const step = idx + 1;
        const active = step <= currentStep;

        if (active) {
          return (
            <LinearGradient
              key={step}
              colors={[colors.heading, colors.primaryMuted]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.8, y: 0 }}
              style={styles.dot}
            />
          );
        }

        return <View key={step} style={styles.dot} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 3,
    marginVertical: spacing.md,
    // marginTop:spacing.lg
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
});
