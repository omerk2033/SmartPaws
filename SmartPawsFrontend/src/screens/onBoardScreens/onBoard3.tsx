import React from 'react'
import {useNavigation} from "@react-navigation/native";
import {AuthScreenNavigationType} from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import {LinearGradient} from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import Button from "../../components/shared/button";

export default function OnBoarding3 (){

    const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>()
    const navigateToSignUpScreen = () => {
        navigation.navigate("SignUp")
    }

    const navigateToOnboard2Screen = () => {
        navigation.navigate("Onboard2")
    }
    return (
        <SafeAreaWrapper>
            <LinearGradient
                colors={[
                    "#ffffff",
                    "#fcecff",
                    "#f8daff",
                    "#fae2ff",
                    "#fae2ff",
                    "#ffffff",
                ]}
                style={{ flex: 1 }}
            >
                <Box flex={1} justifyContent="center">
                    <Box alignItems="center" mb="3.5">

                    </Box>
                    <Text textAlign="center" variant="textXl" fontWeight="700">
                        Helping you, help your pet.
                    </Text>
                    <Box my="3.5" mx="10">
                        <Button
                            label="SmartPaws"
                            onPress={navigateToSignUpScreen}
                        />
                    </Box>
                    <Box my="3.5" mx="10">
                        <Button
                            label="Back"
                            onPress={navigateToOnboard2Screen}
                        />
                    </Box>
                    <Text
                        textAlign="center"
                        variant="textXs"
                        fontWeight="700"
                        color="gray5"
                    >
                        7 billion users registered today....
                    </Text>
                </Box>
            </LinearGradient>
        </SafeAreaWrapper>
    )

}