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
import BackButton from '../../components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/stackNavigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import images from '../../constants/images/auth';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
import { forgotPassword } from '../../services/api';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPassword({ navigation, route }: Props) {
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoader(true);
    try {
      const response = await forgotPassword(email.trim());

      if (response.success) {
        // Only navigate to OTP screen if email exists and OTP was sent
        navigation.navigate('OTP', { email: email.trim() });
      } else {
        // Show error message and don't navigate
        Alert.alert(
          'Email Not Found',
          response.message || 'This email is not registered. Please check your email or sign up.',
        );
      }
    } catch (error: any) {
      // Handle network errors or API errors
      const errorMessage =
        error.message || 'Unable to send OTP. Please try again.';
      
      // Check if it's a 404 (email not found) or other error
      if (errorMessage.includes('not registered') || errorMessage.includes('404')) {
        Alert.alert(
          'Email Not Found',
          'This email is not registered. Please check your email or sign up.',
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
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
            <View style={styles.inputContainer}>
              <Image source={images.mailIcon} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.placeHolderGray}
              />
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button
              title="Send OTP Code"
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
