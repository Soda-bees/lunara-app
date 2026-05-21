import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import {
  configureGoogleSignIn,
  onAppleButtonPress,
  signInWithGoogle,
} from '../../services/auth/socialAuth';
import { login, storeToken } from '../../services/api';
import { useOnboarding } from '../../context/OnboardingContext';
import { Alert } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn' | 'Login'>;

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();
  const { updateData } = useOnboarding();

  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigateToSignUp = () => {
    navigation.navigate('AccountSetup');
  };
  const navigateForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoader(true);

    try {
      const response = await login({ email: email.trim(), password });

      if (response.success && response.token) {
        // Store auth token
        await storeToken(response.token);

        navigation.reset({
          index: 0,
          routes: [{ name: 'TabNavigator' }],
        });
      } else {
        Alert.alert(
          'Login Failed',
          response.message || 'Invalid email or password',
        );
      }
    } catch (error: any) {
      const title = error?.status === 401 ? 'Login Failed' : 'Error';
      Alert.alert(
        title,
        error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoader(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        if (result.isNewUser && result.user && result.googleIdToken) {
          // New user - store Google ID token in onboarding context
          updateData({
            email: result.user.email,
            fullName: result.user.name,
            googleIdToken: result.googleIdToken,
          });

          // Navigate to AccountSetup with pre-filled email/name
          navigation.navigate('AccountSetup', {
            googleUser: result.user,
          } as any);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigator' }],
          });
        }
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
    }
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.mainCart}>
          <View>
            <Image style={styles.logoFull} source={images.logoFull} />
            <View style={styles.textContainer}>
              <Text style={styles.heading}>Glad to See You Again!</Text>
              <Text style={styles.disabledText}>
                Stay in sync with your cycle and take{'\n'}controlof your
                well-being with Lunara.
              </Text>
            </View>
            <View style={styles.inputViewContainer}>
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
            </View>

            <TouchableOpacity
              style={styles.forgotPassContainer}
              onPress={navigateForgotPassword}
            >
              <Text style={styles.textBlack}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Button
              title="Sign In"
              onPress={handleSignIn}
              loader={loader}
              small={true}
            />
            <View style={styles.row4}>
              <View style={styles.hr}></View>
              <Text style={styles.textBlackSmall}>or continue with</Text>
              <View style={styles.hr}></View>
            </View>
            <View style={styles.row}>
              {/* <TouchableOpacity style={styles.button} onPress={logoutFromGoogle}> */}
              <TouchableOpacity
                style={styles.button}
                onPress={onAppleButtonPress}
              >
                <Image style={styles.buttonIcon} source={images.appleIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleGoogleSignIn}
              >
                <Image style={styles.buttonIcon} source={images.googleIcon} />
              </TouchableOpacity>
            </View>
            {/* sign up link */}
            <View style={styles.row2}>
              <Text style={styles.textBlack}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToSignUp}>
                <Text style={styles.underlineText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
