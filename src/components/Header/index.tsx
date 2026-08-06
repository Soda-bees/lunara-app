import React, { useState } from 'react';
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
import images from '../../constants/images/common';
import BackButton from '../BackButton';
import { useNavigation } from '@react-navigation/native';

type HeaderProps = {
  showBackButton?: boolean;
};

export default function Header({ showBackButton = false }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Image
            source={images.backIcon}
            style={styles.backIcon}
            accessible={false}
          />
        </TouchableOpacity>
      ) : (
        <Image
          source={images.logoFull}
          style={styles.logoFull}
          accessibilityLabel="Lunara"
        />
      )}
      <TouchableOpacity
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <Image
          source={images.profileIcon}
          style={styles.profileIcon}
          accessible={false}
        />
        <Text style={styles.text} accessible={false}>
          Profile
        </Text>
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
    paddingVertical: 12,
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
    fontFamily: 'Inter-Regular',
  },

  backIcon: {
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
});
