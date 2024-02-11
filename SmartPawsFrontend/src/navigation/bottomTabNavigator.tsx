// Screens that can be accessed via the bottom tab navigator.

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {RootBottomTabParamList} from "./types";
import React from "react";
import HomeStackNavigator from "./homeStackNavigator";


const Tab = createBottomTabNavigator<RootBottomTabParamList>()

const BottomTabNavigator = () => {
    return <Tab.Navigator>
        <Tab.Screen name={"HomeStack"} component={HomeStackNavigator} options={{headerShown: false}}></Tab.Screen>

    </Tab.Navigator>
}

export default BottomTabNavigator