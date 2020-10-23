import { useEffect, useState} from "react"
import React from "react"
import { observer } from "mobx-react-lite"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TextStyle, Image, ViewStyle, View, FlatList, Dimensions, SafeAreaView} from "react-native"
import { Button, Header, Screen, Text } from "../../components"
import { Goal, useStores } from "../../models"
import { color, spacing, typography} from "../../theme"
import { ListItem, Avatar } from "react-native-elements"



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
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
}

const FULL: ViewStyle = { 
  flex: 1 
}

export const LtgoalsScreen = observer(function LtgoalsScreen() {
  // Pull in one of our MST stores
    
    // OR
    // const rootStore = useStores()

    // Pull in navigation via hook
  const {goalsStore} = useStores()
  const navigation = useNavigation()
  // how to pass the item in here from the renderGoal function?
  const getSpecificGoal = (goal) => navigation.navigate("goalDetail", {my_goal: goal})

  useEffect(() => {
    if (goalsStore.goals.length == 0)
    fetchGoals()
  }, [])

  const fetchGoals = () => {
    setRefreshing(true)
    goalsStore.getAllGoals().then(() => {
      setRefreshing(false)
    })
  }

  const renderGoal = ({ item }) => {
    const goal: Goal = item
  
    return (
      <View>
        <Text style={{marginLeft: 10, marginTop: 1}}> {goal.LTgoal}</Text>
        <ListItem onPress={() => getSpecificGoal(item)}>   
          <Avatar source={require('../../../assets/mountain.png')} />
          <ListItem.Content>
            <ListItem.Title>{goal.LTgoal}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    )
  }

  const [refreshing, setRefreshing] = useState(false)

  return (
    <View style={FULL}>
    {/*  <Screen style={ROOT} preset="scroll" backgroundColor={color.transparent}> */}
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   My Goals   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/mountain.png")} style={styles.image} />
        < Separator />
        {/* <Button 
          text="Click Me"
          onPress={() => console.log("Button pressed!")} /> */}
          {/* FETCH DATA FROM API AND RENDER FROM FLATLIST */}
        <SafeAreaView style={{flex: 1}}>
          <FlatList
            style={styles.flatlist}
            data={goalsStore.goals}
            renderItem={renderGoal}
            extraData={{
              extraDataForMobX:
                goalsStore.goals.length > 0 ? goalsStore.goals[0].LTgoal : "",
            }}
            keyExtractor={(item) => item.id}
            onRefresh={fetchGoals}
            refreshing={refreshing}
          ></FlatList>
        </SafeAreaView>
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
  flatlist: {
    marginTop: 40,
    overflow: 'scroll',
    height: 400,
    width: Dimensions.get('window').width - 20
  },
})
