import React from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput} from "react-native"
import { Button, Header, Screen, Text, FormRow } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography} from "../../theme"
import DropDownPicker from 'react-native-dropdown-picker'
import Icon from 'react-native-vector-icons/Feather';


const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
 // justifyContent: "center",
}

const Separator = () => (
  <View style={styles.separator} />
);

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  marginTop: spacing[5],
}
const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 15,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
  marginLeft: spacing[3],
  marginRight: spacing[3],
}

const FULL: ViewStyle = { 
  flex: 1 
}

export const AddGoalScreen = observer(function AddGoalScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()
  const nextScreen = () => navigation.navigate("primaryStack.home")
  const [LTgoal, onChangeLTgoal] = React.useState('');
  const [STgoal, onChangeSTgoal] = React.useState('');
  const [day, onChangeDay] = React.useState('monday');
  const [hour, onChangeHr] = React.useState(0);
  const [min, onChangeMin] = React.useState(0);

  return (
    <View style={FULL}>
      <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Add New Goal   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/compass.png")} style={styles.image} />
        < Separator />
        < Separator />
        <View style={styles.sideByside}>
          <Text style={TITLE2} text="My goal is to .. " />
          <TextInput 
            style={{ height: 40, fontSize: 15}}
            onChangeText={text => onChangeLTgoal(text)}
            value={LTgoal}
            placeholder="be a happier person."
          />
        </View>
        <View style={styles.sideByside}>
          <Text style={TITLE2} text="Description:" />
          <TextInput 
            style={{ height: 40, fontSize: 15}}
            onChangeText={text => onChangeLTgoal(text)}
            value={LTgoal}
            placeholder="(Optional) I do better when I'm happy."
          />
        </View>
        <Text style={TITLE2} text="Regular Habits: " />
        <View style={styles.sideByside}>
          <Text style={TITLE2}>●</Text>
          <TextInput
            style={{ height: 40, fontSize: 15}}
            onChangeText={text => onChangeSTgoal(text)}
            value={STgoal}
            placeholder="call a friend once a week"
          />
        </View>
        < Separator />
        <View style={styles.sideByside}>
        <DropDownPicker
            items={[
                {label: 'Monday', value: 'monday'},
                {label: 'Tuesday', value: 'tuesday'},
                {label: 'Wednesday', value: 'wednesday'},
                {label: 'Thursday', value: 'thursday'},
                {label: 'Friday', value: 'friday'},
                {label: 'Saturday', value: 'saturday'},
                {label: 'Sunday', value: 'sunday'},
            ]}
            defaultValue={'monday'}
            containerStyle={{height: 35, width: 120}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => onChangeDay(item.value)}
        />
        <DropDownPicker
            items={[
                {label: '00', value: 0},
                {label: '01', value: 1},
                {label: '02', value: 2},
                {label: '03', value: 3},
                {label: '04', value: 4},
                {label: '05', value: 5},
                {label: '06', value: 6},
                {label: '07', value: 7},
                {label: '08', value: 8},
                {label: '09', value: 9},
                {label: '10', value: 10},
                {label: '11', value: 11},
                {label: '12', value: 12},
                {label: '13', value: 13},
                {label: '14', value: 14},
                {label: '15', value: 15},
                {label: '16', value: 16},
                {label: '17', value: 17},
                {label: '18', value: 18},
                {label: '19', value: 19},
                {label: '20', value: 20},
                {label: '21', value: 21},
                {label: '22', value: 22},
                {label: '23', value: 23},
            ]}
            defaultValue={0}
            containerStyle={{height: 35, width: 65}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => onChangeHr(item.value)}
        />
        <DropDownPicker
            items={[
                {label: '00', value: 0},
                {label: '01', value: 1},
                {label: '02', value: 2},
                {label: '03', value: 3},
                {label: '04', value: 4},
                {label: '05', value: 5},
                {label: '06', value: 6},
                {label: '07', value: 7},
                {label: '08', value: 8},
                {label: '09', value: 9},
                {label: '10', value: 10},
                {label: '11', value: 11},
                {label: '12', value: 12},
                {label: '13', value: 13},
                {label: '14', value: 14},
                {label: '15', value: 15},
                {label: '16', value: 16},
                {label: '17', value: 17},
                {label: '18', value: 18},
                {label: '19', value: 19},
                {label: '20', value: 20},
                {label: '21', value: 21},
                {label: '22', value: 22},
                {label: '23', value: 23},
                {label: '24', value: 24},
                {label: '25', value: 25},
                {label: '26', value: 26},
                {label: '27', value: 27},
                {label: '28', value: 28},
                {label: '29', value: 29},
                {label: '30', value: 30},
                {label: '31', value: 31},
                {label: '32', value: 32},
                {label: '33', value: 33},
                {label: '34', value: 34},
                {label: '35', value: 35},
                {label: '36', value: 36},
                {label: '37', value: 37},
                {label: '38', value: 38},
                {label: '39', value: 39},
                {label: '40', value: 40},
                {label: '41', value: 41},
                {label: '42', value: 42},
                {label: '43', value: 43},
                {label: '44', value: 44},
                {label: '45', value: 45},
                {label: '46', value: 46},
                {label: '47', value: 47},
                {label: '48', value: 48},
                {label: '49', value: 49},
                {label: '50', value: 50},
                {label: '51', value: 51},
                {label: '52', value: 52},
                {label: '53', value: 53},
                {label: '54', value: 54},
                {label: '55', value: 55},
                {label: '56', value: 56},
                {label: '57', value: 57},
                {label: '58', value: 58},
                {label: '59', value: 59},
            ]}
            defaultValue={0}
            containerStyle={{height: 35, width: 65}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => onChangeMin(item.value)}
        />
        </View>
        < Separator />
        <Button 
          style={styles.button}
          text="Submit"
          onPress={() => navigation.navigate("signInScreen")} />
          {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN*/}
      </Screen>
    </View>
  )
})

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width:50,
    height:50,
  },
  button: {
  },
  sideByside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
