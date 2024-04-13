import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, KeyboardAvoidingView, Pressable, TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity, ScrollView } from "react-native"; // Add missing import
import { IUser } from "../../types";
import { AuthScreenNavigationType } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Box, Text } from "../../utils/theme/style";
import Input from "../../components/shared/input";
import { signInWithEmailAndPassword } from "firebase/auth"; // Correct import
import { FIREBASE_AUTH } from "../../services/firebase";
import { LinearGradient } from "expo-linear-gradient";

import { useContext } from "react";
import { NavigationContext } from "../../navigation/navigationContext";

import { Alert } from "react-native";

interface SignInScreenProps { // Add interface for props
}


// const SignInScreen: React.FC<SignInScreenProps> = (props) => { // Add props parameter
const SignInScreen: React.FC<SignInScreenProps> = () => { // Add props parameter
  // navigate to Home screen after logging in process is complete
  const { setInitialScreen } = useContext(NavigationContext);

  // set initial screen of home stack to Home skipping onboarding screens since user already has an account
  useEffect(() => {
    setInitialScreen('Home');
    // setInitialScreen();
  }, []);

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

  const onError = (errors: any, e: any) => {
    console.log(errors, e);
    Alert.alert("Submission Failed", "Please check your input and try again.");
  };

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
      Alert.alert("Login Failed", "An error occurred during login. Please check your credentials and try again.");
      throw error; // Re-throw the error so that it can be caught in the onSubmit function
    }
  };

  return (
    <SafeAreaWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
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
                      style={styles.input}
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
                      style={styles.input}
                      secureTextEntry
                    />
                  )}
                  name="password"
                />
                <Box mt="5.5" />
                <Pressable onPress={navigateToSignUpScreen}>
                  <Text color="fuchsia900" textAlign="right">
                    Creating a new account? Sign up
                  </Text>
                </Pressable>
                <Box mb="5.5" />
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit, onError)}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
              </Box>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </SafeAreaWrapper>
  );
};

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

export default SignInScreen;
