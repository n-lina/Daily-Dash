import React from "react";
import { observer } from "mobx-react-lite";
import { ImageBackground, Dimensions, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Button, Screen } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models";
import { spacing } from "../../theme";
import { Text, Button as StarButton } from "react-native-elements";
import SwitchSelector from "react-native-switch-selector";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";

const darkAqua = "#008080";
const aqua = "#46BFAC";
const windowWidth = Dimensions.get("window").width;
const lightseagreen = "#616F6C";

const FULL: ViewStyle = { flex: 1 };

const styles = StyleSheet.create({
  heading: {
    color: lightseagreen,
    fontSize: 28,
    letterSpacing: 2,
    textAlign: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    opacity: 1,
    resizeMode: "cover"
  },
  levelbar: {
    color: darkAqua,
    fontSize: 16,
    textAlign: "left"
  },
  subheading: {
    color: lightseagreen,
    fontSize: 17,
    fontStyle: "italic",
    marginTop: spacing[3],
    textAlign: "center"
  }
});

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

const progressWidth = windowWidth - 180;
const circleSize = 35;

const LEVEL_STYLE: ViewStyle = {
  width: circleSize,
  height: circleSize,
  borderRadius: 1000,
  backgroundColor: aqua,
};

const LEVEL_NUM_STYLE: TextStyle = {
  fontSize: 25,
  textAlign: "center",
  color: "white"
};

const TROPHY_WRAP: ViewStyle = {
  // position: "absolute",
  // right: 5,
};

const AWARD_SUBTITLE: TextStyle = {
  textAlign: "center",
  marginTop: spacing[1],
  paddingTop: 0,
  marginBottom: spacing[1],
  fontSize: 16,
  color: lightseagreen,

};

const PROGRESS_WRAP: ViewStyle = {
  position: "absolute",
  top: circleSize / 2 - 5, // minus height of progress bar,
};

const LEVEL_NUM_WRAP: ViewStyle = {
  position: "absolute",
  left: progressWidth,
  top: circleSize / 2 - 10
};

const LEVEL_WRAP: ViewStyle = {
  width: windowWidth - 130,
  marginTop: 20,
  justifyContent: "center",
  // position: "absolute",
  // left: 5,
};

const LOGOUT_STYLE: ViewStyle = {
  paddingTop: 30,
};

export const ProfileScreen = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  const { userStore, dailyGoalStore, goalsStore } = useStores();
  const level = userStore.getLevel();
  const levelScore = userStore.goalsCompleted;
  const totalLevelScore = userStore.getGoalsForNextLevel();
  const levelProgress = levelScore / totalLevelScore;
  // TODO: User userstore here
  const myAwards = userStore.getAwards(false);
  const myTitle = (myAwards.length > 0) ? myAwards[myAwards.length - 1].title : "Getting Started ...";
  const awardCount = userStore.getAwards(false).length;
  const navigation = useNavigation();
  const goToAwards = () => navigation.navigate("awards");

  async function signOut() {
    __DEV__ && console.log("signing out");
    try {
      userStore.signUserOut().then(res => {
        dailyGoalStore.clearGoals();
        goalsStore.clear();
      })
    } catch (e) {
      __DEV__ && console.log(e);
    }
  }

  return (
    <View style={FULL} testID="profileScreenWrap">
      <Screen style={FULL} preset="scroll" >
        <ImageBackground source={require("../../../assets/sky.jpeg")} style={styles.image}>
          <View style={CONTENT_WRAP}>
            <Text style={styles.heading}>{userStore.name}</Text>
            <Text style={styles.subheading}>—     {myTitle}     —</Text>
            <View style={LEVEL_WRAP}>
              <View style={LEVEL_NUM_WRAP}>
                <Text style={styles.levelbar} testID="goalsCompletedDisplay"> {levelScore} / {totalLevelScore} </Text>
              </View>
              <View style={PROGRESS_WRAP}>
                <Progress.Bar progress={levelProgress} width={progressWidth} height={10} color={aqua} />
              </View>
              <View style={LEVEL_STYLE}>
                <Text style={LEVEL_NUM_STYLE} testID="levelNumber">{level}</Text>
              </View>
            </View>
            <View style={TROPHY_WRAP}>
              <StarButton
                testID="awardsStar"
                type="clear"
                onPress={goToAwards}
                icon={
                  { name: "trophy-award", type: "material-community", color: "#54BFFF", size: 70 }
                }
              />
              <Text style={AWARD_SUBTITLE} testID="awardsString">
                {awardCount} Award{awardCount != 1 ? "s" : ""}
              </Text>
              <Text style={AWARD_SUBTITLE} testID="goalsString">
                {levelScore} Goal{levelScore != 1 ? "s" : ""} Completed
              </Text>
            </View>
            {/* <Text>{__DEV__ && auth().currentUser.uid}</Text> */}
            <View style={{ flexDirection: "row", marginTop: 30 }}>
              <SwitchSelector
                style={{ width: 130 }}
                height={40}
                initial={(userStore.timeMode === 12) ? 0 : 1}
                onPress={value => userStore.updateTimeMode(value as number)}
                textColor='grey'
                selectedColor="#fff"
                buttonColor={aqua}
                borderColor={aqua}
                hasPadding={false}
                fontSize={15}
                bold={false}
                options={[
                  { label: "12 HR", value: 12 },
                  { label: "24 HR", value: 24 }
                ]}
              />
            </View>
            <View style={LOGOUT_STYLE}>
              <Button testID="logoutButton" text="log out" onPress={signOut}></Button>
            </View>
          </View>
        </ImageBackground>
      </Screen>
    </View>
  );
});
