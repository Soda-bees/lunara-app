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
import { googleAuth, storeAuthSession } from '../api';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '991528142293-9krhfqrm3e6n2skt4icff6n6bk8pgj66.apps.googleusercontent.com',
    offlineAccess: true,
  });
};

// com.googleusercontent.apps.991528142293-n4vruv8gehi741v8behd4gflj064sr3v ios-id

// export const signInWithGoogle = async (): Promise<void> => {
//     try {
//         await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

//         const result: SignInResponse = await GoogleSignin.signIn();
//         // console.log('after result', result);

//         const idToken = result?.data?.idToken;

//         if (!idToken) {
//             throw new Error('Google Sign-In failed: Missing idToken');
//         }

//         const googleCredential = auth.GoogleAuthProvider.credential(idToken);
//         await auth().signInWithCredential(googleCredential);

//         Alert.alert('Success', 'Signed in with Google!');
//     } catch (error: any) {
//         console.error('Google Sign-In error:', error);

//         Alert.alert('Error', error.message || 'Google sign-in failed');
//     }
// };

export const signInWithGoogle = async (): Promise<{
  success: boolean;
  isNewUser?: boolean;
  user?: { email: string; name: string };
  token?: string;
  googleIdToken?: string;
  navigationTarget?: string;
}> => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignin.signIn();

    if (result?.type === 'cancelled') {
      console.log('User cancelled Google login');
      return { success: false };
    }

    const idToken = result?.data?.idToken;
    const userInfo = result?.data?.user;
    
    if (!idToken) {
      console.log('No idToken — probably cancelled');
      return { success: false };
    }

    // Get user info from Google
    const email = userInfo?.email || '';
    const name = userInfo?.name || email.split('@')[0];

    // Call backend API
    const response = await googleAuth({
      idToken,
      email,
      name,
    });

    if (response.success) {
      if (response.isNewUser) {
        // New user - return info for onboarding with Google ID token
        return {
          success: true,
          isNewUser: true,
          user: {
            email: response.user?.email || email,
            name: response.user?.name || name,
          },
          googleIdToken: idToken, // Store token for later use in onboarding
          navigationTarget: 'AccountSetup',
        };
      } else {
        // Existing user - store token and login
        if (response.token) {
          await storeAuthSession(response.token, 'owner');
        }
        return {
          success: true,
          isNewUser: false,
          token: response.token,
          navigationTarget: 'TabNavigator',
        };
      }
    } else {
      throw new Error(response.message || 'Google sign-in failed');
    }
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled Google Sign-In');
      return { success: false };
    }

    Alert.alert('Error', error.message || 'Google sign-in failed');
    return { success: false };
  }
};

export async function onAppleButtonPress() {
  if (Platform.OS !== 'ios') return;

  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;

    if (!identityToken) {
      throw new Error('Apple Sign-In failed: no identity token returned');
    }

    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    await auth().signInWithCredential(appleCredential);

    Alert.alert('Success', 'Signed in with Apple!');
  } catch (error: any) {
    if (error.code === appleAuth.Error.CANCELED) {
      console.log('Apple Sign-In was cancelled by user');
      return;
    }

    console.error('Apple Sign-In error:', error);
    Alert.alert('Error', error.message || 'Apple Sign-In failed');
  }
}

///////////////////// Logout /////////////////////////////////

export const logoutFromGoogle = async (): Promise<void> => {
  try {
    await auth().signOut();
    await GoogleSignin.signOut();
    console.log('User logged out successfully');
  } catch (error: any) {
    console.error('Google logout error:', error);
  }
};
