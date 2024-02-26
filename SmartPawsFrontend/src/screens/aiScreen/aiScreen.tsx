import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { BASE_URL } from "../../services/config";

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
                throw new Error('Failed to fetch: ' + response.body);
            }

            const data = await response.json();
            console.log(data.message.content)
            setResponseText(data.message.content); // Assuming your server responds with a JSON object containing the response

        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to send request');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
                placeholder="Enter your input"
                onChangeText={setInputText}
                value={inputText}
            />
            <Button title="Send Request" onPress={handleSendRequest} />
            <Text>{responseText}</Text>
        </View>
    );
};


export default AIScreen;
