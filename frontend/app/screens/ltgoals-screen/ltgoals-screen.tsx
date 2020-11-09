import React, { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, FlatList, Dimensions, SafeAreaView } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
import { Goal, useStores } from "../../models";
import { color, spacing, typography } from "../../theme";
import { ListItem, Avatar } from "react-native-elements";

const borderColor = "#737373";
const background = "#aba";

const styles = StyleSheet.create({
  LTgoal: {
    marginLeft: 10,
    marginTop: 1
  },
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
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const FULL: ViewStyle = {
  flex: 1
};

export const LtgoalsScreen = observer(function LtgoalsScreen() {
  // Pull in one of our MST stores

  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const { goalsStore } = useStores();
  const navigation = useNavigation();
  // how to pass the item in here from the renderGoal function?
  const getSpecificGoal = (goal) => navigation.navigate("goalDetail", { LTgoal: goal.LTgoal, STgoals: goal.STgoals, description: goal.description, id: goal.id });
  //  const getSpecificGoal = (goal) => console.log(goal);

  const [refreshing, setRefreshing] = useState(false);

  const fetchGoals = () => {
    setRefreshing(true);
    goalsStore.getAllGoals().then(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    if (goalsStore.goals.length === 0) { fetchGoals(); }
  }, []);

  // const DATA = [{LTgoal: "example", description: "asdfasdf", STgoals: [{text: "hi", monday: [100], tuesday: [200], wednesday: [], thursday: [100], friday: [], saturday: [], sunday: []}, {text: "bye", monday: [24], tuesday: [225], wednesday: [], thursday: [10], friday: [88], saturday: [], sunday: []}], id: "1"}, {LTgoal: "example2", description: "kdkdkdk", STgoals: [{text: "hi", monday: [100], tuesday: [200], wednesday: [], thursday: [100], friday: [], saturday: [], sunday: []}, {text: "bye", monday: [24], tuesday: [225], wednesday: [], thursday: [10], friday: [88], saturday: [], sunday: []}], id: "2"}, {LTgoal: "example3", description: "uuuuuu", STgoals: [{text: "hi", monday: [100], tuesday: [200], wednesday: [], thursday: [100], friday: [], saturday: [], sunday: []}, {text: "bye", monday: [24], tuesday: [225], wednesday: [], thursday: [10], friday: [88], saturday: [], sunday: []}], id: "3"}]

  const renderGoal = ({ item }) => {
    const goal: Goal = item;

    return (
      <View>
        <Text style={styles.LTgoal}> {goal.LTgoal}</Text>
        <ListItem onPress={() => getSpecificGoal(item)}>
          {/* <Avatar source={require('../../../assets/hiking.png')} /> */}
          <Avatar
            rounded
            icon={{ name: "tree", type: "font-awesome" }}
            onPress={() => console.log("Works!")}
            overlayContainerStyle={styles.background}
            activeOpacity={0.7}
            // containerStyle={{flex: 2, marginTop: 2}}
          />
          <ListItem.Content>
            <ListItem.Title>{goal.LTgoal}</ListItem.Title>
            <ListItem.Subtitle>{goal.description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    );
  };

  return (
    <View style={FULL}>
      {/*  <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}> */}
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   My Goals   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/mountain.png")} style={styles.image} />
        < Separator />
        {/* <Button
          text="Click Me"
          onPress={() => console.log("Button pressed!")} /> */}
        {/* FETCH DATA FROM API AND RENDER FROM FLATLIST */}
        <SafeAreaView style={styles.flex}>
          <FlatList
            style={styles.flatlist}
            data={goalsStore.goals}
            // data={DATA}
            renderItem={renderGoal}
            extraData={{
              extraDataForMobX:
                goalsStore.goals.length > 0 ? goalsStore.goals[0].LTgoal : "",
            }}
            keyExtractor={(item) => item.id}
            onRefresh={fetchGoals}
            refreshing={refreshing}
          ></FlatList>
        </SafeAreaView>
        <Button
          // style={styles.button}
          text="Add New Goal"
          onPress={() => navigation.navigate("addGoal")} />
      </Screen>
    </View>
  );
});
