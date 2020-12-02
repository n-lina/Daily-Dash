import * as React from "react";
import { TextStyle, View, ViewStyle, StyleSheet, TextInput, Dimensions } from "react-native";
import { Avatar } from "react-native-elements";
import { color, typography, spacing } from "../../theme";
import { Text, StTimeSlotForm } from "../";
import { StGoalForm, useStores } from "../../models";
import { observer } from "mobx-react-lite";
import { palette } from "../../theme/palette";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.white,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  buttonPanel: {
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: windowWidth
  },
  textInput: {
    fontSize: 16,
    height: 40
  },
  times: {
    alignContent: "center",
    alignItems: "center",
    width: windowWidth
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
  color: color.primary
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

export interface MyTimesList {
  timesList: any
  timeMode: number
  stgIndex: number
}
const TimesView = observer((props: MyTimesList) => (
  <View style={styles.times}>
    {
      props.timesList.map((timeSlot, index) =>
        (< StTimeSlotForm timeSlot={timeSlot} key={index} stgIndex={props.stgIndex} timeMode={props.timeMode}/>)
      )
    }
  </View>
));

/**
 * Short term goal component used in add and edit long term goal forms
 */
export function StGoal(props: StGoalProps) {
  const [loading, setLoading] = React.useState(true);
  const { userStore, LtGoalFormStore } = useStores();

  const lengthOfStGoalForm = LtGoalFormStore.STgoalForm[LtGoalFormStore.STgoalForm.length - 1].timeForm.length;

  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1);
  }, [lengthOfStGoalForm]);

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
              placeholder="call a friend once a week"
              defaultValue={props.myGoal.title}
            />
          </View>
          <TimesView timesList={props.myGoal.timeForm} timeMode={userStore.timeMode} stgIndex={props.index}/>
          <View style={styles.buttonPanel}>
            <Avatar
              rounded
              icon={{ name: "plus", type: "font-awesome", color: color.primary }}
              onPress={() => props.myGoal.addTimeSlot()}
              overlayContainerStyle={styles.button}
            />
            <Avatar
              rounded
              icon={{ name: "minus", type: "font-awesome", color: color.primary }}
              onPress={() => props.myGoal.deleteTimeSlot()}
              overlayContainerStyle={styles.button}
            />
            <Avatar
              rounded
              icon={{ name: "close", type: "font-awesome", color: color.primary }}
              onPress={() => LtGoalFormStore.deleteSTgoal(props.index)}
              overlayContainerStyle={styles.button}
            />
          </View>
        </View>
      )}
    </View>
  );
}
