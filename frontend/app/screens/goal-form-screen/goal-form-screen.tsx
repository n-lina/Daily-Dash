import React, { useEffect } from "react";

import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView } from "react-native";
import { Button, Header, Screen, Text, StGoal } from "../../components";
import { StGoalForm, useStores } from "../../models";
import { color, spacing, typography } from "../../theme";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import { getDay } from "../../utils/getDay";
import { palette } from "../../theme/palette";

const borderColor = "#737373";
const aqua = "#46BFAC";

const styles = StyleSheet.create({
  button: {
    backgroundColor: aqua,
    marginLeft: spacing[1],
    marginRight: spacing[1]
  },
  buttonNewHabit: {
    backgroundColor: aqua,
    marginBottom: 90,
    marginLeft: spacing[1],
    marginRight: spacing[1]
  },
  buttonText: {
    fontSize: 14,
  },
  content: {
    alignItems: "center"
  },
  fixToText: {
    flexDirection: "row"
  },
  image: {
    height: 50,
    width: 50,
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  sideByside: {
    flexDirection: "row"
  },
  textInput: {
    fontSize: 16,
    height: 40,
    maxWidth: 250
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
};

const BACK_BUTTON: ViewStyle = {
  backgroundColor: palette.white,
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
  letterSpacing: 2
};

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 17,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
  marginLeft: spacing[3],
  marginRight: spacing[3],
};

const FULL: ViewStyle = {
  flex: 1
};

const GetImage = (props: GoalFormProps) => {
  if (props.purpose === "edit") {
    return <Image
      source={require("../../../assets/map.png")}
      style={styles.image}
    />;
  } else {
    return <Image
      source={require("../../../assets/compass.png")}
      style={styles.image}
    />;
  }
};

const Separator = () => (
  <View style={styles.separator} />
);

export interface myList {
  stgList: any
  timeMode: number
}
const StGoalsView = observer((props: myList) => (
  <View>
    {props.stgList.map((goal, index) => (< StGoal myGoal={goal} key={index} index={index} timeMode={props.timeMode}/>))}
  </View>
));

interface GoalFormProps {
  purpose: "add" | "edit"
}

export const GoalFormScreen = observer(function GoalFormScreen() {
  const { LtGoalFormStore, goalsStore, dailyGoalStore, userStore } = useStores();

  function convertTimeToMin(hr: number, min: number, meridies: string) {
    if (userStore.timeMode === 12 && meridies === "pm" && hr < 12) hr += 12;
    if (userStore.timeMode === 12 && meridies === "am" && hr === 12) hr = 0;
    return (hr * 60) + min;
  }

  function convertSTgoals(fromForm: Array<StGoalForm>) {
    const allStGoals = [];
    for (const goal of fromForm) {
      if (goal.title == "") return [];
      const currStGoal = {
        title: goal.title,
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
      };

      for (const timeSlot of goal.timeForm) {
        if (timeSlot.hour == "" || timeSlot.minute == "") {
          return [];
        } else {
          const time = convertTimeToMin(parseInt(timeSlot.hour), parseInt(timeSlot.minute), timeSlot.meridies);
          currStGoal[`${timeSlot.day}`].push(time);
        }
      }

      for (const key in currStGoal) {
        if (currStGoal[key] == []) delete currStGoal[`${key}`];
      }

      allStGoals.push(currStGoal);
    }
    console.log(allStGoals);
    return allStGoals;
  }

  const { purpose } = (useRoute().params as GoalFormProps);
  const navigation = useNavigation();

  function submitForm(LTgoal: string, description: string, fromForm: Array<StGoalForm>, goalID: string) {
    const myStGoal = convertSTgoals(fromForm);
    if (myStGoal.length == 0 || LTgoal == "") {
      Alert.alert("Please fill in all required fields before submitting.");
      return false;
    }
    if (description == "") description = " ";

    let submitPromise: Promise<void>;
    if (purpose === "add") {
      submitPromise = goalsStore.postLTgoal(LTgoal, description, myStGoal);
    } else {
      submitPromise = goalsStore.putLTgoal(LTgoal, goalID, description, myStGoal);
    }

    submitPromise.then(() => {
      goalsStore.getAllGoals();
      dailyGoalStore.getGoalsForDay(getDay(true));
    });

    LtGoalFormStore.clearForm();
    navigation.navigate("allGoals");
    return 1;
  }

  const getTitle = () => {
    if (purpose === "add") {
      return "Add New";
    } else {
      return "Edit";
    }
  };
  purpose.charAt(0).toUpperCase() + purpose.slice(1);

  const NO_SUGGESTION = "No suggested short term goal";

  const shortTermGoalAlreadyPresent = (message: string) => {
    return LtGoalFormStore.STgoalForm.filter(g => g.title === message).length > 0
  }

  const createTwoButtonAlert = (message: string) => {
    if (!message || message.includes(NO_SUGGESTION) || shortTermGoalAlreadyPresent(message)) {
      Alert.alert("Sorry, no available suggestion", null, [{text: "Dismiss", style: "cancel"}],);
    } else {
      Alert.alert(
        "Suggestion: ",
        message,
        [
          {
            text: "Dismiss",
            style: "cancel"
          },
          { text: "Add", onPress: () => LtGoalFormStore.initSTgoals(message, getDay(true), "", "", "") }
        ],
        { cancelable: false }
      );
    }
  };

  async function getSuggestion() {
    await goalsStore.getSTsuggestion(LtGoalFormStore.title);
    createTwoButtonAlert(goalsStore.STsuggestion);
    return 1;
  }

  const { STgoalForm } = LtGoalFormStore;

  useEffect(() => {
    if (LtGoalFormStore.STgoalForm.length === 0) {
      LtGoalFormStore.addSTgoal();
    }
  }, []);

  const onBackPress = () => navigation.navigate("allGoals");

  return (
    <View style={FULL} testID="goalFormWrap">
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} buttonStyle={BACK_BUTTON} leftIcon="back" onLeftPress={onBackPress}/>
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text={"[   " + getTitle() + " Goal   ]"} />
        </Text>
        < Separator />
        < Separator />
        <GetImage purpose={purpose}/>
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
              placeholder="I do better when I'm happy."
              defaultValue={LtGoalFormStore.description}
              maxLength={100}
            />
          </View>
          <Text style={TITLE2} text="Regular Habits: " />
          < StGoalsView stgList={STgoalForm} timeMode={userStore.timeMode} />
          {/* {STgoalForm.map((goal, index) => (< StGoal myGoal={goal} key={index} index={index} timeMode={userStore.timeMode}/>))} */}
          < Separator />
          <View style={styles.sideByside}>
            <Button
              testID="newSTGButton"
              text="Add Habit"
              style={{ ...styles.buttonNewHabit }}
              textStyle = {{ ...styles.buttonText }}
              onPress={() => LtGoalFormStore.addSTgoal()} />
          </View>
        </ScrollView>
        <HideWithKeyboard>
          <View style={styles.fixToText}>
            <Button
              testID="suggestionButton"
              text="Get Suggestion"
              onPress={() => getSuggestion()} />
            <Button
              testID="submitGoalButton"
              text="Submit"
              onPress={() => submitForm(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm, LtGoalFormStore.id)} />
          </View>
        </HideWithKeyboard>
      </Screen>
    </View>
  );
});
