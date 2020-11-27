import React, { useState } from "react";
import { View, ViewStyle, TextStyle, Dimensions, Image } from "react-native";
import { observer } from "mobx-react-lite";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";
import auth from "@react-native-firebase/auth";
import { GoogleSignin, GoogleSigninButton } from "@react-native-community/google-signin";
import { useStores } from "../../models";

const darkAqua = "#008080";
const aqua = "#46BFAC";
// const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const lightseagreen = "#616F6C";
const background = "#fff";

const FULL: ViewStyle = { flex: 1 };
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
};
const TEXT: TextStyle = {
  fontFamily: typography.primary,
};
const BOLD: TextStyle = { fontWeight: "bold" };
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
};

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  alignItems: "center",
  marginTop:  windowHeight/4,
  // top: windowHeight/4
};
const TITLE: TextStyle = {
  ...TEXT,
  // ...BOLD,
  fontSize: 30,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  // justifyContent: "center",
  marginTop: spacing[5],
  alignItems: "center"
};

const SIGNIN_BUTTON: ViewStyle = {
  width: 200,
  height: 48, 
};

const CONT_TEXT: TextStyle = {
  ...TEXT,
  width: 300,
  marginTop: 20,
  marginBottom: 50,
  color: lightseagreen,
  textAlign: "center"
};

const INVISIBLE: ViewStyle = {
  position: "absolute",
  top: 0,
  height: 0,
  width: 0,
  left:10,
  backgroundColor: "white"
};

export const SigninScreen = observer(function SigninScreen() {
  const { userStore } = useStores();
  const [signingIn, setSigningIn] = useState(false);

  async function onGoogleButtonPress() {
    setSigningIn(true);
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential).then(res => {
      res.user.getIdToken(true).then(token => {
        __DEV__ && console.log(res.user.displayName, res.user.email, token);
        userStore.postUser(res.user.displayName, res.user.email, res.user.uid);
      });
    });
  }

  const testSignIn = () => {
    auth().signInWithEmailAndPassword("testuser2@testy.com", "123456").then(res => {
      res.user.getIdToken(true).then(() => {
        userStore.postUser("Bob sagget test user", res.user.email, res.user.uid);
      });
    }).catch(err => {
      __DEV__ && console.log("Failed to auth with test: " + err);
    });
  };

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" backgroundColor='white'>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Please Sign In" />
        </Text>
        <View style={CONTENT_WRAP} testID="signInWrap">
          <Button
            style={INVISIBLE}
            testID="testSignIn"
            onPress={testSignIn}
          />
          <Image source={require("../../../assets/boot.png")} style={{height: 50, width: 50, marginBottom: spacing[5]}} />
          <GoogleSigninButton
            style={SIGNIN_BUTTON}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            disabled={signingIn}
            onPress={() =>
              onGoogleButtonPress()
                .then(() => __DEV__ && console.log("Signed in with Google!"))
                .catch((err) => __DEV__ && console.error(err))
                .finally(() => setSigningIn(false))
            }
          />
          <Text style={CONT_TEXT}>
            By continuining, you are agreeing to our non-existent privacy policy.
          </Text>
        </View>
      </Screen>
    </View>
  );
});
