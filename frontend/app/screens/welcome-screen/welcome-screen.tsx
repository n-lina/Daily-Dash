import React from "react";
import { View, ViewStyle, TextStyle, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";

const FULL: ViewStyle = { flex: 1 };
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
};
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
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const CONTENT: TextStyle = {
  ...TEXT,
  color: "#2f4f4f",
  fontSize: 15,
  lineHeight: 22,
  marginBottom: spacing[3],
};
const CONTINUE: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
  backgroundColor: "#008080",
};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 13,
  letterSpacing: 2,
};
const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  justifyContent: "center"
};
const FOOTER: ViewStyle = {};
const FOOTER_CONTENT: ViewStyle = {
  paddingVertical: spacing[4],
  paddingHorizontal: spacing[4],
};

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation();
  const nextScreen = () => navigation.navigate("signInScreen");

  return (
    <View style={FULL}>
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Welcome to Daily Dash" />
        </Text>
        <Text style={TITLE} preset="header" tx="welcomeScreen.readyForLaunch" />
        {/* <Image source={bowserLogo} style={BOWSER} /> */}
        <View style={CONTENT_WRAP} testID="welcomeMessage">
          <Text style={CONTENT}>This is just a template for what should go here.</Text>
          <Text style={CONTENT}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pharetra aliquet
            risus, venenatis sollicitudin neque scelerisque vel. Phasellus tortor erat, molestie
            eget accumsan sit amet, efficitur gravida ante.
          </Text>
        </View>
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="nextScreenButton"
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
            onPress={nextScreen}
          />
        </View>
      </SafeAreaView>
    </View>
  );
});
