import * as React from "react";
import { TextStyle, View, ViewStyle, StyleSheet, TextInput, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";
import { color, typography, spacing } from "../../theme";
import { Text, StTimeSlotForm } from "../";
import { StGoalForm, useStores } from "../../models";
import { observer } from "mobx-react-lite";

// const borderColor = "#737373";
const darkAqua = "#008080";
const aqua = "#46BFAC";
const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: 120
  },
  button: {
    backgroundColor: "white",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    // width:50,
    // height:50,
    // marginLeft: spacing[1],
    // marginRight: spacing[1]
  },
  buttonText: {
    fontSize: 25,
    textAlign: "center"
  },
  flexStart: {
    justifyContent: "flex-start"
  },

  // separator: {
  //   borderBottomColor: borderColor,
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   marginVertical: 8,
  // },
  buttonPanel: {
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: windowWidth
    // justifyContent: 'space-between',
  },
  times: {
    alignContent: "center",
    alignItems: "center",
    width: windowWidth
  },
  textInput: {
    fontSize: 16,
    height: 40
  },
});

const CONTAINER: ViewStyle = {
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center"
};

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
};

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 15,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
  marginLeft: spacing[3],
  marginRight: spacing[3],
  color: darkAqua
};

export interface StGoalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  myGoal: StGoalForm
  index?: number
  timeMode: number
}

export interface myTimesList {
  timesList: any
  timeMode: number
  stgIndex: number
}
const TimesView = observer((props: myTimesList) => (
  <View style={styles.times}>
    {props.timesList.map((timeSlot, index) => (< StTimeSlotForm timeSlot={timeSlot} key={index} stgIndex={props.stgIndex} timeMode={props.timeMode}/>))}
  </View>
));

/**
 * Describe your component here
 */
export function StGoal(props: StGoalProps) {
  // const { style } = props;

  // const Separator = () => (
  //   <View style={styles.separator} />
  // );

  const [loading, setLoading] = React.useState(true);
  const { userStore, LtGoalFormStore } = useStores();

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1);
  }, [LtGoalFormStore.STgoalForm[LtGoalFormStore.STgoalForm.length - 1].timeForm.length]);

  return (
    <View style={CONTAINER}>
      {!loading && (
        <View style={styles.times}>
          <View style={styles.buttonPanel}>
            <Text style={TITLE2}>●</Text>
            <TextInput
              testID={"stgTitle" + props.index}
              style={styles.textInput}
              onChangeText={text => props.myGoal.setTitle(text)}
              // value={props.myGoal.title}
              placeholder="call a friend once a week"
              defaultValue={props.myGoal.title}
            />
          </View>
          <TimesView timesList={props.myGoal.timeForm} timeMode={userStore.timeMode} stgIndex={props.index}/>
          <View style={styles.buttonPanel}>
            <Avatar
              rounded
              icon={{ name: "plus", type: "font-awesome", color: darkAqua }}
              onPress={() => props.myGoal.addTimeSlot()}
              overlayContainerStyle={styles.button}
            />
            <Avatar
              rounded
              icon={{ name: "minus", type: "font-awesome", color: darkAqua }}
              onPress={() => props.myGoal.deleteTimeSlot()}
              overlayContainerStyle={styles.button}
            />
            <Avatar
              rounded
              icon={{ name: "close", type: "font-awesome", color: darkAqua }}
              onPress={() => LtGoalFormStore.deleteSTgoal(props.index)}
              overlayContainerStyle={styles.button}
            />
          </View>
        </View>
      )}
    </View>
  );
}
