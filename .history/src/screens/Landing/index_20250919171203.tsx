import React, {JSX} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import styles from './style';
import images from '../../services/utilities/images';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../services/config/navigation/index';
import {useDispatch, useSelector} from 'react-redux';
import {
  removeAuthToken,
  selectAuthToken,
  setAuthToken,
} from '../../store/authSlice';
import {selectUserData} from '../../store/userSlice';
import Button from '../../components/Button';
import SoftGradientBackground from '../../components/SoftGradientBackground';
import AuthHeader from '../../components/AuthHeader';

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn',
  'SignUp'
>;

const Landing = () => {
  const navigation = useNavigation<NavigationProp>();
  const authToken = useSelector(selectAuthToken);
  const userDataRedux = useSelector(selectUserData);
  const dispatch = useDispatch();

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    // <SoftGradientBackground>
    //   <AuthHeader margin={40} />
    //   <View style={styles.topCart}>
    //     <View style={styles.mainCart}>
    //       <View style={styles.textView}>

    //       <Text style={styles.heading}>Let's Get Started</Text>
    //       <Text style={styles.disabledText}>Let's dive into your account.</Text>
    //       </View>
    //       <View style={{alignItems: 'center'}}>
    //         <TouchableOpacity style={styles.button}>
    //           <Image style={styles.buttonIcon} source={images.googleIcon} />
    //           <Text style={styles.textBlack}>Continue with Google</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.button}>
    //           <Image style={styles.buttonIcon} source={images.appleIcon} />
    //           <Text style={styles.textBlack}>Continue with Apple</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.button}>
    //           <Image style={styles.buttonIcon} source={images.facebookIcon} />
    //           <Text style={styles.textBlack}>Continue with Facebook</Text>
    //         </TouchableOpacity>
    //         <View style={styles.verticalLine} />
    //       </View>
    //       <View style={styles.buttonContainer}>
    //         <Button title="sign up" onPress={handleSignUp} />
    //         <Button title="sign in" light={true} onPress={handleSignIn} />
    //       </View>

    //       <View style={styles.row}>
    //         <TouchableOpacity>
    //           <Text style={styles.textBlackSmall}>Privacy Policy</Text>
    //         </TouchableOpacity>
    //         <View style={styles.dot}></View>
    //         <TouchableOpacity>
    //           <Text style={styles.textBlackSmall}>Terms of Services</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </View>
    // </SoftGradientBackground>

    <SoftGradientBackground>
      <AuthHeader margin={40} />

      <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
        <View style={styles.topCart} />

        <View style={styles.mainCart}>
          <View style={styles.textView}>
            <Text style={styles.heading}>Let's Get Started</Text>
            <Text style={styles.disabledText}>
              Let's dive into your account.
            </Text>
          </View>

          {/* <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.googleIcon} />
              <Text style={styles.textBlack}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.appleIcon} />
              <Text style={styles.textBlack}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image style={styles.buttonIcon} source={images.facebookIcon} />
              <Text style={styles.textBlack}>Continue with Facebook</Text>
            </TouchableOpacity>
            <View style={styles.verticalLine} />
          </View> */}
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
    </SoftGradientBackground>
  );
};

export default Landing;
