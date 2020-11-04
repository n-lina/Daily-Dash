import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, FlatList } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme";

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
  // justifyContent: "center",
};

const Separator = () => (
  <View style={styles.separator} />
);

const TEXT: TextStyle = {
  color: color.palette.black,
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
  marginTop: spacing[5],
};
const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 20,
  lineHeight: 30,
  textAlign: "center",
  marginBottom: spacing[5],
  marginLeft: spacing[3],
  marginRight: spacing[3],
};

const FULL: ViewStyle = {
  flex: 1
};

export const EditGoalScreen = observer(function EditGoalScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation();
  const nextScreen = () => navigation.navigate("primaryStack.home");

  return (
    <View style={FULL}>
      <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Edit Goal   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/compass.png")} style={styles.image} />
        < Separator />
        < Separator />
        <Text style={TITLE2} text="I want to ... " />
        < Separator />
        < Separator />
        {/* FORM FIELDS */}
        <Text style={TITLE2} text="Small tasks I can do regularly to achieve my goal include ..." />
        < Separator />
        < Separator />
        {/* FORM FIELDS */}
        <Button
          style={styles.button}
          text="Submit"
          onPress={() => navigation.navigate("signInScreen")} />
        {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN */}
      </Screen>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
  },
  image: {
    height: 50,
    width: 50,
  },
  separator: {
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  }
});
