import React from "react";
import { observer } from "mobx-react-lite";
import { ImageBackground,Dimensions, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import { Button, Screen } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models";
import { color, spacing } from "../../theme";
import auth from "@react-native-firebase/auth";
import { Avatar, Text, Button as StarButton, Icon } from "react-native-elements";
import SwitchSelector from "react-native-switch-selector";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";


const darkAqua = "#008080";
const aqua = "#46BFAC";
const windowWidth = Dimensions.get('window').width;

const FULL: ViewStyle = { flex: 1 };

const styles = StyleSheet.create({
  levelbar: {
    fontSize: 16,
    textAlign: 'left', 
    color: darkAqua
  }, 
  heading: {
    fontSize: 28,
    textAlign: 'center',
    color: 'black'
  }, 
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center", 
    opacity: 1
  }
})

const CONTENT_WRAP: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
};

const progressWidth = windowWidth-180;
const circleSize = 35;
const topSectionHeight = 180;

const LEVEL_STYLE: ViewStyle = {
  width: circleSize,
  height: circleSize,
  borderRadius: 1000,
  backgroundColor: aqua,
};

const LEVEL_NUM_STYLE: TextStyle = {
  fontSize: 25,
  textAlign: "center",
  color: 'white'
};

const TROPHY_WRAP: ViewStyle = {
  // position: "absolute",
  // right: 5,
};

const AWARD_SUBTITLE: TextStyle = {
  textAlign: "center",
  marginTop: -10,
  paddingTop: 0
};

const PROGRESS_WRAP: ViewStyle = {
  position: "absolute",
  top: circleSize / 2 - 5, // minus height of progress bar,
};

const LEVEL_NUM_WRAP: ViewStyle = {
  position: "absolute",
  right: 7,
  top: circleSize /2 - 10
};

const LEVEL_WRAP: ViewStyle = {
  width: windowWidth-130,
  marginTop: 10,
  justifyContent: 'center',
  // position: "absolute",
  // left: 5,
};

const LOGOUT_STYLE: ViewStyle = {
  paddingTop: 50,
};

export const ProfileScreen = observer(function ProfileScreen() {
  // Pull in one of our MST stores
  const { userStore } = useStores();
  const level = userStore.getLevel();
  const levelScore = userStore.goalsCompleted;
  const totalLevelScore = userStore.getGoalsForNextLevel();
  const levelProgress = levelScore / totalLevelScore;
  // TODO: User userstore here
  const awardCount = userStore.getAwards(false).length;
  const navigation = useNavigation();
  const goToAwards = () => navigation.navigate("awards");


  async function signOut() {
    __DEV__ && console.log("signing out");
    try {
      userStore.signUserOut();
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
          </View>
          {/* <Text>{__DEV__ && auth().currentUser.uid}</Text> */}
          <View style={{ flexDirection: "row", marginTop: 30 }}>
            <SwitchSelector
              style={{width: 130}}
              height={40}
              initial={0}
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
