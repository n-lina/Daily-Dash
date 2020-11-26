import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Dimensions, FlatList, Image, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Screen, Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { DailyGoal, useStores } from "../../models";
import { color, spacing } from "../../theme";
import { CheckBox, ListItem, Text, Button as StarButton, Icon, Avatar } from "react-native-elements";
import * as Progress from "react-native-progress";
import { getDay } from "../../utils/getDay";
import { getDisplayTime } from "../../utils/getDisplayTime";

/** **           STYLES            ***** */

const borderColor = "#737373";
const lightseagreen = "#616F6C";
const aqua = "#46BFAC";
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    backgroundColor: aqua,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    color: color.palette.white,
    fontSize: 32,
    marginBottom: spacing[4],
    marginLeft: spacing[3],
    marginRight: spacing[3],
    marginTop: spacing[3],
    textAlign: "center"
  },
  image: {
    height: 93,
    marginBottom: 5,
    marginTop: 10
  },
  quote_left: {
    color: lightseagreen,
    fontSize: 17,
    fontStyle: "italic",
    marginLeft: spacing[5],
    marginTop: spacing[5],
    textAlign: "left",
  },
  quote_right: {
    color: lightseagreen,
    fontSize: 17,
    fontStyle: "italic",
    marginBottom: spacing[2],
    marginRight: spacing[5],
    textAlign: "right"
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8
  },
  subheading: {
    color: lightseagreen,
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 2
  }
});

const progressWidth = 280;
const circleSize = 44;
const topSectionHeight = 180;

const FULL: ViewStyle = { flex: 1 };

const CONTENT_WRAP: ViewStyle = {
  alignItems: "center",
  height: 20,
};

const LEVEL_WRAP: ViewStyle = {
  width: progressWidth,
  marginTop: 20,
  position: "absolute",
  left: 10,
};

const LEVEL_STYLE: ViewStyle = {
  width: circleSize,
  height: circleSize,
  borderRadius: 1000,
  backgroundColor: "#008080",
};

const LEVEL_NUM_STYLE: TextStyle = {
  fontSize: 30,
  textAlign: "center",
};

const TROPHY_WRAP: ViewStyle = {
  position: "absolute",
  right: 5,
};

const AWARD_SUBTITLE: TextStyle = {
  textAlign: "center",
  marginTop: -10,
  paddingTop: 0
};

const PROGRESS_WRAP: ViewStyle = {
  position: "absolute",
  top: circleSize / 2 - 4, // minus height of progress bar,
};

const LEVEL_NUM_WRAP: ViewStyle = {
  position: "absolute",
  right: 4,
};

const CHECK_BOX: ViewStyle = {
  position: "absolute",
  right: 5,
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
};

const REMAINING_GOALS: ViewStyle = {
  marginTop: 10,
  marginLeft: 4
};

const ADD_ONE_BUTTON: ViewStyle = {
  marginTop: 20
};

const NO_GOALS_MESSAGE: ViewStyle = {
  marginTop: 25,
  alignContent: "center",
  alignItems: "center"
};

const Separator = () => (
  <View style={styles.separator} />
);
/********************************/

/**
 * Get string version of day on devices phone
 * @param getShort true for short version (ex: mon) (long is Monday)
 */
const getCurrentDay = getDay;

export const HomeScreen = observer(function HomeScreen() {
  // Pull in one of our MST stores
  const { dailyGoalStore, userStore, LtGoalFormStore } = useStores();
  const { goals } = dailyGoalStore;
  const level = userStore.getLevel();
  const levelScore = userStore.goalsCompleted;
  const totalLevelScore = userStore.getGoalsForNextLevel();
  const levelProgress = levelScore / totalLevelScore;
  // TODO: User userstore here
  const awardCount = userStore.getAwards(false).length;

  __DEV__ && console.log("Goals: " + goals);

  const navigation = useNavigation();

  const getFormattedTime = (time: number) => {
    return getDisplayTime(userStore.timeMode, time);
  };

  const goToAwards = () => navigation.navigate("awards");
  const goToAddGoal = () => {
    LtGoalFormStore.clearForm();
    navigation.navigate("Goals", { screen: "addGoal" });
  };

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
            item.cancelled ? CANCELLED_STYLE : item.completed ? COMPLETED_STYLE : {width: windowWidth-10}
          }
        >
          <View style={CHECK_BOX} testID={"goal" + index}>
            <CheckBox
              checked={item.cancelled || item.completed}
              checkedIcon={item.cancelled ? "close" : "check"}
              checkedColor={item.cancelled ? "red" : "#008080"}
              iconRight
              onPress={() => toggleToggle(item as DailyGoal)}
            ></CheckBox>
          </View>
          <ListItem.Content>
            <ListItem.Title style={item.cancelled || item.completed ? DONE_STYLE : {width: windowWidth-90}}>
              {item.title}
            </ListItem.Title>
            <ListItem.Subtitle>{getFormattedTime(item.getTime())}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
        {/* </Swipeable> */}
      </View>
    );
  };

  return (
    <View style={FULL} testID="homeSreenWrap">
      <Screen style={FULL} backgroundColor={color.palette.white}>
        <View style={TOP_SECTION}>
          {/* <View style={CONTENT_WRAP}> */}
            {/* <View style={LEVEL_WRAP}> */}
              {/* <View style={LEVEL_NUM_WRAP}>
                <Text testID="goalsCompletedDisplay">
                  {levelScore} / {totalLevelScore}
                </Text>
              </View> */}
              {/* <View style={PROGRESS_WRAP}>
                <Progress.Bar progress={levelProgress} width={progressWidth} color="#008080" />
              </View> */}
              {/* <View style={LEVEL_STYLE}>
                <Text style={LEVEL_NUM_STYLE} testID="levelNumber">{level}</Text>
              </View> */}
            {/* </View> */}
            {/* <View style={TROPHY_WRAP}>
              <StarButton
                testID="awardsStar"
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
              <Text style={AWARD_SUBTITLE} testID="awardsString">
                {awardCount} award{awardCount != 1 ? "s" : ""}
              </Text>
            </View> */}
          {/* </View> */}
          <Text style={styles.quote_left}>
            A journey of a thousand miles ...
          </Text>
          <Image style={styles.image}
            source={require("../../../assets/meadow.jpg")}
          />
          <Text style={styles.quote_right}>
            ... begins with a single step.
          </Text>
          <Text style={styles.header}>
            {getCurrentDay(false)}
          </Text>
          <Text style={styles.subheading}>—     November 25, 2020     —</Text>
          <Text style={styles.subheading}>
            {dailyGoalStore.getRemainingCount()} goal{dailyGoalStore.getRemainingCount() != 1 ? "s" : ""}
          </Text>
          <Text style={{...styles.subheading, marginTop: 3}}>🌱</Text>
        </View>
        <Separator/>
        { goals.length === 0 &&
          <View style={NO_GOALS_MESSAGE}>
            <Text>
              You don't have any goals 😮
            </Text>
            <Button style={ADD_ONE_BUTTON} text="Add one" onPress={goToAddGoal}></Button>
          </View>}
        <FlatList
          style={LIST_STYLE}
          data={goals}
          refreshing={refreshing}
          onRefresh={getGoals}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          extraData={[
            { extraDataForMobX: goals.length > 0 ? goals[0].title : "" },
            userStore.timeMode,
            goals
          ]}
        />
      </Screen>
    </View>
  );
});
