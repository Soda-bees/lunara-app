import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import GradientWrapper from '../../components/GradientWrapper';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

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

      <Header />

      <GradientWrapper variant="basic">
        <View style={styles.phaseBody}>
          <View style={styles.phaseBody}>
            <Image style={styles.phaseBody} />
            <Text style={styles.phaseBody}>Current Phase</Text>
          </View>
          <View style={styles.phaseBody}>
            <Text style={styles.phaseBody}>Foliicular - Day 8</Text>
          </View>
          <View style={styles.phaseBody}>
            <Text style={styles.phaseBody}></Text>
            <Text style={styles.phaseBody}></Text>
          </View>
        </View>
      </GradientWrapper>
    </SafeAreaView>
  );
}
