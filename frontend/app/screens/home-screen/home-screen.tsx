import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, FlatList, TextStyle, View, ViewStyle } from "react-native"
import { Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { DailyGoal, useStores } from "../../models"
import { color } from "../../theme"
import { CheckBox, ListItem, Text } from "react-native-elements"
import * as Progress from "react-native-progress"
import Swipeable from "react-native-gesture-handler/Swipeable"

/****           STYLES            ***** */
const progressWidth = 280
const circleSize = 44
const topSectionHeight = 180

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

const LIST_STYLE: ViewStyle = {
  overflow: "scroll",
  height: Dimensions.get("window").height - topSectionHeight,
}

const TOP_SECTION: ViewStyle = {
  height: topSectionHeight,
}
/********************************/

/**
 * Allow multiplier progress bar to change color if it gets closer
 * @param multiplier current fraction of how close multiplier is
 */
function getMultiplierColor(multiplier) {
  if (multiplier < 0.2) return "#008080"
  if (multiplier < 0.5) return "#00cd49"
  if (multiplier < 0.8) return "#e4e000"
  else return "#f20007"
}

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

/**
 * Get string version of day on devices phone
 * @param getShort true for short version (ex: mon) (long is Monday)
 */
const getCurrentDay = (getShort: boolean) => {
  var day = weekDays[new Date().getDay()]
  if (getShort) {
    return day.toLowerCase().substring(0, 3)
  }
  return day
}

/**
 * Convert mintues to a formatted string for time (24 clock)
 * @param time minutes (ex: 1230 -> 20:30)
 */
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
  // These should not be hardcoded in final product
  const streakProgress = 0.8
  const level = 7
  const levelScore = 1248
  const totalLevelScore = 2000
  const levelProgress = levelScore / totalLevelScore
  const scoreMultiplier = 14

  __DEV__ && console.log("Goals: " + goals)

  const [refreshing, setRefreshing] = useState(false)

  const getGoals = () => {
    setRefreshing(true)
    dailyGoalStore.getGoalsForDay(getCurrentDay(true)).finally(() => {
      setRefreshing(false)
    })
  }

  useEffect(() => {
    getGoals()
  }, [])

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

  const renderGoal = ({ item, index }) => {
    return (
      <View>
        {/* <Swipeable
          style={item.cancelled ? CANCELLED_STYLE : item.completed ? COMPLETED_STYLE : {}}
          key={item.id}
          renderLeftActions={item.cancelled ? swipeReset : swipeLeftCancelled}
          renderRightActions={item.completed ? swipeReset : swipeRightCompleted}
          onSwipeableLeftOpen={() => false && toggleCancelled(index, item as DailyGoal)}
          onSwipeableRightOpen={() => false && toggleCompleted(index, item as DailyGoal)}
          ref={(instance: any) => {
            if (instance) refs[index] = instance
          }}
        > */}
          <ListItem
            bottomDivider
            containerStyle={
              item.cancelled ? CANCELLED_STYLE : item.completed ? COMPLETED_STYLE : {}
            }
          >
            <View style={CHECK_BOX}>
              <CheckBox
                checked={item.cancelled || item.completed}
                checkedIcon={item.cancelled ? "close" : "check"}
                checkedColor={item.cancelled ? "red" : "#008080"}
                iconRight
                onPress={() => toggleToggle(item as DailyGoal)}
              ></CheckBox>
            </View>
            <ListItem.Content>
              <ListItem.Title style={item.cancelled || item.completed ? DONE_STYLE : {}}>
                {item.title}
              </ListItem.Title>
              <ListItem.Subtitle>{getFormattedTime(item.time)}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        {/* </Swipeable> */}
      </View>
    )
  }

  // Keep track of the each instance in the goals list,
  // used to close on after swipe
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

  /**
   * Toggle through the three way toggle on screen
   * @param goal goal to be toggled
   */
  const toggleToggle = (goal: DailyGoal) => {
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
        <View style={TOP_SECTION}>
          <View style={CONTENT_WRAP}>
            <View style={LEVEL_WRAP}>
              <View style={LEVEL_NUM_WRAP}>
                <Text>
                  {levelScore} / {totalLevelScore}
                </Text>
              </View>
              <View style={PROGRESS_WRAP}>
                {/* <Button onPress={dailyGoalStore.clearGoals} text="dev clear goals"></Button> */}
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
          <Text h4 style={{ margin: 10 }}>
            Remianing goals for {getCurrentDay(false)}: {dailyGoalStore.getRemainingCount()}
          </Text>
        </View>
        <FlatList
          style={LIST_STYLE}
          data={goals}
          refreshing={refreshing}
          onRefresh={getGoals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          extraData={{ extraDataForMobX: goals.length > 0 ? goals[0].title : "" }}
        />
      </Screen>
    </View>
  )
})
