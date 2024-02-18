import { Box, Text } from "../../utils/theme/style";
import React from "react";
import { Button } from "react-native"; // Add this import
import { useNavigation } from "@react-navigation/native";
import { Pressable, TouchableWithoutFeedback, Keyboard, View, ScrollView } from "react-native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {HomeStackParamList} from "../../navigation/types";

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Settings'>

const SettingsScreen = () => {
    const homeStackNavigation = useNavigation<HomeStackNavigationProps>()
    const navigateToRegPetScreen = () => {
        homeStackNavigation.navigate('Settings');
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
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    )
}

export default SettingsScreen
