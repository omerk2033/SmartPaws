// User's home screen shows already registered pets, button to register a new pet

import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Button, ScrollView, View, StyleSheet } from "react-native";
import {HomeStackParamList} from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth, signOut } from 'firebase/auth';

import React, { useEffect, useState } from "react";
import { IPet, IUser } from "../../types";
import { BASE_URL } from "../../services/config";


type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

const HomeScreen = () => {
    const homeStackNavigation = useNavigation<HomeStackNavigationProps>();
    const navigateToRegPetScreen = () => {
        homeStackNavigation.navigate('RegPet');
    }

    const auth = getAuth(); // get auth instance of app

    // sign user out of firebase
    // index.tsx will handle switching to AppStackNavigator once user is signed out
    // and screen will change to welcome screen 
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log("error signing out of firebase");
        }
    }

    const [pets, setPets] = useState<IPet[]>([]);

    const fetchPets = async () => {
        try {
            // get current user's uid to associate user with their pets' profiles
            const auth = getAuth();  
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : "";

            // make get request to backend with ownerId of currently logged in user
            // to get all of user's pets
            console.log(BASE_URL + '/pet/get/' + ownerId);
            const response = await fetch(BASE_URL + 'pet/get/' + ownerId);
            const data = await response.json();
            setPets(data);

            console.log(pets);
        } catch (error) {
            console.error("Error fetching pets", error);
        }
    };    

    useEffect(() => {
        fetchPets();
    }, []);

    const handlePetSelection = () => {
        // need to navigate to pet profile screen
        homeStackNavigation.navigate('PetProfile');
    
        // need to be able to have ownerId and pet's name 
        // when the pet profile screen loads to be able to display the correct selected pet
    }

    // get user's name from mongo to display on their home screen
    const [user, setUser] = useState<IUser>();

    const fetchUser = async () => {
        try {
            // get current user's uid to query database
            const auth = getAuth();
            const currentUser = auth.currentUser;
            const ownerId = currentUser ? currentUser.uid : "";
            console.log(BASE_URL + 'user/get/' + ownerId);
            const response = await fetch(BASE_URL + 'user/get/' + ownerId);
            const data = await response.json();
            setUser(data);
            console.log(user);
        } catch (error) {
            console.error("Error fetching user", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return(
        <SafeAreaWrapper>
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Box>
                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hello {user?.name}!</Text>
                    </Box>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* <Box mt={"5"} width={150} height={500}> */}
                    <Box m="6" style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button title="Add Pet" onPress={navigateToRegPetScreen} color={'green'}/>
                    </Box>
                    {pets.map((pet: IPet, index: number) => (
                        <Box key={index} mb="6">
                            <Button title={pet.name} onPress={handlePetSelection}/>
                        </Box>
                    ))}
                    {/* <Box mt={"5"} width={150} height={500}> */}
                    <Box style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button title="Log Out" onPress={handleSignOut} color={'orange'}/>
                    </Box>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    )
}

export default HomeScreen
