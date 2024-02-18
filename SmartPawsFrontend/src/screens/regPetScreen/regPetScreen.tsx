import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React from "react"
import { Button, View } from "react-native";

const RegPetScreen = () => {

    return(
        <SafeAreaWrapper>
            <Box>
                <Text>Register Pet Screen</Text>
            </Box>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Box mt={"5"} width={150} height={500}>
                    {/* need onPress={handleSubmit(onSubmit)} function created to navigate to pet profile create page */}
                    {/* <Button title="RegisterPet" onPress={navigateToWelcomeForNoReason} /> */}
                    <Text>form with input boxes for every pet attribute</Text>
                    <Button title="RegisterPet" />
                </Box>
            </View>
        </SafeAreaWrapper>
    )
}

export default RegPetScreen
