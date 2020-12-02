import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Dimensions, FlatList, Image, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Screen, Button } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { DailyGoal, useStores } from "../../models";
import { color, spacing } from "../../theme";
import { CheckBox, ListItem, Text, Avatar } from "react-native-elements";
import { getDay } from "../../utils/getDay";
import { getDisplayTime } from "../../utils/getDisplayTime";

/** **           STYLES            ***** */

const borderColor = "#737373";
const lightseagreen = "#616F6C";
const aqua = "#46BFAC";
const darkAqua = "#008080";
const windowWidth = Dimensions.get("window").width;
const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const styles = StyleSheet.create({
  header: {
    backgroundColor: aqua,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    color: color.palette.white,
    fontSize: 32,
    letterSpacing: 2,
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
    marginBottom: 2,
    textAlign: "center"
  }
});

const topSectionHeight = 180;

const FULL: ViewStyle = { flex: 1 };

const CHECK_BOX: ViewStyle = {
  position: "absolute",
  right: 2,
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
  // TODO: User userstore here

  __DEV__ && console.log("Goals: " + goals);

  const navigation = useNavigation();

  const getFormattedTime = (time: number) => {
    return getDisplayTime(userStore.timeMode, time);
  };

  const goToAddGoal = () => {
    LtGoalFormStore.clearForm();
    navigation.navigate("Goals", { screen: "goalForm", initial: false });
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
            item.cancelled ? CANCELLED_STYLE : item.completed ? COMPLETED_STYLE : { }
          }
        >
          <View style={CHECK_BOX} testID={"goal" + index}>
            <CheckBox
              checked={item.cancelled || item.completed}
              checkedIcon={item.cancelled ? "close" : "check"}
              checkedColor={item.cancelled ? "#FF5665" : darkAqua}
              iconRight
              onPress={() => toggleToggle(item as DailyGoal)}
            ></CheckBox>
          </View>
          <Avatar
            rounded
            icon={{ name: "circle", type: "font-awesome", color: aqua, size: 8 }}
            containerStyle={{ position: "absolute", left: 10 }}
          />
          <ListItem.Content>
            <ListItem.Title style={item.cancelled || item.completed ? DONE_STYLE : { width: windowWidth - 90 }}>
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
    <View style={FULL} testID="homeScreenWrap">
      <Screen style={FULL} backgroundColor={color.palette.white}>
        <View style={TOP_SECTION}>
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
          <Text style={styles.subheading}>—     {months[d.getMonth()]}  {d.getDate()},  {d.getFullYear()}     —</Text>
          <Text style={styles.subheading}>
            {dailyGoalStore.getRemainingCount()} goal{dailyGoalStore.getRemainingCount() != 1 ? "s" : ""}
          </Text>
          <Text style={{ ...styles.subheading, marginTop: 3 }}>🌱</Text>
        </View>
        <Separator/>
        { goals.length === 0 && dailyGoalStore.visible && 
          <View style={NO_GOALS_MESSAGE}>
            <Text testID="noGoalsMessage">
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
          keyExtractor={(item, index) => item.id + index}
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
