import * as React from "react";
import { TextStyle, View, ViewStyle, StyleSheet, TextInput } from "react-native";
import { color, typography, spacing } from "../../theme";
import { Text } from "../";
import DropDownPicker from "react-native-dropdown-picker";
import { StGoalForm } from "../../models";

// const borderColor = "#737373";

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: 120
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
    fontSize: 15,
    height: 40, 
    textAlign: "right",
    alignContent: "center", 
    marginLeft: spacing[3],
    flex: 1
  }, 
  textInputTime2: {
    fontSize: 15,
    height: 40, 
    textAlign: "left",
    alignContent: "center", 
  }, 
  colon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    alignContent: "center", 
    flex:1,
    marginTop: spacing[2]
  }
});

const CONTAINER: ViewStyle = {
  justifyContent: "center",
};

const pickerColor = "#fafafa";

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
};

export interface StGoalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  // onChangeText: Function
  // onChangeDay: Function
  // onChangeHour: Function
  // onChangeMinutes: Function
  // TextStore: Object
  // TimesStore: Object
  myGoal: StGoalForm
}

/**
 * Describe your component here
 */
export function StGoal(props: StGoalProps) {
  // const { style } = props;

  // const Separator = () => (
  //   <View style={styles.separator} />
  // );

  function validateHour(hour: string){
    hour = hour.replace(/[^0-9]/g, '');
    if (parseInt(hour) > 23) {
      hour = (23).toString()
    }
    changeHour(hour)
    props.myGoal.setHour(hour) 
  }

  function validateMin(minute: string){
    minute = minute.replace(/[^0-9]/g, '');
    if (parseInt(minute) > 59) {
      minute = (59).toString()
    }
    changeMin(minute)
    props.myGoal.setMin(minute) 
  }

  const [hour, changeHour] = React.useState(props.myGoal.hour)
  const [min, changeMin] = React.useState(props.myGoal.minute)

  return (
    <View style={CONTAINER}>
      <View style={styles.sideByside}>
        <Text style={TITLE2}>●</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => props.myGoal.setTitle(text)}
          // value={props.myGoal.title}
          placeholder="call a friend once a week"
          defaultValue={props.myGoal.title}
        />
      </View>
      {/* < Separator /> */}
      <View style={styles.sideByside}>
        <DropDownPicker
          items={[
            { label: "Monday", value: "mon" },
            { label: "Tuesday", value: "tue" },
            { label: "Wednesday", value: "wed" },
            { label: "Thursday", value: "thu" },
            { label: "Friday", value: "fri" },
            { label: "Saturday", value: "sat" },
            { label: "Sunday", value: "sun" },
          ]}
          defaultValue={props.myGoal.day}
          containerStyle={styles.container}
          style={{ backgroundColor: pickerColor }}
          itemStyle={
            styles.flexStart
          }
          dropDownStyle={{ backgroundColor: pickerColor }}
          onChangeItem={item => props.myGoal.setDay(item.value)}
        />
        <TextInput
          style={styles.textInputTime1}
          onChangeText={text => validateHour(text)}
          placeholder="hh"
          defaultValue={props.myGoal.hour}
          keyboardType = 'numeric'
          maxLength = {2}
          value={hour}
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.textInputTime2}
          onChangeText={text => validateMin(text)}
          placeholder="mm"
          defaultValue={props.myGoal.minute}
          keyboardType = 'numeric'
          maxLength = {2}
          value={min}
        />
      </View>
    </View>
  );
}
