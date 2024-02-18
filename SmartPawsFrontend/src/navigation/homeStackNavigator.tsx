// All screens shown in the homestack.

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import {HomeStackParamList} from "./types"
import HomeScreen from "../screens/homeScreen/homeScreen"
import RegPetScreen from "../screens/regPetScreen/regPetScreen"

// added RegPet: undefined to HomeStackParamList in types.tsx
const Stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator>
           <Stack.Screen name={"Home"} component={HomeScreen}/>
           {/* adding register pet screen */}
           <Stack.Screen name={"RegPet"} component={RegPetScreen}/>
        </Stack.Navigator>
    )
}

export default HomeStackNavigator