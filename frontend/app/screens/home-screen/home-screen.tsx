import React from "react"
import { observer } from "mobx-react-lite"
import { FlatList, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen } from "../../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { color } from "../../theme"
import { Text } from "react-native-elements"
import * as Progress from "react-native-progress"

const progressWidth = 280
const circleSize = 44

const FULL: ViewStyle = { flex: 1 }
const TEXT: TextStyle = {
  color: "black",
}

const CONTENT: TextStyle = {
  ...TEXT,
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

const DAILY_GOAL_WRAP: ViewStyle = {}

function getMultiplierColor(multiplier) {
  if (multiplier < 0.2) return "#008080"
  if (multiplier < 0.5) return "#00cd49"
  if (multiplier < 0.8) return "#e4e000"
  else return "#f20007"
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
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <View style={FULL}>
      <Screen style={FULL} backgroundColor={color.transparent}>
        {/* <Header
          headerText="Daily Dash"
          titleStyle={HEADER_TEXT_STYLE}
          style={HEADER_STYLE}
        /> */}
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
          <Text>{goals.length}</Text>
          <FlatList
          data={goals}
          keyExtractor={item => item.id}
          renderItem>
          </FlatList>
{/*           
          {goals.map((goal, index) => 
            <Text key={goal.id}>{goal.title}</Text>
          )} */}
        </View>
        <Button onPress={dailyGoalStore.addGoal} text={"Add goal"}></Button>
        <Button onPress={dailyGoalStore.clearGoals} text={"Clear"}></Button>
      </Screen>
    </View>
  )
})
