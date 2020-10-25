import React from "react"
import {useState, useEffect} from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView} from "react-native"
import { Button, Header, Screen, Text, StGoal } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { StGoalForm, useStores } from "../../models"
import { color, spacing, typography} from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
 // justifyContent: "center",
}

const Separator = () => (
  <View style={styles.separator} />
);

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  marginTop: spacing[5],
}
const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 15,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
  marginLeft: spacing[3],
  marginRight: spacing[3],
}

const FULL: ViewStyle = { 
  flex: 1 
}

export const AddGoalScreen = observer(function AddGoalScreen()  {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  function convertSTgoals(fromForm: Array<StGoalForm>){
    var my_st_goal = []
    for (let goal of fromForm){
      console.log("orange " + JSON.stringify(goal))
      var time = [convertTimeToMin(goal.hour, goal.minute)]
      my_st_goal.push({
        title: goal.title,
        [goal.day]: time,
      })
    }
    // console.log(my_st_goal)
    return my_st_goal
  }

  function convertTimeToMin(hr: number, min: number){
    return (hr*60) + min
  }

  function submitForm(LTgoal: string, description: string, fromForm: Array<StGoalForm>){
    var my_st_goal = convertSTgoals(fromForm)
    goalsStore.postLTgoal(LTgoal, description, my_st_goal)
    LtGoalFormStore.clearForm()
    console.log("cleared")
    navigation.navigate("allGoals")
    return 1
  }

  function getSuggestion(){
    goalsStore.getSTsuggestion(LtGoalFormStore.title)
    console.log(goalsStore.STsuggestion)
    Alert.alert(goalsStore.STsuggestion)
    return 1
  }
  

  const {LtGoalFormStore, goalsStore } = useStores()
  const navigation = useNavigation()
 // const nextScreen = () => navigation.navigate("primaryStack.home")

  const {STgoalForm} = LtGoalFormStore

  useEffect(() => {
    if (LtGoalFormStore.STgoalForm.length == 0) LtGoalFormStore.addSTgoal()
  }, [])

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Add New Goal   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/compass.png")} style={styles.image} />
        < Separator />
        < Separator />
        <ScrollView contentContainerStyle={{alignItems: "center"}}>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="My goal is to .. " />
            <TextInput 
              style={{ height: 40, fontSize: 15}}
              onChangeText={text => LtGoalFormStore.setTitle(text)}
              placeholder="be a happier person."
            />
          </View>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="Description:" />
            <TextInput 
              style={{ height: 40, fontSize: 15}}
              onChangeText={text => LtGoalFormStore.setDescription(text)}
              placeholder="(Optional) I do better when I'm happy."
            />
          </View>
          <Text style={TITLE2} text="Regular Habits: " />
          {STgoalForm.map((goal, index) => (< StGoal my_goal={goal} key={index}/>))}
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
          {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN*/}
      </Screen>
    </View>
  )
})

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width:50,
    height:50,
  },
  button: {
  },
  sideByside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
