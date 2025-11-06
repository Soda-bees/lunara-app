import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, fontSize, sizes } from '../../services/utilities';
import TouchAnimation from '../TouchAnimation';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  light?: boolean;
  onPress?: () => void;
  fontFamily?: string;
  loader?: boolean;
  slow?: boolean
  width?: number
}

const Button: React.FC<ButtonProps> = ({
  title,
  disabled = false,
  onPress,
  light = false,
  fontFamily,
  loader = false,
  slow,
  width
}) => {
  const isLight = light;

  const capitalizeWords = (str: string) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => {
        if (word.length === 0) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  const getButtonStyle = () => {
    if (disabled) return [styles.buttonBase, styles.disabledButton, { width: width ?? sizes.screenWidth * 0.8 },];
    return [
      styles.buttonBase, { width: width ?? sizes.screenWidth * 0.8 },
      isLight ? styles.whiteButton : styles.pinkButton,
    ];
  };

  return (
    <TouchAnimation
      onPress={onPress}
      containerStyle={getButtonStyle()}
      slow={slow}
      disabledTouchAnimation={disabled}
      gradientStyle={[styles.buttonBase, { width: width ?? sizes.screenWidth * 0.8 },]}
      isSelected={!disabled && !light}>
      {loader ? (
        <ActivityIndicator
          size={28}
          color={isLight ? '#FEC9D8' : colors.white}
        />
      ) : (
        <Text style={styles.buttonTitle}>{capitalizeWords(title)}</Text>
      )}
    </TouchAnimation>
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
  pinkButton: {
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
    fontWeight: '500',
    fontFamily:'MP-Semibold'
  },
});

export default Button;
