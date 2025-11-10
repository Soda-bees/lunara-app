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
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
} from 'react-native-confirmation-code-field';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function OTP() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(60);

  const CELL_COUNT = 4;
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

  const handlePress = async () => {};
  const onHide = () => {
    // navigation.navigate('NewPassword', {email});
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
