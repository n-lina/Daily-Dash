import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Dimensions, FlatList, TextStyle, View, ViewStyle } from "react-native";
import { Screen } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { DailyGoal, useStores } from "../../models";
import { color } from "../../theme";
import { CheckBox, ListItem, Text, Button, Icon } from "react-native-elements";
import * as Progress from "react-native-progress";
import Swipeable from "react-native-gesture-handler/Swipeable";

/** **           STYLES            ***** */
const progressWidth = 280;
const circleSize = 44;
const topSectionHeight = 180;

const FULL: ViewStyle = { flex: 1 };

const CONTENT_WRAP: ViewStyle = {
  alignItems: "center",
  height: 80
};

const LEVEL_WRAP: ViewStyle = {
  width: progressWidth,
  marginTop: 20,
  position: "absolute",
  left: 10
};

const LEVEL_STYLE: ViewStyle = {
  width: circleSize,
  height: circleSize,
  borderRadius: 1000,
  backgroundColor: "#008080"
};

const LEVEL_NUM_STYLE: TextStyle = {
  fontSize: 30,
  textAlign: "center"
};

const TROPHY_WRAP: ViewStyle = {
  position: "absolute",
  right: 5
};

const AWARD_SUBTITLE: TextStyle = {
  textAlign: "center",
  marginTop: -10,
  paddingTop: 0
};

const PROGRESS_WRAP: ViewStyle = {
  position: "absolute",
  top: circleSize / 2 - 4, // minus height of progress bar
};

const LEVEL_NUM_WRAP: ViewStyle = {
  position: "absolute",
  right: 4,
};

const CHECK_BOX: ViewStyle = {
  position: "absolute",
  right: 5,
};

const HIDDEN_SWIPE: ViewStyle = {
  justifyContent: "center",
  paddingRight: 5,
};

const RESET_STYLE: ViewStyle = {
  ...HIDDEN_SWIPE,
};

const COMPLETED_SWIPE: ViewStyle = {
  ...HIDDEN_SWIPE,
  backgroundColor: "rgba(0,255,255, .5)",
};

const CANCELLED_SWIPE: ViewStyle = {
  ...HIDDEN_SWIPE,
  backgroundColor: "rgba(255,0,0, .15)",
};

const COMPLETED_STYLE: ViewStyle = {
  // backgroundColor: "rgb(100,255,255)",
};

const CANCELLED_STYLE: ViewStyle = {
  // backgroundColor: "rgb(255, 204, 203)",
};

const DONE_STYLE: TextStyle = {
  textDecorationLine: "line-through",
};

const LIST_STYLE: ViewStyle = {
  overflow: "scroll",
  height: Dimensions.get("window").height - topSectionHeight,
};

const TOP_SECTION: ViewStyle = {
  height: topSectionHeight,
};

const REMAINING_GOALS: ViewStyle = {
  marginTop: 10,
  marginLeft: 4
};
/********************************/

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * Get string version of day on devices phone
 * @param getShort true for short version (ex: mon) (long is Monday)
 */
const getCurrentDay = (getShort: boolean) => {
  const day = weekDays[new Date().getDay()];
  if (getShort) {
    return day.toLowerCase().substring(0, 3);
  }
  return day;
};

/**
 * Convert mintues to a formatted string for time (24 clock)
 * @param time minutes (ex: 1230 -> 20:30)
 */
function getFormattedTime(time: number): string {
  const hours = Math.floor(time / 60);
  const minutes = Math.round(time - hours * 60);
  let timeStr = hours + ":";
  if (minutes < 10) timeStr += "0";
  timeStr += minutes;
  return timeStr;
}

export const HomeScreen = observer(function HomeScreen() {
  // Pull in one of our MST stores
  const { dailyGoalStore, userStore } = useStores();
  const { goals } = dailyGoalStore;
  const level = userStore.getLevel();
  const levelScore = userStore.goalsCompleted;
  const totalLevelScore = userStore.getGoalsForNextLevel();
  const levelProgress = levelScore / totalLevelScore;
  // TODO: User userstore here
  const awardCount = 4;

  __DEV__ && console.log("Goals: " + goals);

  const navigation = useNavigation();

  const goToAwards = () => navigation.navigate("awards");

  const [refreshing, setRefreshing] = useState(false);

  const getGoals = () => {
    setRefreshing(true);
    dailyGoalStore.getGoalsForDay(getCurrentDay(true)).finally(() => {
      setRefreshing(false);
    });
  };

  useEffect(() => {
    getGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swipeRightCompleted = () => (
    <View style={COMPLETED_SWIPE}>
      <Text>Completed</Text>
    </View>
  );

  const swipeLeftCancelled = () => (
    <View style={CANCELLED_SWIPE}>
      <Text>Cancel</Text>
    </View>
  );

  const swipeReset = () => (
    <View style={RESET_STYLE}>
      <Text>Reset</Text>
    </View>
  );

  // Keep track of the each instance in the goals list,
  // used to close on after swipe
  const refs = [];

  const setCompleted = (goal: DailyGoal, newVal: boolean) => {
    const prev = goal.completed;
    if (prev !== newVal) {
      if (newVal) {
        userStore.incrementGoalCount();
      } else {
        userStore.decrementGoalCount();
      }
    }
    goal.setCompleted(newVal);
  };

  const toggleCompleted = (index: number, goal: DailyGoal) => {
    goal.setCancelled(false);
    setCompleted(goal, !goal.completed);
    if (refs[index]) refs[index].close();
  };

  const toggleCancelled = (index: number, goal: DailyGoal) => {
    setCompleted(goal, false);
    goal.setCancelled(!goal.cancelled);
    if (refs[index]) refs[index].close();
  };

  /**
   * Toggle through the three way toggle on screen
   * @param goal goal to be toggled
   */
  const toggleToggle = (goal: DailyGoal) => {
    if (goal.completed) {
      setCompleted(goal, false);
      goal.setCancelled(true);
    } else if (goal.cancelled) {
      goal.setCancelled(false);
    } else {
      setCompleted(goal, true);
    }
  };

  const renderGoal = ({ item, index }) => {
    return (
      <View>
        {/* <Swipeable
          style={item.cancelled ? CANCELLED_STYLE : item.completed ? COMPLETED_STYLE : {}}
          key={item.id + item.time}
          renderLeftActions={item.cancelled ? swipeReset : swipeLeftCancelled}
          renderRightActions={item.completed ? swipeReset : swipeRightCompleted}
          onSwipeableLeftOpen={() => toggleCancelled(index, item as DailyGoal)}
          onSwipeableRightOpen={() => toggleCompleted(index, item as DailyGoal)}
          ref={(instance: any) => {
            if (instance) refs[index] = instance;
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
    );
  };

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
            <View style={TROPHY_WRAP}>
              <Button
                type="clear"
                onPress={goToAwards}
                icon={
                  <Icon
                    name="star"
                    size={60}
                    color="gold"
                  />
                }
              />
              <Text style={AWARD_SUBTITLE}>
                {awardCount} awards
              </Text>
            </View>
          </View>
          <Text h4 style={REMAINING_GOALS}>
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
  );
});
