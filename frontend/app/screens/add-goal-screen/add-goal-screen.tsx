import React from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput} from "react-native"
import { Button, Header, Screen, Text, FormRow } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color, spacing, typography} from "../../theme"
//import {Picker} from '@react-native-community/picker'

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
  fontSize: 20,
  lineHeight: 30,
  textAlign: "center",
  marginBottom: spacing[5],
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
        <Text style={TITLE2} text="I want to ... " />
        <TextInput 
          style={{ height: 40}}
          onChangeText={text => onChangeLTgoal(text)}
          value={LTgoal}
          placeholder="be a happier person ..."
        />
        < Separator />
        <Text style={TITLE2} text="Small tasks I can do regularly to achieve my goal include ..." />
        <TextInput
          style={{ height: 40}}
          onChangeText={text => onChangeSTgoal(text)}
          value={STgoal}
          placeholder="smiling every morning!"
        />
        < Separator />
        {/* <View style={styles.sideByside}>
        </View> */}
        {/* <Picker
          selectedValue={'monday'}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            onChangeDay(itemValue as string)
          }>
          <Picker.Item label="Monday" value="monday" />
          <Picker.Item label="Tuesday" value="tuesday" />
        </Picker> */}
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
