// User's home screen shows already registered pets, button to register a new pet

import { Box, Text } from "../../utils/theme/style";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { TouchableOpacity, Image, ActivityIndicator, Button, ScrollView, View, StyleSheet } from "react-native";
import { HomeStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from "react";
import { IPet, IUser } from "../../types";
import { BASE_URL } from "../../services/config";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useIsFocused } from "@react-navigation/native";

// import emptyPet from "../../../assets/no-image-icon-23485.png";

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

const HomeScreen = () => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true); // Add loading state

    const homeStackNavigation = useNavigation<HomeStackNavigationProps>();
    const navigateToRegPetScreen = () => {
        homeStackNavigation.navigate('RegPet');
    }
    
    const [user, setUser] = useState<IUser>();
    const [pets, setPets] = useState<IPet[]>([]);
    
    const fetchUser = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : "";
            if (!ownerId) throw new Error("No user ID found");
            
            const response = await fetch(`${BASE_URL}user/get/${ownerId}`);
            const data = await response.json();
            setUser(data);
            await fetchPets(ownerId); // Fetch pets after successfully fetching user
        } catch (error) {
            console.error("Error fetching user", error);
        } finally {
            setLoading(false); // Set loading to false regardless of the outcome
        }
    };

    const fetchPets = async (ownerId: string) => {
        try {
            // get current user's uid to associate user with their pets' profiles
            const auth = getAuth();  
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : "";

            // make get request to backend with ownerId of currently logged in user
            // to get all of user's pets
            console.log("fetchPets called");
            console.log(BASE_URL + 'pet/get/' + ownerId);
            const response = await fetch(BASE_URL + 'pet/get/' + ownerId);
            const data = await response.json();
            setPets(data);
            console.log(pets);
        } catch (error) {
            console.error("Error fetching pets", error);
        }
    };    

    useEffect(() => {
        if (isFocused) fetchUser(); // Fetch user and pets when the screen is focused and on initial load
    }, [isFocused]);

    if (loading) {
        // Show loading indicator while data is loading
        return <ActivityIndicator size="large" color="#00ff00" />;
    }
    const handlePetSelection = (pet: IPet) => {
        console.log(pet.name);
        // get pet name passed in from button associated with the pet
        const petName = pet.name;
        // navigate to pet profile screen
        // get current user's uid to associate user with their pets' profiles
        const auth = getAuth();  
        const currentUser = auth.currentUser;
        const ownerId = currentUser ? currentUser.uid : "";

        // navigate to PetProfile screen with parameters needed to find/display pet
        homeStackNavigation.navigate('PetProfile', { ownerId, petName });
    }
    return(
        <SafeAreaWrapper>
            <LinearGradient
                    colors={[
                        "#1B7899",
                        "#43B2BD",
                        "#43B2BD",
                        "#43B2BD",
                        "#1B7899",
                    ]}
                    style={{ flex: 1 }}
                >
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user?.name}'s Pets:</Text>
                    </Box>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <TouchableOpacity 
        onPress={navigateToRegPetScreen} 
        style={[styles.button, { backgroundColor: "#201A64" }]} // Use your styled button
    >
        <Text style={styles.buttonText}>Add New Pet</Text>
    </TouchableOpacity>
</View>
{pets.map((pet: IPet, index: number) => (
    <View key={index} style={[styles.container, { flexDirection: 'row', alignItems: 'center', marginBottom: 6 }]}>
        {/* trying to get rid of warning source.uri should not be an empty string */}
        {/* <Image
            source={{ uri: pet.image }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
            resizeMode="cover"
        /> */}

        {/* check if pet.image has been assigned then render image next to pet name */}
        {/* if not render default empty placeholder image */}
        <Image
            source={pet.image !== '' ? { uri: pet.image } : require('../../../assets/no-image-icon-23485.png')}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
            resizeMode="cover"
        />
        <TouchableOpacity 
            onPress={() => handlePetSelection(pet)} 
            style={[styles.button, { backgroundColor: "#1B7899" }]} // Use your styled button
        >
            <Text style={styles.buttonText}>{pet.name}</Text>
        </TouchableOpacity>
    </View>
))}

            </ScrollView>
            </LinearGradient>
        </SafeAreaWrapper>
    )
}

const styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
        paddingHorizontal: 5.5,
        marginTop: 13,
    },
    centeredView: {
        alignItems: 'center', // This will center the child components horizontally
        justifyContent: 'center', // This will center the child components vertically if the view has a defined height
        flex: 1,
    },
    headerText: {
        fontSize: 24, // Adjust the font size as needed
        fontWeight: 'bold', // If you want the text to be bold
        textAlign: 'center', // Center the text horizontally
        marginTop: 20, // Optional: add some spacing at the top
        marginBottom: 20, // Optional: add some spacing at the bottom
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.0)',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30, // Adjust this value to control the "ovalness" of the button
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});



export default HomeScreen
