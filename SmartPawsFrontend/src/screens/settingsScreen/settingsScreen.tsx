import React from "react";
import { Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from "../../navigation/types";
import { getAuth, signOut } from 'firebase/auth';
import { LinearGradient } from "expo-linear-gradient";

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Settings'>

const SettingsScreen = () => {
    const homeStackNavigation = useNavigation<HomeStackNavigationProps>();
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("Error signing out of firebase:", error);
        }
    };

    return (
        <SafeAreaWrapper>
            <LinearGradient
                colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
                style={styles.linearGradient}
            >
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    contentContainerStyle={styles.scrollViewContent}
                >
                    <Text style={styles.title}>Settings Screen</Text>
                </ScrollView>
                <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
                    <Text style={styles.logOutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: 'space-between', // Push content to the top and button to the bottom
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20, // Space from top
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'white',
    },
    logOutButton: {
        backgroundColor: 'red',
        borderRadius: 25, // Oval shape
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
        marginBottom: 20, // Space from bottom
    },
    logOutButtonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default SettingsScreen;

