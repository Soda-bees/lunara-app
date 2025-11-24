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

export const signInWithGoogle = async (): Promise<void> => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const result = await GoogleSignin.signIn();

        if (result?.type === 'cancelled') {
            console.log('User cancelled Google login');
            return;
        }

        const idToken = result?.data?.idToken;
        if (!idToken) {
            console.log('No idToken — probably cancelled');
            return;
        }

        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);

        Alert.alert('Success', 'Signed in with Google!');
    } catch (error: any) {
        console.error('Google Sign-In error:', error);
        if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User cancelled Google Sign-In');
            return;
        }

        Alert.alert('Error', error.message || 'Google sign-in failed');
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

        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
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
        // Sign out from Firebase
        await auth().signOut();

        // Sign out from Google OAuth
        await GoogleSignin.signOut();

        console.log('User logged out successfully');
    } catch (error: any) {
        console.error('Google logout error:', error);
    }
};
