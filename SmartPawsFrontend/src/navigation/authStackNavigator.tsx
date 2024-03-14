// Screens that are shown in the Authentication Stack, screens user sees before logging in
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { AuthStackParamList } from "./types"
import WelcomeScreen from "../screens/welcomeScreen/welcomeScreen";
import SignInScreen from "../screens/signInScreen/signInScreen";
import SignUpScreen from "../screens/signUpScreen/signUpScreen";
import OnBoarding1 from "../screens/onBoardScreens/onBoard1";
import OnBoarding2 from "../screens/onBoardScreens/onBoard2";
import OnBoarding3 from "../screens/onBoardScreens/onBoard3";



const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                options={{
                    headerShown: false,
                }}
                component={WelcomeScreen}
            />
            <Stack.Screen
                name="Onboard1"
                options={{
                    // changing to allow for back button option
                    // headerShown: false,
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={OnBoarding1}
            />
            <Stack.Screen
                name="Onboard2"
                options={{
                    headerShown: false,
                }}
                component={OnBoarding2}
            />
            <Stack.Screen
                name="Onboard3"
                options={{
                    headerShown: false,
                }}
                component={OnBoarding3}
            />
            <Stack.Screen
                name="SignIn"
                options={{
                    // changing to allow for back button option
                    // headerShown: false,
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={SignInScreen}
            />
            <Stack.Screen
                name="SignUp"
                options={{
                    // changing to allow for back button option
                    // headerShown: false,
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={SignUpScreen}
            />
        </Stack.Navigator>
    )
}

export default AuthStackNavigator