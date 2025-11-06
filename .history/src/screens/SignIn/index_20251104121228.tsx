import React, { JSX, useState } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styles from './style';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import images from '../../constants/images';
import { sizes } from '../../constants/sizes';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp' | 'ForgotPassword' | 'DrawerNavigator'
>;

const SignIn = () => {
  const navigation = useNavigation<NavigationProp>();

  const [secure, setSecure] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleButton = async () => {};

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <View style={styles.topCart} />

          <View style={styles.mainCart}>
            <Text style={styles.heading}>Glad to See You Again!</Text>
            <Text style={styles.disabledText}>
              Stay in sync with your cycle and take control{'\n'}of your
              well-being with Lunara.
            </Text>

            <View style={styles.inputContainer}>
              <Image source={images.mailIcon} style={styles.inputIcon} />
              <TextInput
                onChangeText={text => {
                  setEmail(text);
                }}
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.placeHolderGray}
              />
            </View>

            <View style={styles.inputContainer}>
              <Image source={images.passwordIcon} style={styles.inputIcon} />
              <TextInput
                onChangeText={text => {
                  setPassword(text);
                }}
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.placeHolderGray}
                secureTextEntry={secure}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecure(!secure);
                }}
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
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            >
              <Text style={styles.textBlack}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.row3}>
              <TouchableOpacity
                style={{ marginRight: sizes.screenWidth * 0.02 }}
                onPress={() => {
                  setChecked(!checked);
                }}
              >
                <Image
                  source={checked ? images.checked : images.check}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
              <Text style={styles.textBlackSmall}>Keep Me Signed In.</Text>
            </View>

            <Button title="SIGN IN" onPress={handleButton} loader={loader} />

            <View style={styles.row2}>
              <Text style={styles.textBlack}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <MaskedView
                  style={{ alignSelf: 'flex-start' }}
                  maskElement={
                    <Text
                      style={[
                        styles.underlineText,
                        { backgroundColor: 'transparent', color: 'black' },
                      ]}
                    >
                      Sign Up
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={['#FF70A6', '#B388EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <Text style={[styles.underlineText, { opacity: 0 }]}>
                      Sign Up
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignIn;
