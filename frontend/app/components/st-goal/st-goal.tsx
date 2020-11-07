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
    flexDirection: "row"
    // justifyContent: 'space-between',
  },
  textInput: {
    fontSize: 15,
    height: 40
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

  return (
    <View style={CONTAINER}>
      <View style={styles.sideByside}>
        <Text style={TITLE2}>●</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={text => props.myGoal.setTitle(text)}
          // value={props.myGoal.title}
          placeholder="call a friend once a week"
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
          defaultValue={"mon"}
          containerStyle={styles.container}
          style={{ backgroundColor: pickerColor }}
          itemStyle={
            styles.flexStart
          }
          dropDownStyle={{ backgroundColor: pickerColor }}
          onChangeItem={item => props.myGoal.setDay(item.value)}
        />
        <DropDownPicker
          items={[
            { label: "00", value: 0 },
            { label: "01", value: 1 },
            { label: "02", value: 2 },
            { label: "03", value: 3 },
            { label: "04", value: 4 },
            { label: "05", value: 5 },
            { label: "06", value: 6 },
            { label: "07", value: 7 },
            { label: "08", value: 8 },
            { label: "09", value: 9 },
            { label: "10", value: 10 },
            { label: "11", value: 11 },
            { label: "12", value: 12 },
            { label: "13", value: 13 },
            { label: "14", value: 14 },
            { label: "15", value: 15 },
            { label: "16", value: 16 },
            { label: "17", value: 17 },
            { label: "18", value: 18 },
            { label: "19", value: 19 },
            { label: "20", value: 20 },
            { label: "21", value: 21 },
            { label: "22", value: 22 },
            { label: "23", value: 23 },
          ]}
          defaultValue={0}
          containerStyle={styles.picker}
          style={{ backgroundColor: pickerColor }}
          itemStyle={
            styles.flexStart
          }
          dropDownStyle={{ backgroundColor: pickerColor }}
          onChangeItem={item => props.myGoal.setHour(item.value)}
        />
        <DropDownPicker
          items={[
            { label: "00", value: 0 },
            { label: "01", value: 1 },
            { label: "02", value: 2 },
            { label: "03", value: 3 },
            { label: "04", value: 4 },
            { label: "05", value: 5 },
            { label: "06", value: 6 },
            { label: "07", value: 7 },
            { label: "08", value: 8 },
            { label: "09", value: 9 },
            { label: "10", value: 10 },
            { label: "11", value: 11 },
            { label: "12", value: 12 },
            { label: "13", value: 13 },
            { label: "14", value: 14 },
            { label: "15", value: 15 },
            { label: "16", value: 16 },
            { label: "17", value: 17 },
            { label: "18", value: 18 },
            { label: "19", value: 19 },
            { label: "20", value: 20 },
            { label: "21", value: 21 },
            { label: "22", value: 22 },
            { label: "23", value: 23 },
            { label: "24", value: 24 },
            { label: "25", value: 25 },
            { label: "26", value: 26 },
            { label: "27", value: 27 },
            { label: "28", value: 28 },
            { label: "29", value: 29 },
            { label: "30", value: 30 },
            { label: "31", value: 31 },
            { label: "32", value: 32 },
            { label: "33", value: 33 },
            { label: "34", value: 34 },
            { label: "35", value: 35 },
            { label: "36", value: 36 },
            { label: "37", value: 37 },
            { label: "38", value: 38 },
            { label: "39", value: 39 },
            { label: "40", value: 40 },
            { label: "41", value: 41 },
            { label: "42", value: 42 },
            { label: "43", value: 43 },
            { label: "44", value: 44 },
            { label: "45", value: 45 },
            { label: "46", value: 46 },
            { label: "47", value: 47 },
            { label: "48", value: 48 },
            { label: "49", value: 49 },
            { label: "50", value: 50 },
            { label: "51", value: 51 },
            { label: "52", value: 52 },
            { label: "53", value: 53 },
            { label: "54", value: 54 },
            { label: "55", value: 55 },
            { label: "56", value: 56 },
            { label: "57", value: 57 },
            { label: "58", value: 58 },
            { label: "59", value: 59 },
          ]}
          defaultValue={0}
          containerStyle={styles.picker}
          style={{ backgroundColor: pickerColor }}
          itemStyle={
            styles.flexStart
          }
          dropDownStyle={{ backgroundColor: pickerColor }}
          onChangeItem={item => props.myGoal.setMin(item.value)}
        />
      </View>
    </View>
  );
}
