import React from "react";
import { observer } from "mobx-react-lite";
import { View, ViewStyle } from "react-native";
import { Button, Screen } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models";
import { color } from "../../theme";
import auth from "@react-native-firebase/auth";
import { Avatar, Text } from "react-native-elements";

const FULL: ViewStyle = { flex: 1 };

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

const LOGOUT_STYLE: ViewStyle = {
  paddingTop: 50,
};

export const ProfileScreen = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  const { userStore } = useStores();

  async function signOut() {
    __DEV__ && console.log("signing out");
    try {
      userStore.signUserOut();
    } catch (e) {
      __DEV__ && console.log(e);
    }
  }

  return (
    <View style={FULL} testID="profileScreenWrap">
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
            <Button testID="logoutButton" text="log out" onPress={signOut}></Button>
          </View>
        </View>
      </Screen>
    </View>
  );
});
