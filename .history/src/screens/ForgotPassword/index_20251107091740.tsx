import React, { JSX, useState } from 'react';
import {
  Image,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './style';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../services/config/navigation';
import images from '../../services/utilities/images';
import { colors, sizes } from '../../services/utilities';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import { SafeAreaView } from 'react-native-safe-area-context';
type Props = {};
type NavigationProp = StackNavigationProp<RootStackParamList, 'EnterOTP'>;

const ForgotPassword = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {};

  const onHide = () => {
    navigation.navigate('EnterOTP', { email });
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
    </SafeAreaView>
  );
};

export default ForgotPassword;
