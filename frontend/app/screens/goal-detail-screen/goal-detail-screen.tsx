import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, SectionList, Alert, SafeAreaView } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";
import { Goal, useStores } from "../../models";

const borderColor = "#737373";
const white = "#fff";
const black = "#000";
const background = "#f9f";

const styles = StyleSheet.create({
  black: {
    color: black
  },
  button: {
    marginLeft: 10,
    marginRight: 10
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1
  },
  header: {
    backgroundColor: background,
    flex: 1,
    fontSize: 32
  },
  image: {
    height: 75,
    width: 75,
  },
  item: {
    backgroundColor: white,
    flexDirection: "row",
    flex: 1,
    marginVertical: 8,
    padding: 20
  },
  right: {
    color: black,
    flex: 1,
    textAlign: "right"
  },
  sectionList: {
    flex: 1,
    width: 350
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

export const GoalDetailScreen = observer(function GoalDetailScreen() {
  const { LtGoalFormStore,goalsStore} = useStores()

  const navigation = useNavigation();
  const route = useRoute();
  console.log(JSON.stringify(route.params));
  const { LTgoal, STgoals, description, id} = route.params as Goal;
  console.log(LTgoal + " " + STgoals);

  function editThisGoal() {
    LtGoalFormStore.clearForm()

    LtGoalFormStore.setTitle(LTgoal)
    LtGoalFormStore.setId(id)
    LtGoalFormStore.setDescription(description)

    for (const day of [[monday,"mon"], [tuesday,"tue"], [wednesday,"wed"], [thursday,"thu"], [friday,"fri"], [saturday,"sat"], [sunday,"sun"]]){
      const arr = day[0]
      const weekday = day[1] as string
      for (const STgoal of arr){
        const mins = (STgoal[0] % 60).toString();
        const hrs = (Math.floor(STgoal[0]/ 60)).toString();
        LtGoalFormStore.initSTgoals(STgoal[1], weekday, hrs, mins, STgoal[2])
      }
    }

    navigation.navigate("editGoal")

  }

  const monday = [];
  const tuesday = [];
  const wednesday = [];
  const thursday = [];
  const friday = [];
  const saturday = [];
  const sunday = [];

  for (const goal of STgoals) {
    if (goal.mon.length > 0) monday.push([goal.mon[0], goal.title, goal.id]);
    if (goal.tue.length > 0) tuesday.push([goal.tue[0], goal.title, goal.id]);
    if (goal.wed.length > 0) wednesday.push([goal.wed[0], goal.title, goal.id]);
    if (goal.thu.length > 0) thursday.push([goal.thu[0], goal.title,, goal.id]);
    if (goal.fri.length > 0) friday.push([goal.fri[0], goal.title, goal.id]);
    if (goal.sat.length > 0) saturday.push([goal.sat[0], goal.title, goal.id]);
    if (goal.sun.length > 0) sunday.push([goal.sun[0], goal.title, goal.id]);
  }

  function deleteThisGoal(goalId){
    goalsStore.deleteLTgoal(id)
    navigation.navigate("allGoals")
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
          style: "cancel"
        },
        { text: "Yes", onPress: () => deleteThisGoal(id)}
      ],
      { cancelable: false }
    );

  const Item = ({ title }) => {
    let minsStr = ""

    const mins = title[0] % 60;
    if (Math.floor(mins/10) === 0) {
      minsStr = "0" + mins.toString();
    }
    else{
      minsStr = mins.toString();
    }
    const hrs = (Math.floor(title[0] / 60)).toString();
    return (
      <View style={styles.item}>
        <Text style={styles.black}>{title[1]}</Text>
        <Text style={styles.right}>{hrs}:{minsStr}</Text>
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
        <SafeAreaView style={styles.flex}>
          <SectionList
            style={styles.sectionList}
            sections={allSTGoals}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <View style={styles.fixToText}>
          <Button
            style={styles.button}
            text="Edit"
            onPress={() => editThisGoal()}
          />
          <Button
            style={styles.button}
            text="Delete"
            onPress={createTwoButtonAlert}
          />
        </View>
      </Screen>
    </View>
  );
});
