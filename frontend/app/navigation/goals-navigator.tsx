/**
 * This is the navigator you will modify to display the goals screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 */
import React from "react"

// import { createNativeStackNavigator } from "react-native-screens/native-stack"
import { AddGoalScreen, EditGoalScreen, GoalDetailScreen, LtgoalsScreen } from "../screens"
import { createNativeStackNavigator } from "react-native-screens/native-stack"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */

export type RootParamList = {
    addGoal: undefined
    editGoal: undefined
    goalDetail: undefined
    allGoals: undefined
  }

const Stack = createNativeStackNavigator<RootParamList>()

export function GoalsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="allGoals"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        stackPresentation: "modal",
      }}
    >
      <Stack.Screen
        name="allGoals"
        component={LtgoalsScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="addGoal"
        component={AddGoalScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="editGoal"
        component={EditGoalScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="goalDetail"
        component={GoalDetailScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["Home"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
