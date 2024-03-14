import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TouchableWithoutFeedback, Keyboard, Image } from "react-native"; // Add missing import
import { IUser } from "../../types";
import { AuthScreenNavigationType } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Box, Text } from "../../utils/theme/style";
import Input from "../../components/shared/input";
import Button from "../../components/shared/button";
import { signInWithEmailAndPassword } from "firebase/auth"; // Correct import
import { FIREBASE_AUTH } from "../../services/firebase";
import { LinearGradient } from "expo-linear-gradient";

interface SignInScreenProps { // Add interface for props
}

const SignInScreen: React.FC<SignInScreenProps> = (props) => { // Add props parameter
    const navigation = useNavigation<AuthScreenNavigationType<"SignIn">>();
    const navigateToSignUpScreen = () => {
        navigation.navigate("SignUp");
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            name: "", // Include name here to match IUser interface
            email: "",
            password: "",
        },
    });


    const onSubmit = async (data: IUser) => {
        try {
            const { email, password } = data;
            await loginWithEmailAndPassword(email, password);
            // No need to navigate here, navigation happens after successful login in loginWithEmailAndPassword
        } catch (error) {
            console.log("Error submitting form:");
            // Handle error, maybe show a message to the user
        }
    };

    return (
        <SafeAreaWrapper>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                    colors={[
                        "#43B2BD",
                        "#EEEEEE",
                        "#EEEEEE",
                        "#EEEEEE",
                        "#EEEEEE",
                        "#43B2BD",
                    ]}
                    style={{ flex: 1 }}
                >
                <Box flex={1} px="5.5" justifyContent="center">
                    <Box mb="6" />
                    <Text variant="textLg" color="neutral700" fontWeight="700" mb="10">
                        Welcome Back!
                    </Text>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your email..."
                                error={errors.email}
                            />
                        )}
                        name="email"
                    />
                    <Box mb="6" />
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your password..."
                                error={errors.password}
                                secureTextEntry
                            />
                        )}
                        name="password"
                    />
                    <Box mt="5.5" />
                    <Pressable onPress={navigateToSignUpScreen}>
                        <Text color="primary" textAlign="right">
                            Creating a new account? Sign up
                        </Text>
                    </Pressable>
                    <Box mb="5.5" />
                    <Button label="Login" onPress={handleSubmit(onSubmit)} uppercase />
                    </Box>
            </LinearGradient>
            </TouchableWithoutFeedback>
        </SafeAreaWrapper>
    );
};

// Logs in with email and password provided by User. Checks firebase if user is in there.
const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user);
        // Navigate to the next screen after successful login
    } catch (error) {
        console.log('Error signing in:');
        throw error; // Re-throw the error so that it can be caught in the onSubmit function
    }
};

export default SignInScreen;
