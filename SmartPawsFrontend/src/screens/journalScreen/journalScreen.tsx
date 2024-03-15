import React, { useState } from 'react';
import { Keyboard, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const JournalScreen = () => {
    const [entry, setEntry] = useState('');

    const handleSaveEntry = () => {
        console.log('Entry saved:', entry);
        setEntry('');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
          style={styles.linearGradient}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Journal</Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write your journal entry here..."
              value={entry}
              onChangeText={setEntry}
            />
            <TouchableOpacity style={styles.button} onPress={handleSaveEntry}>
              <Text style={styles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  };

const styles = StyleSheet.create({
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
        height: 200,
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
});

export default JournalScreen;
