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
const darkAqua = "#008080";
const aqua = "#46BFAC";


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
    height: 57,
    width: 57,
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
  // ...BOLD,
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
  const { goalsStore, LtGoalFormStore } = useStores();
  const navigation = useNavigation();
  const getSpecificGoal = (goal) => navigation.navigate("goalDetail", { id: goal.id });

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

  function addNewGoal() {
    LtGoalFormStore.clearForm();
    navigation.navigate("addGoal");
  }

  const renderGoal = ({ item, index }) => {
    const goal: Goal = item;

    return (
      <View>
        {/* <Text style={styles.LTgoal}> {goal.LTgoal}</Text> */}
        <ListItem onPress={() => getSpecificGoal(item)}>
          {/* <Avatar source={require('../../../assets/hiking.png')} /> */}
          <Avatar
            rounded
            icon={{ name: "tree", type: "font-awesome", color: aqua}}
            // overlayContainerStyle={styles.green}
            // activeOpacity={0.7}
            // containerStyle={{flex: 2, marginTop: 2}}
          />
          <ListItem.Content>
            <ListItem.Title>{goal.LTgoal}</ListItem.Title>
            <ListItem.Subtitle>{goal.description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron testID={"ltGoal" + index} />
        </ListItem>
      </View>
    );
  };

  return (
    <View style={FULL} testID="ltgWrap">
      {/*  <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}> */}
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   My Goals   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/mountain.png")} style={styles.image} />
        <SafeAreaView style={styles.flex}>
          <FlatList
            style={styles.flatlist}
            data={goalsStore.goals}
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
          testID="commonGoalsButton"
          // style={styles.button}
          text="Browse Common Goals"
          onPress={() => navigation.navigate("commonGoals")} />
        <Button
          testID="newGoalButton"
          // style={styles.button}
          text="Add New Goal"
          onPress={() => addNewGoal()} />
      </Screen>
    </View>
  );
});
