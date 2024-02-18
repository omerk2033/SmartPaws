// Basic home screen

// adding button to navigate to regPetScreen
import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React from "react"
import { Button, View } from "react-native";
import {HomeStackParamList} from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProps>()
    const navigateToRegPetScreen = () => {
        navigation.navigate('RegPet');
    }

    return(
        <SafeAreaWrapper>
            <Box>
                <Text>Home Screen</Text>
            </Box>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Box mt={"5"} width={150} height={500}>
                    <Button title="Add Pet" onPress={navigateToRegPetScreen}/>
                </Box>
            </View>
        </SafeAreaWrapper>
    )
}

export default HomeScreen
