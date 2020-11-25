import React from "react";
import { observer } from "mobx-react-lite";
import { View, ViewStyle } from "react-native";
import { Button, Screen } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models";
import { color, spacing } from "../../theme";
import auth from "@react-native-firebase/auth";
import { Avatar, Text } from "react-native-elements";
// import DropDownPicker from "react-native-dropdown-picker";
import SwitchSelector from "react-native-switch-selector";

const darkAqua = "#008080";
const aqua = "#46BFAC";

const FULL: ViewStyle = { flex: 1 };

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

const LOGOUT_STYLE: ViewStyle = {
  paddingTop: 50,
};

const container: ViewStyle = {
  height: 35,
  width: 88
};

const flexStart: ViewStyle = {
  justifyContent: "flex-start"
};

const pickerColor = "#fafafa";

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
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            {/* <Text style={{ fontSize: 15, marginTop: 5, marginRight: 15 }}>Time mode: </Text> */}
            {/* <DropDownPicker
              items={[
                { label: "12 hr", value: 12 },
                { label: "24 hr", value: 24 }
              ]}
              defaultValue={userStore.timeMode}
              containerStyle={container}
              style={{ backgroundColor: pickerColor }}
              itemStyle={flexStart}
              dropDownStyle={{ backgroundColor: pickerColor }}
              onChangeItem={(item) => userStore.updateTimeMode(item.value)}
            /> */}
            <SwitchSelector
              style={{width: 130}}
              height={40}
              initial={0}
              onPress={value => userStore.updateTimeMode(value as number)}
              textColor='grey'
              selectedColor="#fff"
              buttonColor={aqua}
              borderColor={aqua}
              hasPadding={false}
              fontSize={15}
              bold={false}
              options={[
                { label: "12 HR", value: 12 },
                { label: "24 HR", value: 24 } 
              ]}
            />
          </View>
          <View style={LOGOUT_STYLE}>
            <Button testID="logoutButton" text="log out" onPress={signOut}></Button>
          </View>
        </View>
      </Screen>
    </View>
  );
});
