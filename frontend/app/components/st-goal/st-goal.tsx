import * as React from "react";
import { TextStyle, View, ViewStyle, StyleSheet, TextInput } from "react-native";
import { color, typography, spacing } from "../../theme";
import { Text, StTimeSlotForm } from "../";
import { StGoalForm, useStores } from "../../models";
import { observer } from "mobx-react-lite";
import { eqProps } from "ramda";


// const borderColor = "#737373";
const darkAqua = "#008080";

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: 120
  },
  amPmContainer: {
    height: 35,
    marginLeft: 5,
    width: 68
  },
  flexStart: {
    justifyContent: "flex-start"
  },
  picker: {
    height: 35,
    width: 65
  },
  // separator: {
  //   borderBottomColor: borderColor,
  //   borderBottomWidth: StyleSheet.hairlineWidth,
  //   marginVertical: 8,
  // },
  sideByside: {
    alignContent: "center",
    flexDirection: "row",
    width: 220
    // justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 15,
    height: 40
  },
  textInputTime1: {
    alignContent: "center",
    flex: 1,
    fontSize: 15,
    height: 40,
    marginLeft: spacing[3],
    textAlign: "right"
  },
  textInputTime2: {
    alignContent: "center",
    fontSize: 15,
    height: 40,
    textAlign: "left",
  },
  colon: {
    alignContent: "center",
    color: "#000",
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: spacing[2],
    textAlign: "center"
  }
});

const CONTAINER: ViewStyle = {
  justifyContent: "center",
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
}
const TimesView = observer((props: myTimesList) => (
  <View>
    {props.timesList.map((timeSlot, index) => (< StTimeSlotForm timeSlot={timeSlot} key={index} index={index} timeMode={props.timeMode}/>))}
 </View>
))

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
  }, [LtGoalFormStore.STgoalForm[LtGoalFormStore.STgoalForm.length-1].timeForm.length]);

  return (
    <View style={CONTAINER}>
      {!loading && (
        <View>
          <View style={styles.sideByside}>
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
          <TimesView timesList={props.myGoal.timeForm} timeMode={userStore.timeMode}/>
          {/* {props.myGoal.timeForm.map((timeSlot, index) => (< StTimeSlotForm timeSlot={timeSlot} key={index} index={index} timeMode={userStore.timeMode}/>))} */}
        </View>
      )}
    </View>
  );
}
