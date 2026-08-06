import React, { JSX, useEffect, useState } from 'react';
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
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images/auth';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { forgotPassword } from '../../services/api';
import { Alert } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function OTP({ navigation, route }: Props) {
  const email = route.params?.email || '';
  const [loader, setLoader] = useState<boolean>(false);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(60);

  const CELL_COUNT = 6; // OTP is 6 digits based on backend
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handlePress = async () => {
    if (value.length !== CELL_COUNT) {
      Alert.alert('Error', 'Please enter the complete OTP code');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email not found. Please start over.');
      navigation.navigate('ForgotPassword');
      return;
    }

    // Navigate to ResetPassword with email and OTP
    navigation.navigate('ResetPassword', { email, otp: value });
  };

  const handleResend = async () => {
    if (timer !== 0) return;

    if (!email) {
      Alert.alert('Error', 'Email not found. Please start over.');
      navigation.navigate('ForgotPassword');
      return;
    }

    setLoader(true);
    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setTimer(60);
        setValue('');
        Alert.alert('Success', 'OTP has been resent to your email');
      } else {
        Alert.alert('Error', response.message || 'Unable to resend OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Unable to resend OTP');
    } finally {
      setLoader(false);
    }
  };

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.forgotText}>Enter OTP Code</Text>
              <Text style={styles.paraText}>
                We've sent an OTP code to your email. Please enter it below to
                verify your account.
              </Text>
            </View>
            <CodeField
              ref={ref}
              value={value}
              onChangeText={setValue}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[
                    Platform.OS == 'android' ? styles.cell : styles.cellIOS,
                    isFocused && styles.focusCell,
                  ]}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
            <View style={styles.centerContainer}>
              {timer === 0 ? (
                <Text onPress={handleResend} style={styles.textBoldColored}>
                  Resend OTP
                </Text>
              ) : (
                <Text style={styles.disabledText}>
                  Resend OTP in {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, '0')}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button
              title="Continue"
              onPress={handlePress}
              loader={loader}
              disabled={false}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
