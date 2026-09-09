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
import images from '../../constants/images/auth';
import { colors } from '../../constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';
import {
  configureGoogleSignIn,
  onAppleButtonPress,
  runGoogleSignIn,
} from '../../services/auth/socialAuth';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUserIdentity } from '../../context/UserIdentityContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUp() {
  const navigation = useNavigation<NavigationProp>();
  const { updateData } = useOnboarding();
  const { setDisplayName } = useUserIdentity();

  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigateToSignIn = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = async () => {
    setLoader(true);

    // TODO sign-Up API call

    setLoader(false);
    navigation.navigate('PrivacyConsent');
  };

  const handleGoogleSignIn = async () => {
    try {
      await runGoogleSignIn({
        onNewUser: async (user, googleIdToken) => {
          updateData({
            email: user.email,
            fullName: user.name,
            googleIdToken,
          });
          navigation.navigate('AccountSetup', {
            googleUser: user,
          });
        },
        onExistingUser: async user => {
          if (user.name) {
            await setDisplayName(user.name);
          }
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabNavigator' }],
          });
        },
      });
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
              <Text style={styles.heading}>Join Lunara.</Text>
              <Text style={styles.disabledText}>
                Sign up to track your cycle and stay in{'\n'}tune with your
                body.
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
          <View>
            <Button title="Sign Up" onPress={handleSignUp} loader={loader} />
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
            <View style={styles.row2}>
              <Text style={styles.textBlack}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text style={styles.underlineText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
