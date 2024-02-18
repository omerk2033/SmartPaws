// Screens that are shown in the Authentication Stack, screens user sees before logging in
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { AuthStackParamList } from "./types"
import WelcomeScreen from "../screens/welcomeScreen/welcomeScreen";
import SignInScreen from "../screens/signInScreen/signInScreen";
import SignUpScreen from "../screens/signUpScreen/signUpScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Welcome"
                options={{
                    // changing to allow for back button option
                    // headerShown: false,
                    headerTitle: "",
                    headerBackTitleVisible: false,
                }}
                component={WelcomeScreen}
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