import * as React from "react"
import { TextStyle, View, ViewStyle, StyleSheet, TextInput } from "react-native";
import { color, spacing, typography } from "../../theme"
import { Text } from "../"
import { TimeForm } from "../../models/time-form/time-form"
import DropDownPicker from "react-native-dropdown-picker";


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
}

const pickerColor = "#fafafa";


const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface StTimeSlotFormProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  timeMode: number
  index?: number 
  timeSlot: TimeForm
}

/**
 * Describe your component here
 */
export function StTimeSlotForm(props: StTimeSlotFormProps) {

  const { style } = props

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
    props.timeSlot.setHour(hour);
  }

  function validateMin(minute: string) {
    minute = minute.replace(/[^0-9]/g, "");
    if (parseInt(minute) > 59) {
      minute = (59).toString();
    }
    changeMin(minute);
    props.timeSlot.setMin(minute);
  }

  const [hour, changeHour] = React.useState(props.timeSlot.hour);
  const [min, changeMin] = React.useState(props.timeSlot.minute);

  const [loading, setLoading] = React.useState(true);

  // update times when timeMode changes
  React.useEffect(() => {
    setLoading(true);
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        const timeMode = props.timeMode;
        const myTimeSlot = props.timeSlot;
        let hrs = parseInt(myTimeSlot.hour);
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
        } else if (myTimeSlot.meridies !== "") {
          if (myTimeSlot.meridies === "pm") {
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
        myTimeSlot.setHour(hrString);
        myTimeSlot.setMeridiem(meridies);
        changeHour(hrString);

        setLoading(false);
      }
    }, 1);
    return () => mounted = false;
  }, [props.timeMode]);

  return (
    <View style={[CONTAINER, style]}>
      {!loading && (
        <View style={{
          ...styles.sideByside,
          width: (props.timeMode === 12) ? 290 : 220
        }}>
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
            defaultValue={props.timeSlot.day}
            containerStyle={styles.container}
            style={{ backgroundColor: pickerColor }}
            itemStyle={
              styles.flexStart
            }
            dropDownStyle={{ backgroundColor: pickerColor }}
            onChangeItem={item => props.timeSlot.setDay(item.value)}
          />
          <TextInput
            testID={"hourInput" + props.index}
            style={styles.textInputTime1}
            onChangeText={text => validateHour(text)}
            placeholder="hh"
            defaultValue={props.timeSlot.hour}
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
            defaultValue={props.timeSlot.minute}
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
              defaultValue={props.timeSlot.meridies}
              containerStyle={styles.amPmContainer}
              style={{ backgroundColor: pickerColor }}
              itemStyle={styles.flexStart}
              dropDownStyle={{ backgroundColor: pickerColor }}
              onChangeItem={(item) => props.timeSlot.setMeridiem(item.value)}
            />)}
        </View>
      )}
    </View>
  )
}
