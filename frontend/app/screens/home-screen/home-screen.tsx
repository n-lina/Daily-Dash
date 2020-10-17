import React from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Header, Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import auth from "@react-native-firebase/auth"

const FULL: ViewStyle = { flex: 1 }
const TEXT: TextStyle = {
  color: "black",
}
const HEADER_TEXT_STYLE: TextStyle = {
  ...TEXT,
  fontSize: 20,
  lineHeight: 22,
}

const HEADER_STYLE: ViewStyle = {}

const CONTENT: TextStyle = {
  ...TEXT,
}

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

export const HomeScreen = observer(function HomeScreen() {
  async function signOut() {
    __DEV__ && console.log("signing out")
    try {
      auth().signOut()
    } catch (e) {
      __DEV__ && console.log(e)
    }
  }
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={FULL}>
      <Screen style={FULL} preset="scroll" backgroundColor={color.transparent}>
        {/* <Header
          headerText="Daily Dash"
          titleStyle={HEADER_TEXT_STYLE}
          style={HEADER_STYLE}
        /> */}
        <View style={CONTENT_WRAP}>
          <Text style={CONTENT}>Hello World!</Text>
          <Button
            text="log ou"
            onPress={signOut}
          ></Button>
        </View>
      </Screen>
    </View>
  )
})
