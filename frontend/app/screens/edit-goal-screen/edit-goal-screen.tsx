import React from "react";

import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView } from "react-native";
import { Button, Header, Screen, Text, StGoal } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { StGoalForm, useStores } from "../../models";
import { color, spacing, typography } from "../../theme";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import { getDay } from "../../utils/getDay";

const borderColor = "#737373";

const styles = StyleSheet.create({
  button: {
    marginBottom: 110
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
  },
  textInputTitle: {
    alignContent: "center",
    flex: 1,
    fontSize: 15,
    height: 40,
    justifyContent: "flex-end",
    textAlign: "left"
  }
});

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
};

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
  // justifyContent: "center",
};

const Separator = () => (
  <View style={styles.separator} />
);

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

  const { LtGoalFormStore, goalsStore, dailyGoalStore } = useStores();

  function convertTimeToMin(hr: number, min: number) {
    return (hr * 60) + min;
  }

  function convertSTgoals(fromForm: Array<StGoalForm>) {
    const myStGoal = [];
    for (const goal of fromForm) {
      if (goal.hour == "" || goal.minute == "" || goal.title == "") {
        return [];
      }
      else{
        const time = [convertTimeToMin(parseInt(goal.hour), parseInt(goal.minute))];
        myStGoal.push({
          title: goal.title,
          [goal.day]: time,
        });
      }
    }
    __DEV__ && console.log(myStGoal);
    return myStGoal;
  }

  const navigation = useNavigation();

  function submitForm(LTgoal: string, description: string, fromForm: Array<StGoalForm>, goalID: string) {
    const myStGoal = convertSTgoals(fromForm);
    if (myStGoal.length == 0 || LTgoal == ""){
      Alert.alert("Please fill in all required fields before submitting.")
      return false;
    }
    if (description == "") description = " "
    goalsStore.putLTgoal(LTgoal, goalID, description, myStGoal).then(res => {
      goalsStore.getAllGoals();
      dailyGoalStore.getGoalsForDay(getDay(true));
    });
    LtGoalFormStore.clearForm();
    navigation.navigate("allGoals");
    return 1;
  }

  async function getSuggestion() {
    await goalsStore.getSTsuggestion(LtGoalFormStore.title);
    Alert.alert(goalsStore.STsuggestion);
    return 1;
  }

  const { STgoalForm } = LtGoalFormStore;

  return (
    <View style={FULL} testID="editGoalWrap">
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
            <Text style={TITLE2} text="My goal is to: " />
            <TextInput
              testID="titleInput"
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setTitle(text)}
              placeholder="be a happier person."
              defaultValue={LtGoalFormStore.title}
              maxLength={50}
            />
          </View>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="Description:" />
            <TextInput
              testID="descriptionInput"
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setDescription(text)}
              placeholder="(Optional) I do better when I'm happy."
              defaultValue={LtGoalFormStore.description}
              maxLength={100}
            />
          </View>
          <Text style={TITLE2} text="Regular Habits: " />
          {STgoalForm.map((goal, index) => (< StGoal myGoal={goal} key={index} index={index}/>))}
          < Separator />
          <View style={styles.sideByside}>
            <Button
              testID="newSTGButton"
              style={{ ...styles.button }}
              text="Add Habit"
              onPress={() => LtGoalFormStore.addSTgoal()} />
            <Button
              testID="deleteSTGButton"
              style={{ ...styles.button }}
              text="Delete Habit"
              onPress={() => LtGoalFormStore.deleteSTgoal()} />
          </View>

        </ScrollView>
        <HideWithKeyboard>
          <Button
            testID="suggestionButton"
            text="Get Suggestion"
            onPress={() => getSuggestion()} />
          <Button
            testID="submitGoalButton"
            text="Submit"
            onPress={() => submitForm(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm, LtGoalFormStore.id)} />
        </HideWithKeyboard>
      </Screen>
    </View>
  );
});
