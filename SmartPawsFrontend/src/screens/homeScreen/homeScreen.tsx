// Basic home screen

// adding button to navigate to regPetScreen
import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React from "react"
import { Button, ScrollView, View } from "react-native";
import {HomeStackParamList} from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth, signOut } from 'firebase/auth';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

const HomeScreen = () => {
    const homeStackNavigation = useNavigation<HomeStackNavigationProps>()
    const navigateToRegPetScreen = () => {
        homeStackNavigation.navigate('RegPet');
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
                    <Text>Home Screen</Text>
                </Box>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Box mt={"5"} width={150} height={500}>
                        <Button title="Add Pet" onPress={navigateToRegPetScreen}/>
                    </Box>
                    <Box mt={"5"} width={150} height={500}>
                        <Button title="Log Out" onPress={handleSignOut}/>
                    </Box>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    )
}

export default HomeScreen
