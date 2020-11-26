import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Dimensions, FlatList, Image, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Header, Screen, Text } from "../../components";
import { useNavigation } from "@react-navigation/native";
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme";
import { useStores } from "../../models";
import { Avatar, ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

const darkAqua = "#008080";
const aqua = "#46BFAC";


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
    height: 55,
    width: 55,
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  }
});

export const CommonGoalsScreen = observer(function CommonGoalsScreen() {
  // Pull in one of our MST stores
  const { goalsStore } = useStores();
  const navigation = useNavigation();
  const getSpecificGoal = (goal) => navigation.navigate("commonGoalDetail", { id: goal.id });

  const renderGoal = ({ item }) => {
    const title: string = item.LTgoal;
    const description: string = item.description;
    const id: string = item.id;

    return (
      <View>
        <ListItem onPress={() => getSpecificGoal(item)}>
          {/* <Avatar source={require('../../../assets/hiking.png')} /> */}
          <Avatar
            rounded
            icon={{ name: "tree", type: "font-awesome", color: aqua }}
            // overlayContainerStyle={styles.background}
            // activeOpacity={0.7}
          />
          <ListItem.Content>
            <ListItem.Title style={{textTransform:'capitalize'}}>{title}</ListItem.Title>
            <ListItem.Subtitle>{description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    );
  };

  // const navigation = useNavigation();
  // const goBack = () => navigation.goBack();

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Common Goals   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/park.png")} style={styles.image} />
        {/* < Separator /> */}
        <SafeAreaView style={styles.flex}>
          <FlatList
            style={styles.flatlist}
            data={goalsStore.listOfGoals}
            renderItem={renderGoal}
            keyExtractor={(item) => "" + item.id}
            // onRefresh={() => userStore.getAwards()}
            // refreshing={refreshing}
          ></FlatList>
        </SafeAreaView>
      </Screen>
    </View>
  );
});
