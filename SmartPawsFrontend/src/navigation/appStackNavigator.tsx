// The screens presented in the AppStack, bottomTabNavigator. What the user sees when user is authenticated.


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AppStackParamList } from "./types";
import BottomTabNavigator from "./bottomTabNavigator";

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStackNavigator = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name={"Root"} component={BottomTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AppStackNavigator