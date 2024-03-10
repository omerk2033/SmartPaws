// All screens shown in the homestack.

import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {HomeStackParamList} from "./types";
import HomeScreen from "../screens/homeScreen/homeScreen";
import RegPetScreen from "../screens/regPetScreen/regPetScreen";
import SettingsScreen from "../screens/settingsScreen/settingsScreen";
import { TouchableOpacity, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PetProfileScreen from "../screens/petProfileScreen/petProfileScreen";
import UpdatePetScreen from "../screens/updatePetScreen/updatePetScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>()

const HomeStackNavigator = () => {

    const SettingsButton = () => {
        const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'Settings'>>();

        const navigateToSettingsScreen = () => {
            navigation.navigate('Settings');
        };

        return (
            <TouchableOpacity onPress={navigateToSettingsScreen}>
                <Image
                    source={require('../../assets/settings.png')}
                    style={{ width: 25, height: 25, marginRight: 15 }}
                />
            </TouchableOpacity>
        );
    };


    return (
        <Stack.Navigator>
           <Stack.Screen 
                name={"Home"} 
                options={{
                    headerTitle: "SmartPaws",
                    headerBackTitleVisible: false,
                    headerRight: () => <SettingsButton />,
                    
                }}    
                component={HomeScreen}
            />
           {/* register pet screen */}
           <Stack.Screen 
                name={"RegPet"} 
                options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={RegPetScreen}
            />
            {/* user clicks on the settings button in the header */}
            <Stack.Screen 
                name={"Settings"} 
                options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={SettingsScreen}
            />
            {/* user selects pet from home screen */}
            <Stack.Screen 
                name={"PetProfile"} 
                options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={PetProfileScreen}
            />
            {/* user selects to update pet profile from pet profile screen */}
            <Stack.Screen 
                name={"UpdatePet"}
                options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={UpdatePetScreen}
            />
        </Stack.Navigator>
    )
}

export default HomeStackNavigator