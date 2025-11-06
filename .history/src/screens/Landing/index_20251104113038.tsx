import React, { JSX } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './style';
import images from '../../services/utilities/images';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../services/config/navigation/index';
import Button from '../../components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn',
  'SignUp'
>;

const Landing = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 10 }}>
        <View style={styles.topCart} />

        <View style={styles.mainCart}>
          <View style={styles.textView}>
            <Text style={styles.heading}>Let's Get Started</Text>
            <Text style={styles.disabledText}>
              Let's dive into your account.
            </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.googleIcon} />
              <Text style={styles.textBlack}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.appleIcon} />
              <Text style={styles.textBlack}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.verticalLine} />
          </View>
          <Image source={images.impImg} style={styles.impImg} />
          <View style={styles.buttonContainer}>
            <Button title="sign up" onPress={handleSignUp} />
            <Button title="sign in" light={true} onPress={handleSignIn} />
          </View>

          <View style={styles.row}>
            <TouchableOpacity>
              <Text style={styles.textBlackSmall}>Privacy Policy</Text>
            </TouchableOpacity>
            <View style={styles.dot}></View>
            <TouchableOpacity>
              <Text style={styles.textBlackSmall}>Terms of Services</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Landing;
