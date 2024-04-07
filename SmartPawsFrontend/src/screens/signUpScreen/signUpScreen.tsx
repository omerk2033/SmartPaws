import { Box, Text } from "../../utils/theme/style";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigationType } from "../../navigation/types";
import { Pressable, TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Controller, useForm } from "react-hook-form";
import { IUser } from "../../types";
import Input from "../../components/shared/input";
import { FIREBASE_AUTH } from "../../services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import axiosInstance from "../../services/config";
import { LinearGradient } from "expo-linear-gradient";

import { useContext } from 'react';
import { NavigationContext } from "../../navigation/navigationContext";

const SignUpScreen = () => {
    // navigate to Onboard1 screen after registration is complete
    const { setInitialScreen } = useContext(NavigationContext);

    // set initial screen in home stack navigator to be Onboard1 since coming from SignUp
    useEffect(() => {
        setInitialScreen('Onboard1');
    }, []);

    const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>()
    const navigateToSignInScreen = () => {
        navigation.navigate("SignIn")
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "", // Add name in default values
        },
    })

    const onSubmit = async (data: IUser) => {
        try {
            // const { email, name, password } = data;
            const { email, name, password, confirmPassword } = data;

            // check if password matches
            if(password !== confirmPassword) {
                Alert.alert("The passwords entered do not match. Please try again.");
                return;
            }
            /**
             * register user
             */
            await signUpWithEmailAndPassword(email, password, name);
            // navigateToSignInScreen() // Removed to avoid navigation until user is registered in MongoDB
        } catch (error) {
            Alert.alert("Submission Failed", "Please check your input and try again.");
        }
    }

    return (
        <SafeAreaWrapper>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                    colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"
                    ]}
                    style={{ flex: 1 }}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 0}
                    >
                         <ScrollView 
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollViewContent}
                            keyboardShouldPersistTaps="handled"
                        >
                {/* removed mt="13" to be able to see password input box above keyboard */}
                <Box flex={1} px="5.5" >
                    <Text variant="textLg" color="neutral700" fontWeight="700" mb="10">
                        
                    </Text>

                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your name..."
                                error={errors.name}
                                style={styles.input} // Applying the custom style
                            />
                        )}
                        name="name"
                    />
                    <Box mb="6" />
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Email"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your email..."
                                error={errors.email}
                                style={styles.input}
                            />
                        )}
                        name="email"
                    />
                    <Box mb="6" />
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Enter your password..."
                                error={errors.password}
                                style={styles.input}
                                secureTextEntry
                            />
                        )}
                        name="password"
                    />
                    <Box mb="6" />
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirm Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Re-enter your password..."
                                error={errors.confirmPassword}
                                style={styles.input}
                                secureTextEntry
                            />
                        )}
                        name="confirmPassword"
                    />

                    <Box mt="5.5" />
                    <Pressable onPress={navigateToSignInScreen}>
                        <Text color="fuchsia900" textAlign="right">
                            Already have an account? Sign in
                        </Text>
                    </Pressable>
                    <Box mb="5.5" />
                    <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Register</Text>
                    </TouchableOpacity>
                    </Box>
                    </ScrollView>
                    </KeyboardAvoidingView>
                </LinearGradient>
            </TouchableWithoutFeedback>
        </SafeAreaWrapper>
    )
}

const signUpWithEmailAndPassword = async (email: string, password: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        // Signed in
        const user = userCredential.user;
        console.log('User logged in:', user);

        // Update the user's profile with their name
        await updateProfile(user, {
            displayName: name
        });
        console.log("User's display name updated:", name);

        // Save user to MongoDB
        await registerUserMongoDB(name, email, user.uid, password);
        console.log("User registered to MongoDB");
        // Navigate to the next screen after successful login
    } catch (error) {
        console.log("Error registering user", error);
        // Handle error, maybe show a message to the user
        throw error;


    }
}
// Takes UID provided by firebase API then hits backend API to store information in MongoDB database.
const registerUserMongoDB = async (name: string, email: string, uid: string, password: string) => {
    try {
        const response = await axiosInstance.post("user/create", {
            email,
            password,
            uid,
            name,
        });
        return response.data.user;
    } catch (error) {
        console.log("error in registerUser", error);
        throw error;
    }
}
;
const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#201A64', // Button color
        borderRadius: 20, // If you want the button to be oval-shaped
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loginButtonText: {
        color: '#FFFFFF', // Text color
        fontSize: 16,
        textTransform: 'uppercase', // If you want the text to be uppercase
      },
    linearGradient: {
        flex: 1,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    input: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        borderRadius: 25, // oval shape
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // semi-transparent white
        color: 'black', // ensure text is readable on light background
        marginBottom: 20,
        textAlignVertical: 'top', // start text from the top of the text input
    },
    button: {
        backgroundColor: '#201A64',
        borderRadius: 20, // oval shape
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    
    keyboardAvoidingView: {
        flex: 1,
      },
      scrollView: {
        flex: 1,
      },
      scrollViewContent: {
        padding: 20,
      },
});

export default SignUpScreen;
