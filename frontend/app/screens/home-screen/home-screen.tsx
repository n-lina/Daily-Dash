import React from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { DailyGoal, useStores } from "../../models"
import { color } from "../../theme"
import { CheckBox, ListItem, Text } from "react-native-elements"
import * as Progress from "react-native-progress"
import Swipeable from "react-native-gesture-handler/Swipeable"

const progressWidth = 280
const circleSize = 44

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const getCurrentDay = (getShort: boolean) => {
  var day = weekDays[new Date().getDay()]
  if (getShort) {
    return day.toLowerCase().substring(0, 3)
  }
  return day
}

const FULL: ViewStyle = { flex: 1 }
const TEXT: TextStyle = {
  color: "black",
}

const CONTENT_WRAP: ViewStyle = {
  alignItems: "center",
}

const MULTIPLER_STYLE: TextStyle = {
  ...TEXT,
  marginTop: 5,
}

const NEXT_MULT_STYLE: ViewStyle = {
  alignItems: "flex-start",
  width: progressWidth,
  marginTop: 2,
}

const LEVEL_WRAP: ViewStyle = {
  width: progressWidth,
  marginTop: 20,
}

const MULTIPLIER_WRAP: ViewStyle = {
  width: progressWidth,
  overflow: "visible",
}

const LEVEL_STYLE: ViewStyle = {
  width: circleSize,
  height: circleSize,
  borderRadius: 1000,
  backgroundColor: "#008080",
  alignItems: "center",
  justifyContent: "center",
}

const LEVEL_NUM_STYLE: TextStyle = {
  fontSize: 30,
}

const PROGRESS_WRAP: ViewStyle = {
  position: "absolute",
  top: circleSize / 2 - 4, // minus height of progress bar
}

const LEVEL_NUM_WRAP: ViewStyle = {
  position: "absolute",
  right: 4,
}

const CHECK_BOX: ViewStyle = {
  position: "absolute",
  right: 5,
}

const HIDDEN_SWIPE: ViewStyle = {
  justifyContent: "center",
  paddingRight: 5,
}

const RESET_STYLE: ViewStyle = {
  ...HIDDEN_SWIPE,
}

const COMPLETED_SWIPE: ViewStyle = {
  ...HIDDEN_SWIPE,
  backgroundColor: "rgba(0,255,255, .5)",
}

const CANCELLED_SWIPE: ViewStyle = {
  ...HIDDEN_SWIPE,
  backgroundColor: "rgba(255,0,0, .15)",
}

const COMPLETED_STYLE: ViewStyle = {
  // backgroundColor: "rgb(100,255,255)",
}

const CANCELLED_STYLE: ViewStyle = {
  // backgroundColor: "rgb(255, 204, 203)",
}

const DONE_STYLE: TextStyle = {
  textDecorationLine: "line-through",
}

const DAILY_GOAL_WRAP: ViewStyle = {}

function getMultiplierColor(multiplier) {
  if (multiplier < 0.2) return "#008080"
  if (multiplier < 0.5) return "#00cd49"
  if (multiplier < 0.8) return "#e4e000"
  else return "#f20007"
}

function getFormattedTime(time: number): string {
  const hours = Math.floor(time / 60)
  const minutes = Math.round(time - hours * 60)
  let timeStr = hours + ":" + minutes
  if (minutes < 10) timeStr += "0"
  return timeStr
}

export const HomeScreen = observer(function HomeScreen() {
  // Pull in one of our MST stores
  const { dailyGoalStore } = useStores()
  const { goals } = dailyGoalStore
  const streakProgress = 0.8
  const level = 7
  const levelScore = 1248
  const totalLevelScore = 2000
  const levelProgress = levelScore / totalLevelScore
  const scoreMultiplier = 14

  console.log("Goals: " + goals)

  const swipeRightCompleted = () => (
    <View style={COMPLETED_SWIPE}>
      <Text>Completed</Text>
    </View>
  )

  const swipeLeftCancelled = () => (
    <View style={CANCELLED_SWIPE}>
      <Text>Cancel</Text>
    </View>
  )

  const swipeReset = () => (
    <View style={RESET_STYLE}>
      <Text>Reset</Text>
    </View>
  )

  const refs = []

  const toggleCompleted = (index: number, goal: DailyGoal) => {
    goal.setCancelled(false)
    goal.setCompleted(!goal.completed)
    if (refs[index]) refs[index].close()
  }

  const toggleCancelled = (index: number, goal: DailyGoal) => {
    goal.setCompleted(false)
    goal.setCancelled(!goal.cancelled)
    if (refs[index]) refs[index].close()
  }

  const toggleToggle = (index: number, goal: DailyGoal) => {
    if (goal.completed) {
      goal.setCompleted(false)
      goal.setCancelled(true)
    } else if (goal.cancelled) {
      goal.setCancelled(false)
    } else {
      goal.setCompleted(true)
    }
  }

  return (
    <View style={FULL}>
      <Screen style={FULL} backgroundColor={color.transparent}>
        <View style={CONTENT_WRAP}>
          <View style={LEVEL_WRAP}>
            <View style={LEVEL_NUM_WRAP}>
              <Text>
                {levelScore} / {totalLevelScore}
              </Text>
            </View>
            <View style={PROGRESS_WRAP}>
              <Progress.Bar progress={levelProgress} width={progressWidth} color="#008080" />
            </View>
            <View style={LEVEL_STYLE}>
              <Text style={LEVEL_NUM_STYLE}>{level}</Text>
            </View>
          </View>
          <View style={MULTIPLIER_WRAP}>
            <Text h4 style={MULTIPLER_STYLE}>
              Score multiplier x{scoreMultiplier}
            </Text>
            <View style={NEXT_MULT_STYLE}>
              <Text>Next multiplier</Text>
            </View>
            <Progress.Bar
              progress={streakProgress}
              width={progressWidth}
              color={getMultiplierColor(streakProgress)}
            />
          </View>
        </View>
        <View style={DAILY_GOAL_WRAP}>
          <Text h4 style={{margin: 10}}>
            Remianing goals for {getCurrentDay(false)}: {dailyGoalStore.getRemainingGoals()}
          </Text>
          {goals.map((goal, index) => (
            <Swipeable
              style={goal.cancelled ? CANCELLED_STYLE : goal.completed ? COMPLETED_STYLE : {}}
              key={goal.id}
              renderLeftActions={goal.cancelled ? swipeReset : swipeLeftCancelled}
              renderRightActions={goal.completed ? swipeReset : swipeRightCompleted}
              onSwipeableLeftOpen={() => toggleCancelled(index, goal)}
              onSwipeableRightOpen={() => toggleCompleted(index, goal)}
              ref={(instance: any) => {
                if (instance) refs[index] = instance
              }}
            >
              <ListItem
                bottomDivider
                containerStyle={
                  goal.cancelled ? CANCELLED_STYLE : goal.completed ? COMPLETED_STYLE : {}
                }
              >
                <View style={CHECK_BOX}>
                  <CheckBox
                    checked={goal.cancelled || goal.completed}
                    checkedIcon={goal.cancelled ? "close" : "check"}
                    checkedColor={goal.cancelled ? "red" : "#008080"}
                    iconRight
                    onPress={() => toggleToggle(index, goal)}
                  ></CheckBox>
                </View>
                <ListItem.Content>
                  <ListItem.Title style={goal.cancelled || goal.completed ? DONE_STYLE : {}}>
                    {goal.title}
                  </ListItem.Title>
                  <ListItem.Subtitle>{getFormattedTime(goal.time)}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </Swipeable>
          ))}
        </View>
      </Screen>
    </View>
  )
})
