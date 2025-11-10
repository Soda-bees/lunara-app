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
import images from '../../constants/images';
import { colors } from '../../constants/colors';
import Button from '../../components/Button';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

export default function ResetSuccess() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
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
      <View style={styles.mainContainer}>
        <View>
          <Image source={images.resetSuccess} />
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
    </SafeAreaView>
  );
}
