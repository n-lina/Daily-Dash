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
  index?: number
  timeMode: number
}

/**
 * Describe your component here
 */
export function StGoal(props: StGoalProps) {
  // const { style } = props;

  // const Separator = () => (
  //   <View style={styles.separator} />
  // );

  function validateHour(hour: string) {
    hour = hour.replace(/[^0-9]/g, "");
    if (parseInt(hour) > 23) {
      hour = (23).toString();
    }
    if (props.timeMode === 12 && parseInt(hour) > 12) {
      hour = (12).toString();
    }
    if (props.timeMode === 12 && parseInt(hour) < 1) {
      hour = (1).toString();
    }
    changeHour(hour);
    props.myGoal.setHour(hour);
  }

  function validateMin(minute: string) {
    minute = minute.replace(/[^0-9]/g, "");
    if (parseInt(minute) > 59) {
      minute = (59).toString();
    }
    changeMin(minute);
    props.myGoal.setMin(minute);
  }

  const [hour, changeHour] = React.useState(props.myGoal.hour);
  const [min, changeMin] = React.useState(props.myGoal.minute);
  const [loading, setLoading] = React.useState(true);

  // update times when timeMode changes
  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const timeMode = props.timeMode;
      const myGoal = props.myGoal;
      let hrs = parseInt(myGoal.hour);
      if (Number.isNaN(hrs)) {
        setLoading(false);
        return;
      }
      console.log(hrs);

      let meridies = "am";

      if (timeMode === 12) {
        if (hrs >= 12) {
          meridies = "pm";
        } else {
          meridies = "am";
        }

        if (hrs === 0) {
          hrs = 12;
        } else if (hrs > 12) {
          hrs -= 12;
        }
      } else if (myGoal.meridies !== "") {
        if (myGoal.meridies === "pm") {
          if (hrs < 12) {
            hrs += 12;
          }
        } else {
          if (hrs === 12) {
            hrs = 0;
          }
        }
      }

      const hrString = (hrs).toString();
      myGoal.setHour(hrString);
      myGoal.setMeridiem(meridies);
      changeHour(hrString);

      setLoading(false);
    }, 1);
  }, [props.timeMode]);

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
          {/* < Separator /> */}
          <View style={{
            ...styles.sideByside,
            width: (props.timeMode === 12) ? 290 : 220
          }}>
            {/* <Picker
          testID="dayPicker"
         selectedValue={pickerVal}
         style={{height: 50, width: 150}}
         onValueChange={(itemValue, itemIndex) => {
          props.myGoal.setDay(itemValue as string);
          setPicker(itemValue as string)
          }
         }>
         <Picker.Item label="Monday" value="mon" testID="mon"/>
         <Picker.Item label="Tuesday" value="tue" testID="tue"/>
         <Picker.Item label="Wednesday" value="wed" testID="wed"/>
         <Picker.Item label="Thursday" value="thu" testID="thu"/>
         <Picker.Item label="Friday" value="fri" testID="fri" />
         <Picker.Item label="Saturday" value="sat" testID="sat"/>
         <Picker.Item label="Sunday" value="sun" testID="sun"/>
        </Picker> */}
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
              testID={"hourInput" + props.index}
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
              testID={"minInput" + props.index}
              style={styles.textInputTime2}
              onChangeText={text => validateMin(text)}
              placeholder="mm"
              defaultValue={props.myGoal.minute}
              keyboardType = 'numeric'
              maxLength = {2}
              value={min}
            />
            {props.timeMode == 12 && (
              <DropDownPicker
                items={[
                  { label: "am", value: "am" },
                  { label: "pm", value: "pm" }
                ]}
                defaultValue={props.myGoal.meridies}
                containerStyle={styles.amPmContainer}
                style={{ backgroundColor: pickerColor }}
                itemStyle={styles.flexStart}
                dropDownStyle={{ backgroundColor: pickerColor }}
                onChangeItem={(item) => props.myGoal.setMeridiem(item.value)}
              />)}
          </View>
        </View>
      )}
    </View>
  );
}
