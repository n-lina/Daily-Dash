import * as React from "react"
import { View, ViewStyle, StyleSheet, TextInput} from "react-native";
import { spacing } from "../../theme"
import { Text } from "../"
import { TimeForm } from "../../models/time-form/time-form"
import DropDownPicker from "react-native-dropdown-picker";
import SwitchSelector from "react-native-switch-selector";

const aqua = "#46BFAC";
const darkAqua = "#008080";

const styles = StyleSheet.create({
  container: {
    height: 35,
    width: 135
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
  sideByside: {
    alignContent: "center",
    flexDirection: "row",
    width: 220
  },
  textInput: {
    fontSize: 15,
    height: 40
  },
  textInputTime1: {
    alignContent: "center",
    flex: 1,
    fontSize: 16,
    height: 40,
    marginLeft: spacing[3],
    textAlign: "right", 
  },
  textInputTime2: {
    alignContent: "center",
    fontSize: 16,
    height: 40,
    textAlign: "left",
  },
  colon: {
    alignContent: "center",
    color: "#000",
    flex: 1,
    fontSize: 17,
    fontWeight: "bold",
    marginTop: spacing[1],
    textAlign: "center"
  }
});

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const pickerColor = "#fff";

export interface StTimeSlotFormProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle
  timeMode: number
  stgIndex?: number 
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
    let mounted = true
    setTimeout(() => {
      if (mounted) {
        const timeMode = props.timeMode;
        const myTimeSlot = props.timeSlot;
        let hrs = parseInt(myTimeSlot.hour);
        if (Number.isNaN(hrs)) {
          setLoading(false);
          return;
        }

        let meridies = "am";

        if (timeMode === 12) {
          if (myTimeSlot.meridies.length > 0) {
            setLoading(false);
            return;
          }

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
          meridies = "";
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
        console.log(hrString);
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
          width: (props.timeMode === 12) ? 305 : 230
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
            placeholderStyle={{fontSize: 16}} 
            labelStyle={{fontSize: 16}}   
            arrowSize={16} 
            arrowColor={darkAqua}
          />
          <TextInput
            testID={"hourInput" + props.stgIndex}
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
            testID={"minInput" + props.stgIndex}
            style={styles.textInputTime2}
            onChangeText={text => validateMin(text)}
            placeholder="mm"
            defaultValue={props.timeSlot.minute}
            keyboardType = 'numeric'
            maxLength = {2}
            value={min}
          />
          {props.timeMode == 12 && (
            <SwitchSelector
              style={{width: 70, marginLeft:spacing[2], marginTop:spacing[1]*0.5}}
              height={34}
              initial={(props.timeSlot.meridies === "pm") ? 1 : 0}
              onPress={value => props.timeSlot.setMeridiem(value as string)}
              textColor='grey'
              selectedColor="#fff"
              buttonColor={aqua}
              borderColor={aqua}
              hasPadding={false}
              options={[
                { label: "AM", value: "am" },
                { label: "PM", value: "pm" } 
              ]}
            />
            )}
        </View>
      )}
    </View>
  )
}
