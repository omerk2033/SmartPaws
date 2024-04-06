import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { BASE_URL } from '../../services/config';
import SafeAreaWrapper from '../../components/shared/safeAreaWrapper';

const UserProfileScreen = () => {
    const [user, setUser] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const userId = currentUser ? currentUser.uid : '';

            const response = await fetch(`${BASE_URL}user/get/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUser({ name: data.name, email: data.email });
        } catch (error) {
            console.error("Error fetching user data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSave = async () => {
        // Implement save logic here
        // Send updated user data to your backend
        // This could be a PATCH or PUT request to `${BASE_URL}user/update/${user.id}`
        // Depending on your API's implementation

        Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    };

    if (loading) {
        return <Text>Loading...</Text>; // Or any other loading indicator you prefer
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={user.name}
                    onChangeText={(text) => setUser({...user, name: text})}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={user.email}
                    onChangeText={(text) => setUser({...user, email: text})}
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 20,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#1B7899',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    }
});

export default UserProfileScreen;
