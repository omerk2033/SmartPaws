import { Box, Text } from "../../utils/theme/style";
import React from "react";
import { Button } from "react-native"; // Add this import
import { useNavigation } from "@react-navigation/native";
import { Pressable, TouchableWithoutFeedback, Keyboard, View, ScrollView } from "react-native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {HomeStackParamList} from "../../navigation/types";
import { getAuth, signOut } from 'firebase/auth';


type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Settings'>

const SettingsScreen = () => {
    const homeStackNavigation = useNavigation<HomeStackNavigationProps>()
    const navigateToRegPetScreen = () => {
        homeStackNavigation.navigate('Settings');
    }

    const auth = getAuth(); // get auth instance of app

    // sign user out of firebase
    // index.tsx will handle switching to AppStackNavigator once user is signed out
    // and screen will change to welcome screen 
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("error signing out of firebase");
        }
    }
    return(
        <SafeAreaWrapper>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
                <Box>
                    <Text>Settings Screen</Text>
                </Box>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Box mt={"5"} width={150} height={500}>
                        <Button title="Settings" onPress={navigateToRegPetScreen}/>
                    </Box>
                    <Box style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button title="Log Out" onPress={handleSignOut} color={'orange'}/>
                    </Box>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    )
}

export default SettingsScreen
