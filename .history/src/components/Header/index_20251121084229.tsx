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
      <Image source={images.logoFull} />
      <TouchableOpacity>
        <Image />
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    width: sizes.screenWidth * 0.9,
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: 'red',
  },

  text: {
    fontSize: fontSize.medium,
    color: colors.white,
    fontFamily: 'Inter-SemiBold',
  },
});
