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
import images from '../../constants/images';
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
          <View style={styles.row}>
            <Image
              style={styles.currentPhaseIconMain}
              source={images.currentPhaseIconMain}
            />
            <Text style={styles.heading}>Current Phase</Text>
          </View>
          <View style={styles.phaseTextContainer}>
            <Text style={styles.textPrimary}>Foliicular - Day 8</Text>
          </View>
          <View style={styles.colCenter}>
            <Text style={styles.spacedText}>TODAY</Text>
            <Text style={styles.textBlackMedium}>Tuesday, October 28</Text>
          </View>
          <View style={styles.cyclePhaseCard}>
            <Text style={styles.spacedText}>CYCLE PROGRESS</Text>

            <View style={styles.rowFull}>
              <Text style={styles.heading}>Current Phase<Text></Text></Text></Text>
                          <View style={styles.phaseTextContainer}>
              <Text style={styles.textPrimary}>Foliicular - Day 8</Text>
            </View>
            </View>
            <View style={styles.phaseTextContainer}>
              <Text style={styles.textPrimary}>Foliicular - Day 8</Text>
            </View>
            <View style={styles.colCenter}>
              <Text style={styles.spacedText}>TODAY</Text>
              <Text style={styles.textBlackMedium}>Tuesday, October 28</Text>
            </View>
          </View>
        </View>
      </GradientWrapper>
    </SafeAreaView>
  );
}
