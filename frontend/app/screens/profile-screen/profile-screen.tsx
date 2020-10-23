import React from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"
import auth from "@react-native-firebase/auth"
import { Avatar, Text, Button } from "react-native-elements"

const FULL: ViewStyle = { flex: 1 }
const TEXT: TextStyle = {
  color: "black",
}

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const LOGOUT_STYLE: ViewStyle = {
  paddingTop: 50,
}

const LOGOUT_BUTTON: ViewStyle = {
  backgroundColor: "#008080"
}

export const ProfileScreen = observer(function ProfileScreen() {
  async function signOut() {
    __DEV__ && console.log("signing out")
    try {
      userStore.signUserOut();
    } catch (e) {
      __DEV__ && console.log(e)
    }
  }
  // Pull in one of our MST stores
  const { userStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={FULL}>
      <Screen style={FULL} preset="scroll" backgroundColor={color.transparent}>
        <View style={CONTENT_WRAP}>
          <Avatar
            rounded
            icon={{ name: "user", type: "font-awesome", color: "grey" }}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
            size="large"
            containerStyle={{}}
          />
          <Text h3>Welcome {userStore.name}</Text>
          <Text>{__DEV__ && auth().currentUser.uid}</Text>
          <View style={LOGOUT_STYLE}>
            <Button buttonStyle={LOGOUT_BUTTON} title="log out" onPress={signOut}></Button>
          </View>
        </View>
      </Screen>
    </View>
  )
})
