import React, { JSX, useState } from 'react';
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
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function ResetPassword() {
  const navigation = useNavigation<NavigationProp>();
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loader, setLoader] = useState<boolean>(false);

  const handlePress = async () => {
    navigation.navigate('OTP', { email });
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
