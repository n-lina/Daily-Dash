import React from "react";

import { AwardsScreen, ProfileScreen } from "../screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

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
    profile: undefined
    awards: undefined
  }

const Stack = createNativeStackNavigator<RootParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="profile"
      screenOptions={{
        gestureEnabled: true,
        stackPresentation: "modal",
        headerShown: false
      }}
    >
      <Stack.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="awards"
        component={AwardsScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
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
const exitRoutes = ["profile"];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
