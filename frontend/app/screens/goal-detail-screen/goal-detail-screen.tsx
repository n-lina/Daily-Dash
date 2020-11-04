import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, SectionList, Alert, SafeAreaView, Dimensions } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography } from "../../theme";
import { Goal, useStores } from "../../models";

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

export const GoalDetailScreen = observer(function GoalDetailScreen({ }) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation();
  const route = useRoute();
  console.log("banana" + JSON.stringify(route.params));
  const { LTgoal, STgoals } = route.params as Goal;
  console.log("banana" + LTgoal + " " + STgoals);

  // const LTgoal = "hello"
  // const STgoals = [{text: "hi", monday: [100], tuesday: [200], wednesday: [], thursday: [100], friday: [], saturday: [], sunday: []}, {text: "bye", monday: [24], tuesday: [225], wednesday: [], thursday: [10], friday: [88], saturday: [], sunday: []}]

  // const nextScreen = () => navigation.navigate("signInScreen")

  const monday = [];
  const tuesday = [];
  const wednesday = [];
  const thursday = [];
  const friday = [];
  const saturday = [];
  const sunday = [];

  for (const goal of STgoals) {
    if (goal.mon.length > 0) monday.push([goal.mon[0], goal.title]);
    if (goal.tue.length > 0) tuesday.push([goal.tue[0], goal.title]);
    if (goal.wed.length > 0) wednesday.push([goal.wed[0], goal.title]);
    if (goal.thu.length > 0) thursday.push([goal.thu[0], goal.title]);
    if (goal.fri.length > 0) friday.push([goal.fri[0], goal.title]);
    if (goal.sat.length > 0) saturday.push([goal.sat[0], goal.title]);
    if (goal.sun.length > 0) sunday.push([goal.sun[0], goal.title]);
  }

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  const allSTGoals = [
    {
      title: "Monday",
      data: monday.sort(sortFunction)
    },
    {
      title: "Tuesday",
      data: tuesday.sort(sortFunction)
    },
    {
      title: "Wednesday",
      data: wednesday.sort(sortFunction)
    },
    {
      title: "Thursday",
      data: thursday.sort(sortFunction)
    },
    {
      title: "Friday",
      data: friday.sort(sortFunction)
    },
    {
      title: "Saturday",
      data: saturday.sort(sortFunction)
    },
    {
      title: "Sunday",
      data: sunday.sort(sortFunction)
    }
  ];

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Delete Goal",
      "This cannot be undone.",
      [
        {
          text: "No",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );

  const Item = ({ title }) => {
    const mins = title[0] % 60;
    const hrs = Math.floor(title[0] / 60);

    return (
      <View style={styles.item}>
        <Text style={{ color: "#000" }}>{title[1]}</Text>
        <Text style={styles.right}>{hrs}:{mins}</Text>
      </View>
    );
  };

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE}>[   {LTgoal}   ]</Text>
        </Text>
        < Separator />
        <Image source={require("../../../assets/hiking.png")} style={styles.image} />
        < Separator />
        <SafeAreaView style={{ flex: 1 }}>
          <SectionList
            style={{ flex: 1, width: 350 }}
            sections={allSTGoals}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <View style={styles.fixToText}>
          {/* <Button
            style={styles.button}
            text="Edit"
            onPress={() => navigation.navigate("editGoal")}
          />
          <Button
            style={styles.button}
            text="Delete"
            onPress={createTwoButtonAlert}
          /> */}
        </View>
      </Screen>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    marginLeft: 10,
    marginRight: 10
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flatlist: {
    height: 400,
    marginTop: 40,
    overflow: "scroll",
    width: Dimensions.get("window").width - 20
  },
  header: {
    backgroundColor: "#f9f",
    flex: 1,
    fontSize: 32
  },
  image: {
    height: 75,
    width: 75,
  },
  item: {
    backgroundColor: "#fff",
    flexDirection: "row",
    flex: 1,
    marginVertical: 8,
    padding: 20
  },
  right: {
    color: "#000",
    flex: 1,
    textAlign: "right"
  },
  separator: {
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
});
