// update pet screen presents pet profile fields similar to regPetScreen
// with prefilled in fields from previous entries now modifiable by user
// to update previously existing pet profile
// any fields with preexisting data will remain the same if not edited

import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React, { useEffect, useState } from "react"
import {Button, Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, Platform} from "react-native";
import { HomeScreenNavigationType, HomeStackParamList } from "navigation/types";
import { Controller, useForm } from "react-hook-form";
import { IPet } from "../../types";
import Input from "../../components/shared/input";
import axiosInstance, { BASE_URL } from "../../services/config";
import { RouteProp } from '@react-navigation/native';

// UploadImage used if user updates pet profile image
// exactly the same function so importing here rather than duplicating code
import { UploadImage } from "../regPetScreen/regPetScreen";

type Props = {
    route: RouteProp<HomeStackParamList, 'UpdatePet'>;
};

const UpdatePetScreen: React.FC<Props> = ({ route }) => {
    const { ownerId, petName } = route.params;

    const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>()

    const [pet, setPet] = useState<IPet>();

    // isLoading used to make sure pet has been received in fetchPet before rendering pet info
    const [isLoading, setIsLoading] = useState(true);

    // need to be able to useState in order to update the pet profile image url when 
    // received from user selecting picture to upload outside of react hook form
    const [imageUrl, setImageUrl] = useState<string | null>("");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<IPet>({
        defaultValues: {
            ownerId: ownerId,
            name: "",
            age: "",
            species: "",
            breed: "",
            color: "",
            gender: "",
            vaccinationRecords: "",
            medsSupplements: "",
            allergiesSensitivities: "",
            prevIllnessesInjuries: "",
            diet: "",
            exerciseHabits: "",
            indoorOrOutdoor: "",
            reproductiveStatus: "",
            notes: "",
        },
    });

    const fetchPet = async (ownerId: string, petName: string): Promise<IPet | undefined> => {
        try {
            console.log(BASE_URL + 'pet/get/' + ownerId + '/' + petName);
            const response = await fetch(BASE_URL + 'pet/get/' + ownerId + '/' + petName);
            const data = await response.json();
            setPet(data);
            data.age = data.age.toString();
            reset(data); // reset the form with the fetched pet data
        } catch (error) {
            console.log("Error in fetchPet", error);
        } finally { // set isLoading to false to move on to rendering on screen
            setIsLoading(false);
        }

        return pet;
    }

    const onSubmit = async (data: IPet) => {
        console.log("imageUrl: " + imageUrl);
        // set image only if new image has been selected
        // otherwise return original image url saved for pet profile before update was selected
        if(imageUrl != null && imageUrl != "") {
            // imageUrl was set in UploadImage function
            data.image = imageUrl;
        }

        // just printing
        console.log("onSubmit function");
        console.log(data); 

        try {
            const { ownerId, name, age, 
                species, breed, color,
                gender, vaccinationRecords,
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
                diet, exerciseHabits, 
                indoorOrOutdoor, reproductiveStatus, image,
                notes  
            } = data;

            await updatePetProfileInDatabase(ownerId, name, age, 
                    species, breed, color,
                    gender, vaccinationRecords,
                    medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
                    diet, exerciseHabits, 
                    indoorOrOutdoor, reproductiveStatus, image,
                    notes);

            // reset all of the fields of the form now that pet profile has been updated in database
            reset(); 
            
            // navigate back to user's home page 
            // OR COULD PERHAPS NAVIGATE BACK TO THE PET PROFILE SCREEN OF THE PET THAT WAS JUST EDITED 
            navigation.navigate("Home");
        } catch (error) {
            console.log("Error on submit pet profile", error);
        }
    }

    // sets the default values of the form to the already entered values of the pet profile
    useEffect(() => {
        fetchPet(ownerId, petName).then((pet: IPet | undefined) => {
            if(pet) {
                reset({
                    ownerId: ownerId,
                    name: pet.name,
                    age: pet.age.toString(),
                    species: pet.species,
                    breed: pet.breed,
                    color: pet.color,
                    gender: pet.gender,
                    vaccinationRecords: pet.vaccinationRecords,
                    medsSupplements: pet.medsSupplements,
                    allergiesSensitivities: pet.allergiesSensitivities,
                    prevIllnessesInjuries: pet.prevIllnessesInjuries,
                    diet: pet.diet,
                    exerciseHabits: pet.exerciseHabits,
                    indoorOrOutdoor: pet.indoorOrOutdoor,
                    reproductiveStatus: pet.reproductiveStatus,
                    image: pet.image,
                    notes: pet.notes,
                });
            }
        })
        .catch((error) => {
            console.log("Error fetching pet:", error);
          });
    }, []);

    // display if page is still loading
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    return(
        <SafeAreaWrapper>
            {/* <Box flex={1} px="5.5" mt={"13"}> */}
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
                <Text>Register Pet Screen</Text>
                
                <Box mb="6" />
                <Controller 
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Pet Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Name"
                            error={errors.name}
                            // do not allow user to edit pet name field as it is part of the primary key for a pet profile
                            // once a pet name is selected by a user, they are no longer able to edit it  
                            editable={false}
                        />
                    )}
                    name="name"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    rules={{
                        // check that age value is a number and is greater than or equal to 0
                        validate: value => {
                            const floatAge = parseFloat(value);
                            return Number.isFinite(floatAge) && floatAge >= 0;
                        },
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Age"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Age"
                            error={errors.name}  
                        />
                    )}
                    name="age"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Species (dog, cat, bird, etc.)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Species"
                            error={errors.name}  
                        />
                    )}
                    name="species"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Breed (Labrador Retriever, Guppy, Siamese, etc.)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Breed"
                            // error={errors.name}  
                        />
                    )}
                    name="breed"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Color"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Color"
                            // error={errors.name}  
                        />
                    )}
                    name="color"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Gender"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Gender"
                            // error={errors.name}  
                        />
                    )}
                    name="gender"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Vaccination Records"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Vaccination Records"
                            // error={errors.name}  
                        />
                    )}
                    name="vaccinationRecords"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Medications/Supplements"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Medications/Supplements"
                            // error={errors.name}  
                        />
                    )}
                    name="medsSupplements"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Allergies/Sensitivities"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Allergies/Sensitivities"
                            // error={errors.name}  
                        />
                    )}
                    name="allergiesSensitivities"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Previous Illnesses/Injuries/Surgeries"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Previous Illnesses/Injuries/Surgeries"
                            // error={errors.name}  
                        />
                    )}
                    name="prevIllnessesInjuries"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Diet"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Diet"
                            // error={errors.name}  
                        />
                    )}
                    name="diet"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Exercise Habits"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Exercise Habits"
                            // error={errors.name}  
                        />
                    )}
                    name="exerciseHabits"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Indoor/Outdoor"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Indoor/Outdoor"
                            // error={errors.name}  
                        />
                    )}
                    name="indoorOrOutdoor"
                />
                <Box mb="6" />
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Reproductive Status (spayed/neutered or intact)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Reproductive Status"
                            // error={errors.name}  
                        />
                    )}
                    name="reproductiveStatus"
                />
                <Box mb="6" />
                {/* REMOVED IMAGE TEXT BOX SINCE UPLOADING WITH + BUTTON */}
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Notes (Any Additional Info?)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Pet Notes"
                            // error={errors.name}  
                        />
                    )}
                    name="notes"
                />
                <Box mb="6" />

                {/* upload image of pet option */}
                {/* now being saved to firebase right away in UploadImage function before REGISTER PET is pressed */}
                <View style={styles.container}>
                    <Text>Upload New Pet Photo</Text>
                    {/* setImageUrl useState hook passed in to be able to useState and update the pet profile being created in the form */}
                    <UploadImage setImageUrl={setImageUrl} />
                </View>

                <Button title="Update Pet Profile" onPress={handleSubmit(onSubmit)}/>
                
                <Box mb="5.5" />
                
            {/* </Box> */}
            </ScrollView>
        </SafeAreaWrapper>
    )
}

