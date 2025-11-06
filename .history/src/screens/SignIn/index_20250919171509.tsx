import React, {JSX, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styles from './style';
import images from '../../services/utilities/images';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../services/config/navigation/index';
import {AppDispatch} from '../../store';
import {useDispatch, useSelector} from 'react-redux';
import {selectAuthToken, setAuthToken} from '../../store/authSlice';
import {selectUserData, setUserData} from '../../store/userSlice';
import Button from '../../components/Button';
import {colors, sizes} from '../../services/utilities';
import AuthHeader from '../../components/AuthHeader';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import {ErrorShow} from '../../components/Toast';
import {handleSignIn} from '../../services/config/Api/api';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import moment from 'moment';
import {fetchCycleData} from '../../store/phasesSlice/cycleThunks';
import {convertDateObjectIntoIsoFormat} from '../../services/utilities/helper';
import {fetchLogs} from '../../store/logRecordSlice/logsThunks';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp' | 'ForgotPassword' | 'DrawerNavigator'
>;

const SignIn = () => {
  const navigation = useNavigation<NavigationProp>();
  const authToken = useSelector(selectAuthToken);
  const userDataRedux = useSelector(selectUserData);
  const dispatch = useDispatch<AppDispatch>();

  const [secure, setSecure] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const handleButton = async () => {
    try {
      setLoader(true);
      const response = await handleSignIn({email, password});
      if (response.success) {
        setLoader(false);
        const onHide = () => {
          const body = {
            currentDate: convertDateObjectIntoIsoFormat(moment()),
          };
          dispatch(setAuthToken(response.token));
          dispatch(setUserData(response.userData));
          dispatch(fetchCycleData({body, token: response.token}));
          dispatch(fetchLogs(response.token));
        };
        ErrorShow({
          type: 'success',
          title: 'Welcome!',
          message: response.message || 'Your data has been saved successfully.',
          onHide,
        });
      } else {
        setLoader(false);
        ErrorShow({
          type: 'error',
          title: 'Oops!',
          message: response.message || 'Something went wrong.',
        });
      }
    } catch (error: any) {
      setLoader(false);
      ErrorShow({
        type: 'error',
        title: 'Oops!',
        message: error.message || 'Something went wrong.',
      });
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SoftGradientBackground>
      <AuthHeader />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{alignItems: 'center', marginTop: 10}}>
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
                style={styles.showHideContainer}>
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
              }}>
              <Text style={styles.textBlack}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.row3}>
              <TouchableOpacity
                style={{marginRight: sizes.screenWidth * 0.02}}
                onPress={() => {
                  setChecked(!checked);
                }}>
                <Image
                  source={checked ? images.checked : images.check}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
              <Text style={styles.textBlackSmall}>Keep Me Signed In.</Text>
            </View>

            <Button title="SIGN IN" onPress={handleButton} loader={loader} />
            {/* <View style={styles.row4}>
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
              <TouchableOpacity style={styles.button}>
                <Image style={styles.buttonIcon} source={images.facebookIcon} />
              </TouchableOpacity>
            </View> */}

            <View style={styles.row2}>
              <Text style={styles.textBlack}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <MaskedView
                  style={{alignSelf: 'flex-start'}}
                  maskElement={
                    <Text
                      style={[
                        styles.underlineText,
                        {backgroundColor: 'transparent', color: 'black'},
                      ]}>
                      Sign Up
                    </Text>
                  }>
                  <LinearGradient
                    colors={['#FF70A6', '#B388EB']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}>
                    <Text style={[styles.underlineText, {opacity: 0}]}>
                      Sign Up
                    </Text>
                  </LinearGradient>
                </MaskedView>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SoftGradientBackground>
  );
};

export default SignIn;
