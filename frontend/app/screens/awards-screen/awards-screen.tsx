import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Dimensions, FlatList, Image, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Header, Screen, Text } from "../../components";
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme";
import { useStores } from "../../models";
import { Avatar, ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "../../theme/palette";

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center"
};

const Separator = () => (
  <View style={styles.separator} />
);

const FULL: ViewStyle = {
  flex: 1
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
  // ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
  letterSpacing: 2
};

const BACK_BUTTON: ViewStyle = {
  backgroundColor: palette.white,
};

const borderColor = "#737373";
const background = "#aba";

const styles = StyleSheet.create({
  background: {
    backgroundColor: background
  },
  flatlist: {
    height: 400,
    marginTop: 40,
    overflow: "scroll",
    width: Dimensions.get("window").width - 20
  },
  flex: {
    flex: 1
  },
  image: {
    height: 50,
    width: 50,
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  }
});

const BACK_BUTTON: ViewStyle = {
  backgroundColor: palette.white,
};

export const AwardsScreen = observer(function AwardsScreen() {
  // Pull in one of our MST stores
  const { userStore } = useStores();
  const navigation = useNavigation();

  const onBackPress = () => navigation.navigate("profile");


  const renderAward = ({ item }) => {
    const title: string = item.title;
    const description: string = item.description;

    return (
      <View>
        <ListItem>
          <Avatar
            rounded
            icon={{ name: "star", type: "font-awesome", color: "gold", size: 23 }}

          />
          <ListItem.Content>
            <ListItem.Title>{title}</ListItem.Title>
            <ListItem.Subtitle>{description}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  const navigation = useNavigation();
  const onBackPress = () => navigation.goBack();

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} buttonStyle={BACK_BUTTON} leftIcon="back" onLeftPress={onBackPress} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   My Awards   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/trophy.png")} style={styles.image} />
        < Separator />
        <SafeAreaView style={styles.flex}>
          <FlatList
            style={styles.flatlist}
            data={userStore.getAwards()}
            renderItem={renderAward}
            extraData={{
              extraDataForMobX:
                userStore.getAwards().length > 0 ? userStore.getAwards()[0][0] : "",
            }}
            keyExtractor={(_, index) => "" + index}
          ></FlatList>
        </SafeAreaView>
      </Screen>
    </View>
  );
});
