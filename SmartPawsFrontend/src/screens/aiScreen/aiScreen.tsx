import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AiScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to PetTracker!</Text>
            <Text style={styles.subtitle}>Your Pet's Personalized Companion</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Today's Summary</Text>
                {/* Display summary of pet's activities, health stats, etc. */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#888888',
        marginBottom: 20,
    },
    card: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default AiScreen;
