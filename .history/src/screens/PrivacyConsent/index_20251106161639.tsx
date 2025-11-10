import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function PrivacyConsent() {
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = async () => {};

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS == 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.mainCart}>
        <Image style={styles.logoFull} source={images.logoFull} />
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Your body. Your data</Text>
          <Text style={styles.disabledText}>
            Stay in sync with your cycle and take{'\n'}controlof your well-being
            with Lunara.
          </Text>
        </View>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}
