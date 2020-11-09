import React from "react";
import { observer } from "mobx-react-lite";
import { TextStyle, ViewStyle } from "react-native";
import { Header, Screen, Text } from "../../components";
import { useNavigation } from "@react-navigation/native";
// import { useStores } from "../../models"
import { color } from "../../theme";
import { palette } from "../../theme/palette";

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
};

const HEADER_TEXT_STYLE: TextStyle = {
  fontSize: 20,
  lineHeight: 22,
  color: palette.black
};

export const AwardsScreen = observer(function AwardsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  return (
    <Screen style={ROOT} preset="scroll">
      <Header
        headerText="Your awards"
        titleStyle={HEADER_TEXT_STYLE}
        leftIcon="back"
        onLeftPress={goBack}
      />
      <Text preset="header" text="awardsScreen" />
    </Screen>
  );
});
