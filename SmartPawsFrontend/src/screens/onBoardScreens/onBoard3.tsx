import React from 'react'
import {useNavigation} from "@react-navigation/native";
import {AuthScreenNavigationType} from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import {LinearGradient} from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import Button from "../../components/shared/button";
import {Image} from 'react-native';

export default function OnBoarding3 (){

    const navigation = useNavigation<AuthScreenNavigationType<"Onboard3">>()
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
                    "#62BFED",
                    "#62BFED",
                    "#62BFED",
                    "#62BFED",
                    "#62BFED",
                    "#62BFED",
                ]}
                style={{ flex: 1 }}
            >
                <Box flex={1} justifyContent="center">
                    <Box alignItems="center" mb="3.5">

                    </Box>
                    <Text textAlign="center" variant="textXl" fontWeight="700">
                        Gigi:
                        Your very own AI companion! Gigi can assist you with any of your questions or concerns
                        about your pet. Don't worry Gigi doesn't bite!
                  
                    </Text>
                    <Box my="3.5" mx="10">
                        <Button
                            label="Next"
                            onPress={navigateToSignUpScreen}
                        />
                    </Box>
                    <Box my="3.5" mx="10">
                        <Button
                            label="Back"
                            onPress={navigateToOnboard2Screen}
                        />
                    </Box>
                </Box>
            </LinearGradient>
        </SafeAreaWrapper>
    )

}