// All screens shown in the homestack.

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import {HomeStackParamList} from "./types"
import HomeScreen from "../screens/homeScreen/homeScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
           <Stack.Screen name={"Home"} component={HomeScreen}/>
        </Stack.Navigator>
    )
}

export default HomeStackNavigator