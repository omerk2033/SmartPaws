import { Box,  Text } from "../../utils/theme/style";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Alert, Button, ScrollView, View, Image, StyleSheet } from "react-native";
import { HomeScreenNavigationType, HomeStackParamList } from "../../navigation/types";

import React, { useEffect, useState } from "react";
import { IPet } from "../../types";
import { BASE_URL } from "../../services/config";


// RouteProp provides ability to receive parameters from previous screen petProfileScreen.tsx 
import { RouteProp } from '@react-navigation/native';

type Props = {
    route: RouteProp<HomeStackParamList, 'PetProfile'>;
};

const PetProfileScreen: React.FC<Props> = ({ route }) => {
    const { ownerId, petName } = route.params; // parameters received from petProfileScreen.tsx

    const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>();

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

    const deletePet = async (ownerId: string, petName: string) => {
        try {
            console.log(BASE_URL + 'pet/delete/' + ownerId + '/' + petName);
            const response = await fetch(BASE_URL + 'pet/delete/' + ownerId + '/' + petName, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log(data);
            navigation.goBack(); // go back to home page since deleted this pet
            
        } catch (error) {
            console.log("Error in deletePet", error);
        }
    }

    const handleUpdateProfileRequest = () => {
        console.log("handleUpdateProfileRequest");
        // navigate to updatePetScreen and pass ownerId, petName parameters
        navigation.navigate("UpdatePet", {
            ownerId: ownerId,
            petName: petName,
        });
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
            {/* display pet image */}
            {/* pet.image is url to actual image stored in firebase */}
            <View>
            {pet?.image && ( // check if pet.image exists
                <Image
                    source={{ uri: pet.image }} 
                    style={styles.petImage} 
                />
            )}
            </View>
            {/* pet info */}
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
                <Text>{ "Exercise Habits: " + pet?.exerciseHabits }</Text>
                <Text>{ "Indoor/Outdoor: " + pet?.indoorOrOutdoor }</Text>
                <Text>{ "Reproductive Status: " + pet?.reproductiveStatus }</Text>
                <Text>{ "Notes: " + pet?.notes }</Text>
            </Box>
            <Box mt="6">
            {/* update pet button */}
            <Button title="Update Pet Profile" onPress={handleUpdateProfileRequest}/>
            </Box>
            <Box mb="6"/>
            {/* delete pet button with alert cautioning user */}
            <Button
                title="Delete Pet"
                color="red"
                onPress={() => {
                    Alert.alert(
                        "Are you sure you want to delete this pet?",
                        "This action cannot be undone.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Delete",
                                onPress: () => deletePet(ownerId, petName)
                            }
                        ]
                    )
                }}
            />
        </ScrollView>
    </SafeAreaWrapper>

    )
}

const styles = StyleSheet.create({
    petImage: {
      width: 200, 
      height: 200, 
      resizeMode: "cover", 
      borderRadius: 10, 
    },
  });
  
export default PetProfileScreen