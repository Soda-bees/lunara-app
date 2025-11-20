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
          <View style={styles.row}>
            <Text style={styles.label}>Period Cycle</Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.toggleButton,
                  cycle === 'irregular' && styles.selectedButton,
                ]}
                onPress={() => setCycle('irregular')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    cycle === 'irregular' && styles.selectedText,
                  ]}
                >
                  Irregular
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.toggleButton,
                  cycle === 'regular' && styles.selectedButton,
                ]}
                onPress={() => setCycle('regular')}
              >
                <Text
                  style={[
                    styles.toggleText,
                    cycle === 'regular' && styles.selectedText,
                  ]}
                >
                  Regular
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputWrapper}>
            {cycle === 'regular' ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.inputBoxEditable}
                  keyboardType="numeric"
                  placeholder="26 Days"
                  placeholderTextColor={colors.placeholderColor}
                  value={regularDays?.toString() ?? ''}
                  onChangeText={setRegularDays}
                  maxLength={2}
                />
              </View>
            ) : (
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputBoxEditable}
                    keyboardType="numeric"
                    placeholder="26 Days"
                    placeholderTextColor={colors.placeholderColor}
                    value={minDays?.toString() ?? ''}
                    onChangeText={setMinDays}
                    maxLength={2}
                  />
                </View>

                <View style={styles.separator}></View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputBoxEditable}
                    keyboardType="numeric"
                    placeholder="28 Days"
                    placeholderTextColor={colors.placeholderColor}
                    value={maxDays?.toString() ?? ''}
                    onChangeText={setMaxDays}
                    maxLength={2}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomButton}>
          <Button title="CONTINUE" onPress={handleContinue} />
        </View>
      </View>
    </SafeAreaView>
  );
}
