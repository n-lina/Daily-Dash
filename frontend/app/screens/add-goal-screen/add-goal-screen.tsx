import React from "react"
import {useState, useEffect} from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView} from "react-native"
import { Button, Header, Screen, Text, StGoal } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { StGoalForm, useStores } from "../../models"
import { color, spacing, typography} from "../../theme"
import { palette } from "../../theme/palette"
import HideWithKeyboard from "react-native-hide-with-keyboard"

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
  marginTop: spacing[8],
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

const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  color: palette.white,
  fontSize: 13,
  letterSpacing: 2,
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

  async function getSuggestion(){
    console.log(LtGoalFormStore.title)
    await goalsStore.getSTsuggestion(LtGoalFormStore.title)
    Alert.alert(goalsStore.STsuggestion)
    return 1
  }
  

  const {LtGoalFormStore, goalsStore } = useStores()
  const navigation = useNavigation()
 // const nextScreen = () => navigation.navigate("primaryStack.home")

  const {STgoalForm} = LtGoalFormStore

  const [showPickers, setPickers] = useState(false)

  useEffect(() => {
    if (LtGoalFormStore.STgoalForm.length == 0) LtGoalFormStore.addSTgoal()
    else {
      LtGoalFormStore.cleanPickers()
      setPickers(true);
    }
  }, [])

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
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
          {showPickers && STgoalForm.map((goal, index) => (< StGoal my_goal={goal} key={index}/>))}
          < Separator />
          <Button 
          style={{...styles.button, marginBottom: 110}}
          textStyle={BUTTON_TEXT}
          text="Add New ST Goal"
          onPress={() => LtGoalFormStore.addSTgoal()} />
        </ScrollView>
        <HideWithKeyboard>
          <Button 
            style={styles.button}
            textStyle={BUTTON_TEXT}
            text="Get Suggestion"
            onPress={() => getSuggestion()} />
          <Button 
            style={styles.button}
            textStyle={BUTTON_TEXT}
            text="Submit"
            onPress={() => submitForm(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} />
            {/* // onPress={() => goalsStore.postLTgoal(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} /> */}
            {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN*/}
        </HideWithKeyboard>
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
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    margin: 1,
    backgroundColor: "#008080",
  },
  sideByside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
