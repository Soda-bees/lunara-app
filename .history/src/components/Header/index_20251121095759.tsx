import React from 'react';
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';
import { fontSize } from '../../constants/fonts';
import images from '../../constants/images';

type Props = {};

export default function Header({}: Props) {
  return (
    <View style={styles.header}>
      <Image source={images.logoFull} style={styles.logoFull} />
      <TouchableOpacity style={styles.button}>
        <Image source={images.profileIcon} style={styles.profileIcon} />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: sizes.screenWidth * 0.9,
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: 'red',
  },

  logoFull: {
    width: sizes.screenWidth * 0.24,
    height: sizes.screenWidth * 0.1,
    resizeMode: 'contain',
  },

  button: {
    borderRadius: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 6,
    backgroundColor: '#F0F0F0',
  },

  profileIcon: {
    height: 26,
    width: 26,
  },

  text: {
    fontSize: fontSize.Regular,
    color: colors.black,
    fontFamily: 'Inter-Medium',
  },
});
