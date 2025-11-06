import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';

type Props = {
  title: string;
  onPress: () => void;
  loader?: boolean;
  disabled?: boolean;
  slow?: boolean; // if later you want to use TouchAnimation wrapper like BoxShadow
  variant?: 'pink' | 'white';
};

export default function Button({
  title,
  onPress,
  loader = false,
  disabled = false,
  variant = 'pink',
}: Props) {
  const commonStyle = [styles.buttonBase];

  if (variant === 'pink') commonStyle.push(styles.pinkButton);
  if (variant === 'white') commonStyle.push(styles.whiteButton);
  if (disabled) commonStyle.push(styles.disabledButton);

  return (
    <TouchableOpacity
      disabled={disabled || loader}
      onPress={onPress}
      style={commonStyle}
      activeOpacity={0.7}
    >
      {loader ? (
        <ActivityIndicator size={28} color={colors.white} />
      ) : (
        <Text style={styles.buttonTitle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    height: sizes.screenHeight * 0.06,
    borderRadius: sizes.screenWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: sizes.screenWidth * 0.05,
  },
  pinkButton: {
    backgroundColor: colors.pink,
  },
  whiteButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  disabledButton: {
    backgroundColor: colors.borderColor,
    opacity: 0.5,
  },
  buttonTitle: {
    fontSize: fontSize.medium,
    color: colors.black,
    fontFamily: 'MP-Semibold',
  },
});
