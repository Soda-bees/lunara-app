import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Vibration,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import styles from './style';
import Button from '../../components/Button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type RouteProps = RouteProp<RootStackParamList, 'Weight'>;

export default function QuickTracking() {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<RouteProps>();

  const handleContinue = () => {};

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
      <BackButton />
      <View style={styles.mainContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.forgotText}>Today's Tracking</Text>
          <Text style={styles.paraText}>
            Stay on track with your habits, one check-in at a time.
          </Text>
        </View>

        <View style={styles.numberSLiderContainer}></View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
