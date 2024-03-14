import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { BASE_URL } from "../../services/config";
import { LinearGradient } from "expo-linear-gradient";

const AIScreen = () => {
    const [inputText, setInputText] = useState('');
    const [responseText, setResponseText] = useState('');

    const handleSendRequest = async () => {
        try {
            const response = await fetch(BASE_URL + 'user/chatGPT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: inputText }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch: ' + response.statusText);
            }

            const data = await response.json();
            setResponseText(data.message.content);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to send request');
        }
    };
    return (
        <LinearGradient
            colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
            style={styles.linearGradient}
        >
            <ScrollView contentContainerStyle={styles.chatContainer}>
                {/* Display response text here */}
                <Text style={styles.responseText}>{responseText}</Text>
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your input..."
                    onChangeText={setInputText}
                    value={inputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
                    <Text style={styles.sendButtonText}>Send to Gigi</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    responseText: {
        // Style for your response text
        textAlign: 'right',
        margin: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 20, // Making it oval
        backgroundColor: '#f9f9f9', // Lighter background
        paddingHorizontal: 15,
        marginRight: 10, // Spacing between input and button
    },
    sendButton: {
        backgroundColor: '#201A64',
        borderRadius: 20, // Oval shape
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        // Additional text styling as needed
    },
});

export default AIScreen;
