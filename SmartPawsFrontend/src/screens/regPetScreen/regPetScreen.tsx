// Register pet's information for the user that is logged in
// displays all form fields for user to fill in
// and then saves pet profile to database 

import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React from "react"
import {Button, Keyboard, ScrollView, TouchableWithoutFeedback} from "react-native";
import { HomeScreenNavigationType } from "navigation/types";
import { Controller, useForm } from "react-hook-form";
import { IPet } from "../../types";
import Input from "../../components/shared/input";
import axiosInstance from "../../services/config";
import { getAuth } from 'firebase/auth';

const RegPetScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>()

    // get current user's uid to associate user with their pets' profiles
    const auth = getAuth();  
    const currentUser = auth.currentUser;
    const ownerId = currentUser ? currentUser.uid : "";

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
            image: "",
            notes: "",
        },
    })

    const onSubmit = async (data: IPet) => {
        try {
            const { ownerId, name, age, 
                species, breed, color,
                gender, vaccinationRecords,
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
                diet, exerciseHabits, 
                indoorOrOutdoor, reproductiveStatus, image,
                notes  
            } = data;

            await savePetProfileToDatabase(ownerId, name, age, 
                species, breed, color,
                gender, vaccinationRecords,
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
                diet, exerciseHabits, 
                indoorOrOutdoor, reproductiveStatus, image,
                notes);

            reset(); // reset all of the fields of the form now that pet profile has been saved to database
            
            // SHOULD NAVIGATE BACK TO USER'S HOME PAGE AND DISPLAY NEWLY REGISTERED PET WITH OTHERS...
        
        } catch (error) {
            console.log("Error on submit pet profile", error);
        }
    }

    return(
        <SafeAreaWrapper>
            {/* <Box flex={1} px="5.5" mt={"13"}> */}
            <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
                <Text>Register Pet Screen</Text>
                
                {/* have ownerId from currently logged in User's uid already */}

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
                <Controller 
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input 
                            label="Image"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            // image is currently just a string need to figure out about images...
                            value={value}
                            placeholder="Pet Image"
                            // error={errors.name}  
                        />
                    )}
                    name="image"
                />
                <Box mb="6" />
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

                <Box mb="5.5" />
                <Button title="Register Pet" onPress={handleSubmit(onSubmit)}/>
            {/* </Box> */}
            </ScrollView>
        </SafeAreaWrapper>
    )
}

const savePetProfileToDatabase = async ( 
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
        const response = await axiosInstance.post("pet/create", {
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
        console.log("Pet registered to MongoDB");
        return response.data.pet;
    } catch (error) {
        // THIS CATCH BLOCK IS NOT ENTERED WHEN USER SUBMITS FORM WITH MISSING REQUIRED FIELDS
        console.log("error in savePetProfileToDatabase", error);
        throw error;
    }
}

export default RegPetScreen
