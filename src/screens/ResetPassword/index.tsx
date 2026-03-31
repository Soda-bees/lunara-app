import React, { JSX, useState, useEffect } from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { resetPassword } from '../../services/api';
import { Alert } from 'react-native';

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPassword({ navigation, route }: Props) {
  const email = route.params?.email || '';
  const otp = route.params?.otp || '';
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (!email || !otp) {
      Alert.alert('Error', 'Missing information. Please start over.');
      navigation.navigate('ForgotPassword');
    }
  }, [email, otp, navigation]);

  const handlePress = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!email || !otp) {
      Alert.alert('Error', 'Missing information. Please start over.');
      navigation.navigate('ForgotPassword');
      return;
    }

    setLoader(true);
    try {
      const response = await resetPassword(email, otp, password);

      if (response.success) {
        Alert.alert('Success', 'Password reset successful! Please login with your new password.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ]);
      } else {
        Alert.alert(
          'Error',
          response.message || 'Invalid OTP or password reset failed',
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Unable to reset password. Please try again.',
      );
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
              <Text style={styles.forgotText}>Forgot Password?</Text>
              <Text style={styles.paraText}>
                Enter your registered email address, and we'll{'\n'}send you an
                OTP code to create a new password.
              </Text>
            </View>
            <View style={styles.inputViewContainer}>
              <View style={styles.inputContainer}>
                <Image source={images.passwordIcon} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.placeHolderGray}
                  secureTextEntry={secure}
                />
                <TouchableOpacity
                  onPress={() => setSecure(!secure)}
                  style={styles.showHideContainer}
                >
                  <Image
                    style={styles.hideIcon}
                    source={secure ? images.hide : images.show}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Image source={images.passwordIcon} style={styles.inputIcon} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={colors.placeHolderGray}
                  secureTextEntry={secure2}
                />
                <TouchableOpacity
                  onPress={() => setSecure2(!secure2)}
                  style={styles.showHideContainer}
                >
                  <Image
                    style={styles.hideIcon}
                    source={secure2 ? images.hide : images.show}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button
              title="Save New Password"
              onPress={handlePress}
              loader={loader}
              // onPress={() => navigation.navigate('EnterOTP', {email})}
              // disabled={email.trim() === ''}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
