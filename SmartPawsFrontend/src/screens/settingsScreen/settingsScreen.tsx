import React from "react";
import { Text, TouchableOpacity, StyleSheet, FlatList, View, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { getAuth, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'Settings'>

// OptionsList component
const OptionsList: React.FC = () => {
    const navigation = useNavigation<HomeStackNavigationProps>();

    const listData = [
        { id: '1', title: 'User Profile', screen: 'UserProfile' },
        { id: '2', title: 'Inactive Pets', screen: 'InactivePets' },
        { id: '3', title: 'Terms of Use', screen: 'TermsOfUse' },
    ];

    const renderItem = ({ item }: { item: typeof listData[0] }) => (
        <TouchableOpacity
            style={styles.optionItem}
            onPress={() => navigation.navigate(item.screen as any)}
        >
            <Text style={styles.optionText}>{item.title}</Text>
            <Text style={styles.optionArrow}>→</Text>
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        />
    );
};

const SettingsScreen = () => {
    // const homeStackNavigation = useNavigation<HomeStackNavigationProps>();
    const auth = getAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("Error signing out of firebase:", error);
        }
    };

    // firebase auth used to send password reset email to user's registered email address
    const handleResetPassword = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.email) {
                await sendPasswordResetEmail(auth, currentUser.email);
                alert('Password reset email sent successfully.');
            } else {
                alert('Please enter your email.');
            }
        } catch (error) {
            alert('An error occurred while sending the password reset email.');
        }
    };

    return (
        <SafeAreaWrapper>
            <LinearGradient
                colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
                style={styles.linearGradient}
            >
                {/* Ensure text is inside a <Text> component */}
                <Text style={styles.title}>Settings Screen</Text>

                <OptionsList />

                {/* button to reset password, sends password reset link to user's email */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Button title="Reset Password" onPress={handleResetPassword} />
                    <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 30 }}>A link will be sent to your registered email to reset your password</Text>
                </View>
                <TouchableOpacity style={styles.logOutButton} onPress={handleSignOut}>
                    {/* Ensure text is inside a <Text> component */}
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
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    optionText: {
        fontSize: 18,
        color: 'white', // Adjust as per your theme
    },
    optionArrow: {
        fontSize: 18,
        color: 'white',
    },
});

export default SettingsScreen;

