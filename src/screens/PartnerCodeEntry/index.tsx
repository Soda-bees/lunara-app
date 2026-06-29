import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import GradientText from '../../components/GradientText';
import type { RootStackParamList } from '../../navigation/stackNavigation';
import { connectWithPartnerCode, storeAuthSession } from '../../services/api';
import { usePartnerMode } from '../../context/PartnerModeContext';
import styles from '../PartnerConnect/style';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PartnerCodeEntry'
>;

function formatCodeInput(value: string): string {
  const raw = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
  const parts = [raw.slice(0, 4), raw.slice(4, 8), raw.slice(8, 12)].filter(
    Boolean,
  );
  return parts.join('-');
}

export default function PartnerCodeEntry() {
  const navigation = useNavigation<NavigationProp>();
  const { refreshSessionType } = usePartnerMode();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    const normalized = code.replace(/[^a-zA-Z0-9]/g, '');
    if (normalized.length < 12) {
      Alert.alert('Invalid code', 'Enter the full 12-character partner code.');
      return;
    }

    setLoading(true);
    try {
      const response = await connectWithPartnerCode(code);
      if (!response.token) {
        throw new Error(response.message || 'Could not connect');
      }
      await storeAuthSession(response.token, 'partner');
      await refreshSessionType();
      navigation.reset({
        index: 0,
        routes: [{ name: 'PartnerStackNavigator' }],
      });
    } catch (error: any) {
      Alert.alert(
        'Connection failed',
        error?.message || 'Invalid or expired partner code.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={Platform.OS === 'ios' ? ['top'] : ['top', 'bottom']}
    >
      <StatusBar barStyle="dark-content" />
      <BackButton />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.textContainer}>
              <GradientText
                fontFamily="PlayfairDisplay-SemiBold"
                style={styles.title}
              >
                Partner code
              </GradientText>
              <Text style={styles.paraText}>
                Enter the code shared by the primary Lunara user.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={text => setCode(formatCodeInput(text))}
                placeholder="ABCD-EFGH-IJKL"
                placeholderTextColor="#B0B0B0"
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={14}
              />
            </View>
          </View>

          <View style={styles.bottomButton}>
            <Button
              title={loading ? 'Connecting...' : 'Connect'}
              onPress={handleConnect}
              disabled={loading}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
