import React from "react";
import { View, ViewStyle, TextStyle, SafeAreaView, Image, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { observer } from "mobx-react-lite";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";

const darkAqua = "#008080";
const aqua = "#46BFAC";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const lightseagreen = "#616F6C";
const background = "#fff";

const styles = StyleSheet.create({
  button: {
    backgroundColor: aqua
  },
  heading: {
    color: lightseagreen,
    fontSize: 28,
    textAlign: "center"
  },
  image: {
    alignContent: "center",
    alignItems: "center",
    height: windowWidth,
    width: windowWidth,
  },
  image2: {
    height: 75,
    marginTop: spacing[6],
    width: 250
  },
  subheading: {
    color: lightseagreen,
    fontSize: 17,
    fontStyle: "italic",
    marginTop: spacing[3],
    textAlign: "center"
  }
});

const FULL: ViewStyle = { flex: 1, width: windowWidth };
const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: background,
  // paddingHorizontal: spacing[4],
  width: windowWidth
};
const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
};

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  // marginTop: spacing[5],
  backgroundColor: background,
  marginTop: spacing[7],
  // marginBottom: spacing[3]
};
const TITLE: TextStyle = {
  ...TEXT,
  // ...BOLD,
  fontSize: 31,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
  color: lightseagreen

};
const CONTINUE_TEXT: TextStyle = {
  ...TEXT,
  fontSize: 20,
  letterSpacing: 2,
  color: "white"
};
const FOOTER_CONTENT: ViewStyle = {
  marginBottom: spacing[6],
  marginTop: spacing[5],
  // paddingHorizontal: spacing[4],
  backgroundColor: background,
  alignItems: "center"
};

export const WelcomeScreen = observer(function WelcomeScreen() {
  const navigation = useNavigation();
  const nextScreen = () => navigation.navigate("signInScreen");

  return (
    <View style={FULL} testID="welcomeMessage">
      <Screen style={CONTAINER} preset="scroll" backgroundColor={background}>
        <Image source={require("../../../assets/dp.png")} style={styles.image} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="Welcome to Daily Dash !" />
        </Text>
        <View style={FOOTER_CONTENT}>
          <Button
            testID="nextScreenButton"
            style={styles.button}
            textStyle={CONTINUE_TEXT}
            tx="welcomeScreen.continue"
            onPress={nextScreen}
          />
          <Image source={require("../../../assets/running.png")} style={styles.image2} />
        </View>
      </Screen>
    </View>
  );
});
