// import React from 'react';
// import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { radius, spacing, colors } from '../../constants/theme/theme';

// type Props = {
//   title: string;
//   onPress: () => void;
//   disabled?: boolean;
//   fullWidth?: boolean;
//   style?: ViewStyle;
// };

// export const EmpatheticButton: React.FC<Props> = ({
//   title,
//   onPress,
//   disabled = false,
//   fullWidth = true,
//   style,
// }) => {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.85}
//       onPress={onPress}
//       disabled={disabled}
//       style={[
//         styles.touchable,
//         fullWidth && { alignSelf: 'stretch' },
//         disabled && styles.disabled,
//         style,
//       ]}
//     >
//       <LinearGradient
//         colors={
//           disabled
//             ? ['#E2E8F0', '#CBD5E1']
//             : [colors.primary, colors.primaryMuted]
//         }
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.gradient}
//       >
//         <Text style={styles.title}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   touchable: {
//     borderRadius: radius.md,
//     overflow: 'hidden',
//   },
//   gradient: {
//     paddingVertical: spacing.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: radius.md,
//   },
//   title: {
//     color: '#ffffff',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   disabled: {
//     opacity: 0.7,
//   },
// });

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
  small?: boolean;
};

export default function EmpatheticButton({
  title,
  onPress,
  loader = false,
  disabled = false,
  small = false, // <-- default false
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
        style={[
          styles.button,
          small && { width: sizes.screenWidth * 0.82 }, // <-- apply small width override
          disabled && styles.disabled,
        ]}
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
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: sizes.screenWidth * 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSize.medium,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
  },
});

