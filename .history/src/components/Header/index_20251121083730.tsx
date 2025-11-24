import React from 'react';
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
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

export default function Header({}: Props) {
  return <View style={styles.header}></View>;
}

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    width: sizes.screenWidth * 0.9,
    justifyContent: 'space-between',
  },
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
