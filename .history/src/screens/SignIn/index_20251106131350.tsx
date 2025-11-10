import React, { useState } from 'react';
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
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

import Button from '../../components/Button';
import styles from './style';
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import { sizes } from '../../constants/sizes';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/stackNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignIn() {
  const navigation = useNavigation<NavigationProp>();

  const [secure, setSecure] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);

  const navigateToSignUp = () => {
    // navigation.navigate('SignUp')
  };
  const navigateForgotPassword = () => {
    // navigation.navigate('ForgotPassword')
  };

  const handleSignIn = async () => {
    setLoader(true);

    // TODO sign-in API call

    setLoader(false);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.mainCart}>
          <Image style={styles.logoFull} source={images.logoFull} />
          <View>
            <Text style={styles.heading}>Glad to See You Again!</Text>
            <Text style={styles.disabledText}>
              Stay in sync with your cycle and take control{'\n'}of your
              well-being with Lunara.
            </Text>
          </View>

          {/* email */}
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

          {/* password */}
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

          <TouchableOpacity
            style={styles.forgotPassContainer}
            onPress={navigateForgotPassword}
          >
            <Text style={styles.textBlack}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="SIGN IN" onPress={handleSignIn} loader={loader} />
          <View style={styles.row4}>
            <View style={styles.hr}></View>
            <Text style={styles.textBlackSmall}>or continue with</Text>
            <View style={styles.hr}></View>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.appleIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.googleIcon} />
            </TouchableOpacity>
          </View>
          {/* sign up link */}
          <View style={styles.row2}>
            <Text style={styles.textBlack}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignUp}>
              <MaskedView
                style={{ alignSelf: 'flex-start' }}
                maskElement={
                  <Text
                    style={[
                      styles.underlineText,
                      { backgroundColor: 'transparent', color: 'black' },
                    ]}
                  >
                    Sign Up
                  </Text>
                }
              >
                <LinearGradient
                  colors={['#FF70A6', '#B388EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                >
                  <Text style={[styles.underlineText, { opacity: 0 }]}>
                    Sign Up
                  </Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