const updatePetProfileInDatabase = async (
    ownerId: string,
    name: string,
    age: string,
    species: string,
    breed: string,
    color: string,
    gender: string,
    vaccinationRecords: string,
    medsSupplements: string,
    allergiesSensitivities: string,
    prevIllnessesInjuries: string,
    diet: string,
    exerciseHabits: string,
    indoorOrOutdoor: string,
    reproductiveStatus: string,
    image: string,
    notes: string,
) => {
    try {
        console.log(BASE_URL + "pet/update/" + ownerId, + "/" + name);
        // put request sent to pet/update route to update preexisting pet profile with updated values
        const response = await axiosInstance.put(BASE_URL + "pet/update/" + ownerId + "/" + name, {
            ownerId,
            name,
            age,
            species,
            breed,
            color,
            gender,
            vaccinationRecords,
            medsSupplements,
            allergiesSensitivities,
            prevIllnessesInjuries,
            diet,
            exerciseHabits,
            indoorOrOutdoor,
            reproductiveStatus,
            image,
            notes,
        });
        console.log("pet updated in mongoDB");
        return response.data.pet;
    } catch (error) {
        console.log("error in updatePetProfileInDatabase", error);
    }
}

// upload pet image styles
const uploadPhotoStyles = StyleSheet.create({
    container: {
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: 'lightblue',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        elevation: 2,
        marginBottom: 16
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default UpdatePetScreen
