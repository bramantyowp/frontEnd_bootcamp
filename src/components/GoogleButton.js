import { View } from 'react-native';
import { useEffect } from 'react';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {GOOGLE_WEB_CLIENT_ID} from '@env';

GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
});

async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();
    // Try the new style of google-sign in result, from v13+ of that module
    let idToken = signInResult.data?.idToken;
    if (!idToken) {
        // if you are using older versions of google-signin, try old style result
        idToken = signInResult.idToken;
    }
    if (!idToken) {
        throw new Error('No ID token found');
    }
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.token);
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}

function onAuthStateChanged(user) {
    console.log(user)
    // if (initializing) setInitializing(false);
  }

export default function GoogleButton() {
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);

    return (
        <View>
            <GoogleSigninButton
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={onGoogleButtonPress}
                // disabled={isInProgress}
            />
        </View>
    )
}
