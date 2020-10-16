import React from "react"
import { View, ViewStyle, TextStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text } from "../../components"
import { color, spacing, typography } from "../../theme"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from "@react-native-community/google-signin"
import { useStores } from "../../models"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  marginTop: spacing[5],
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

export const SigninScreen = observer(function SigninScreen() {

  const { userStore } = useStores()

  async function onGoogleButtonPress() {
    // Get the users ID token
  
    const { idToken } = await GoogleSignin.signIn()
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken)
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential).then(res => {
      res.user.getIdToken(true).then(token => {
        userStore.postUser(res.user.displayName, res.user.email, token)
      })
    })
  }

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Please select a sign in method" />
        </Text>
        <View style={CONTENT_WRAP}>
          <Button
            text="Google Sign-In"
            onPress={() =>
              onGoogleButtonPress()
                .then(() => console.log("Signed in with Google!"))
                .catch((err) => console.error(err))
            }
          />
        </View>
      </Screen>
    </View>
  )
})
