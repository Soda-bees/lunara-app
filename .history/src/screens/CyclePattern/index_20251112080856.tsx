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
} from 'react-native';
import styles from './style';
import Button from '../../components/Button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import BackButton from '../../components/BackButton';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 7;
const data = Array.from({ length: 7 }, (_, i) => (i + 1).toString());

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type RouteProps = RouteProp<RootStackParamList, 'Weight'>;

export default function CyclePattern() {
  const navigation = useNavigation<NavigationProp>();
  const [cycle, setCycle] = useState<string>('regular');
  const [regularDays, setRegularDays] = useState<string>('');
  const [minDays, setMinDays] = useState<string>('');
  const [maxDays, setMaxDays] = useState<string>('');
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
          <Text style={styles.forgotText}>
            How long does your Cycle usually last?
          </Text>
          <Text style={styles.paraText}>
            Everyone’s cycle is unique — this helps us tailor insights just for
            you.
          </Text>
        </View>

        <View style={styles.numberSLiderContainer}>
          <View>
            <Text>Period Cycle</Text>
            <View>
              <TouchableOpacity>
                <Text>Irregular</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text>Regular</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
