import React from "react";
import { observer } from "mobx-react-lite";
import { TextStyle, ViewStyle } from "react-native";
import { Screen, Text } from "../../components";
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"

const ROOT: ViewStyle = {
  flex: 1,
  alignContent: "center",
  justifyContent: "center"
};

const LOADING_TXT: TextStyle = {
  color: "black",
  textAlign: "center"
};

export const LoadingScreen = observer(function LoadingScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={ROOT} preset="scroll">
      <Text style={LOADING_TXT} text="loading..." />
    </Screen>
  );
});
