import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Button, ScrollView, View } from "react-native";
import {HomeStackParamList} from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth, signOut } from 'firebase/auth';

import React, { useEffect, useState } from "react";
import { IPet, IUser } from "../../types";
import { BASE_URL } from "../../services/config";

// RouteProp provides ability to receive parameters from previous screen homeScreen.tsx 
import { RouteProp } from '@react-navigation/native';

type Props = {
    route: RouteProp<HomeStackParamList, 'PetProfile'>;
};

const PetProfileScreen: React.FC<Props> = ({ route }) => {
    const { ownerId, petName } = route.params;

    // get pet object from mongo to display all of their characteristics
    const [pet, setPet] = useState<IPet>();

    // isLoading used to make sure pet has been received in fetchPet before rendering pet info
    const [isLoading, setIsLoading] = useState(true);

    const fetchPet = async (ownerId: string, petName: string) => {
        try {
            console.log(BASE_URL + 'pet/get/' + ownerId + '/' + petName);
            const response = await fetch(BASE_URL + 'pet/get/' + ownerId + '/' + petName);
            const data = await response.json();
            setPet(data);
            console.log(pet);
        } catch (error) {
            console.log("Error in fetchPet", error);
        } finally { // set isLoading to false to move on to rendering on screen
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPet(ownerId, petName);
    }, [ownerId, petName]);

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return(
        <SafeAreaWrapper>
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
            <Box>
                <Text>Pet Profile Screen</Text>
                <Text>{ "Name: " + pet?.name }</Text>
                <Text>{ "Age: " + pet?.age }</Text>
                <Text>{ "Species: " + pet?.species }</Text>
                <Text>{ "Breed: " + pet?.breed }</Text>
                <Text>{ "Color: " + pet?.color }</Text>
                <Text>{ "Gender: " + pet?.gender }</Text>
                <Text>{ "Vaccination Records: " + pet?.vaccinationRecords }</Text>
                <Text>{ "Meds/Supplements: " + pet?.medsSupplements }</Text>
                <Text>{ "Allergies/Sensitivities: " + pet?.allergiesSensitivities }</Text>
                <Text>{ "Previous Illnesses/Injuries: " + pet?.prevIllnessesInjuries }</Text>
                <Text>{ "Diet: " + pet?.diet }</Text>
                <Text>{ "Indoor/Outdoor: " + pet?.indoorOrOutdoor }</Text>
                <Text>{ "Reproductive Status: " + pet?.reproductiveStatus }</Text>
                <Text>{ "Image: " + pet?.image }</Text>
                <Text>{ "Notes: " + pet?.notes }</Text>
            </Box>
        </ScrollView>
    </SafeAreaWrapper>

    )
}

export default PetProfileScreen