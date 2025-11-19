import { Alert, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  type SignInResponse,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '991528142293-9krhfqrm3e6n2skt4icff6n6bk8pgj66.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    console.log('after await');

    const result: SignInResponse = await GoogleSignin.signIn();
    console.log('after result');

    const idToken = result?.data?.idToken;
    console.log('after token');

    if (!idToken) {
      throw new Error('Google Sign-In failed: Missing idToken');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
    console.log('after google');

    Alert.alert('Success', 'Signed in with Google!');
  } catch (error: any) {
    console.log('after catch');
    console.error('Google Sign-In error:', error);

    // if (error.code === statusCodes.SIGN_IN_CANCELLED) return;
    // if (error.code === statusCodes.IN_PROGRESS) return;
    // if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) return;

    Alert.alert('Error', error.message || 'Google sign-in failed');
  }
};

export const signInWithApple = async (): Promise<void> => {
  if (Platform.OS !== 'ios') return;

  try {
    const response = await appleAuth.performRequest({
      requestedOperation: AppleRequestOperation.LOGIN,
      requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
    });

    const { identityToken, nonce } = response;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed: no token returned');
    }

    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    await auth().signInWithCredential(appleCredential);

    Alert.alert('Success', 'Signed in with Apple!');
  } catch (error: any) {
    console.error('Apple Sign-In error:', error);
    Alert.alert('Error', error.message || 'Apple sign-in failed');
  }
};
