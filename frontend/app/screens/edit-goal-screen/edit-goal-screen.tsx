import React, { useEffect } from "react";

import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView } from "react-native";
import { Button, Header, Screen, Text, StGoal } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { StGoalForm, useStores } from "../../models";
import { color, spacing, typography } from "../../theme";
import { Goal } from "../../models";

const borderColor = "#737373";

const styles = StyleSheet.create({
  button: {
  },
  content: {
    alignItems: "center"
  },
  image: {
    height: 55,
    width: 55,
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  sideByside: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    fontSize: 15,
    height: 40
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
// const BOLD: TextStyle = { fontWeight: "bold" };

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
  fontSize: 15,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
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
  
  const { LtGoalFormStore, goalsStore } = useStores();

  function convertTimeToMin(hr: number, min: number) {
    return (hr * 60) + min;
  }

  function convertSTgoals(fromForm: Array<StGoalForm>) {
    const myStGoal = [];
    for (const goal of fromForm) {
      console.log("orange " + JSON.stringify(goal));
      const time = [convertTimeToMin(goal.hour, goal.minute)];
      myStGoal.push({
        title: goal.title,
        [goal.day]: time,
      });
    }
    // console.log(myStGoal)
    return myStGoal;
  }

  const navigation = useNavigation();
  // const nextScreen = () => navigation.navigate("primaryStack.home")
  const route = useRoute();
  console.log(JSON.stringify(route.params));
  const {    
    LTgoal,  
    mon, 
    tue, 
    wed, 
    thu, 
    fri, 
    sat, 
    sun, 
    description, 
    id
  } = route.params as {LTgoal: string, mon: any[],tue: any[], wed:any[],thu:any[], fri:any[], sat:any[],sun:any[], description: string, id: string};
  console.log(LTgoal + "/ " + mon + "/ " + tue + "/ " + wed + "/ " + thu + "/ " + fri + "/ " + sat + "/ " + sun+"/ "+description+"/ "+id);

  function submitForm(LTgoal: string, description: string, fromForm: Array<StGoalForm>) {
    const myStGoal = convertSTgoals(fromForm);
    goalsStore.postLTgoal(LTgoal, description, myStGoal);
    LtGoalFormStore.clearForm();
    console.log("cleared");
    navigation.navigate("allGoals");
    return 1;
  }

  function initialize(
    LTgoal: string, 
    description: string, 
    mon: any[],
    tue: any[],
    wed: any[], 
    thu: any[], 
    fri: any[], 
    sat: any[], 
    sun: any[]
    ){
    LtGoalFormStore.setTitle(LTgoal)
    console.log(LtGoalFormStore.title)
    LtGoalFormStore.setDescription(description)
    console.log(LtGoalFormStore.description)
    
    for (const day of [[mon,"mon"], [tue,"tue"], [wed,"wed"], [thu,"thu"], [fri,"fri"], [sat,"sat"], [sun,"sun"]]){
      const arr = day[0]
      const weekday = day[1] as string
      for (const STgoal of arr){
        const mins = STgoal[0] % 60;
        const hrs = Math.floor(STgoal[0]/ 60);
        LtGoalFormStore.initSTgoals(STgoal[1], weekday, hrs, mins)
      }
    }    
  }

  async function getSuggestion() {
    console.log(LtGoalFormStore.title);
    await goalsStore.getSTsuggestion(LtGoalFormStore.title);
    Alert.alert(goalsStore.STsuggestion);
    return 1;
  }

  const { STgoalForm } = LtGoalFormStore;

  useEffect(() => {
    if (LtGoalFormStore.STgoalForm.length === 0) initialize(LTgoal, description, mon, tue, wed, thu, fri, sat, sun);
  }, []);

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Edit Goal   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/map.png")} style={styles.image} />
        < Separator />
        < Separator />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="My goal is to .. " />
            <TextInput
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setTitle(text)}
              placeholder="be a happier person."
            />
          </View>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="Description:" />
            <TextInput
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setDescription(text)}
              placeholder="(Optional) I do better when I'm happy."
            />
          </View>
          <Text style={TITLE2} text="Regular Habits: " />
          {STgoalForm.map((goal, index) => (< StGoal myGoal={goal} key={index}/>))}
          < Separator />
        </ScrollView>
        <Button
          style={styles.button}
          text="Add New ST Goal"
          onPress={() => LtGoalFormStore.addSTgoal()} />
        <Button
          style={styles.button}
          text="Get Suggestion"
          onPress={() => getSuggestion()} />
        <Button
          style={styles.button}
          text="Submit"
          onPress={() => submitForm(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} />
        {/* // onPress={() => goalsStore.postLTgoal(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} /> */}
        {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN */}
      </Screen>
    </View>
  );
});
