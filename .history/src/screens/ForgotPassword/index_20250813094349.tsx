import React, {JSX, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../services/config/navigation';
import images from '../../services/utilities/images';
import {colors, sizes} from '../../services/utilities';
import Button from '../../components/Button';
import AuthHeader from '../../components/AuthHeader';
import {handleForgotPassOTP} from '../../services/config/Api/api';
import {ErrorShow} from '../../components/Toast';
import BackButton from '../../components/BackButton';
import SoftGradientBackground from '../../components/SoftGradientBackground';
type Props = {};
type NavigationProp = StackNavigationProp<RootStackParamList, 'EnterOTP'>;

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    try {
      setLoader(true);
      const response = await handleForgotPassOTP({email});
      if (response.success) {
        setLoader(false);
        ErrorShow({
          type: 'success',
          title: 'OTP Sent!',
          message:
            response.message ||
            'We’ve sent a verification code to your email. Please check your inbox.',
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

  const onHide = () => {
    navigation.navigate('EnterOTP', {email});
  };

  return (
    <SoftGradientBackground>
      <BackButton />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.mainContainer}>
          <View>
            <Text style={styles.forgotText}>Forgot Password?</Text>
            <Text style={styles.paraText}>
              Enter your registered email address, and we'll{'\n'}send you an
              OTP code to create a new password.
            </Text>
            <View style={styles.iconInputView}>
              <Image source={images.mailIcon} style={styles.emailIconStyle} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor={colors.placeHolderGray}
                value={email}
                onChangeText={text => {
                  setEmail(text);
                }}
              />
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button
              title="SEND OTP CODE"
              onPress={handlePress}
              loader={loader}
              // onPress={() => navigation.navigate('EnterOTP', {email})}
              // disabled={email.trim() === ''}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SoftGradientBackground>
  );
};

export default ForgotPassword;
