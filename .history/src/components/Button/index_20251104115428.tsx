import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';

interface ButtonProps {
  title: string;
  loader: boolean;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, loader }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {loader ? (
        <ActivityIndicator
          size={28}
          color={isLight ? '#FEC9D8' : colors.white}
        />
      ) : (
        <Text style={styles.buttonTitle}>{capitalizeWords(title)}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    height: sizes.screenHeight * 0.06,
    borderRadius: sizes.screenWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  pinkButton: {},
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
    fontWeight: '500',
    fontFamily: 'MP-Semibold',
  },
});

export default Button;
