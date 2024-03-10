// Register pet's information for the user that is logged in
// displays all form fields for user to fill in
// and then saves pet profile to database 

import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React, { useState } from "react"
import {Button, Keyboard, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, View, Platform} from "react-native";
import { HomeScreenNavigationType } from "navigation/types";
import { Controller, useForm } from "react-hook-form";
import { IPet } from "../../types";
import Input from "../../components/shared/input";
import axiosInstance from "../../services/config";
import { getAuth } from 'firebase/auth';

import * as ImagePicker from 'expo-image-picker';
import { firebase } from "@react-native-firebase/auth";

import { FIREBASE_STORAGE } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { format } from "date-fns"; 

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
    });

    // need to be able to useState in order to update the pet profile image url when 
    // received from user selecting picture to upload outside of react hook form
    const [imageUrl, setImageUrl] = useState<string | null>("");
    
    const onSubmit = async (data: IPet) => {
        // imageUrl was set in UploadImage function
        // need to make sure that data for the pet profile that we're about to save
        // is updated before submitting to database
        if(imageUrl != null) {
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

            await savePetProfileToDatabase(ownerId, name, age, 
                species, breed, color,
                gender, vaccinationRecords,
                medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
                diet, exerciseHabits, 
                indoorOrOutdoor, reproductiveStatus, image,
                notes);

            reset(); // reset all of the fields of the form now that pet profile has been saved to database
            
            // navigate back to user's home page 
            navigation.navigate("Home");
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
                {/* CAN REMOVE IMAGE TEXT BOX SINCE UPLOADING WITH + BUTTON... */}
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
                    <Text>Upload Pet Photo</Text>
                    {/* setImageUrl passed in to be able to useState and update the pet profile being created in the form */}
                    <UploadImage setImageUrl={setImageUrl} />
                </View>

                <Button title="Register Pet" onPress={handleSubmit(onSubmit)}/>
                
                <Box mb="5.5" />
                
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

// upload pet image
// able to access user's files if they allow it 
// saving to firebase and generating url to save as image url
const UploadImage = ({ setImageUrl }: { setImageUrl: (url: string | null) => void }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const pickImageAsync = async () => {
      try {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        } else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: false,
                quality: 1,
            });
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
                // upload user's selected image to firebase
                // get current time to use as filename 
                const timestamp = format(new Date(), "yyyyMMddHHmmss"); 
                const fileName = `image_${timestamp}`; 
                const fileRef = ref(FIREBASE_STORAGE, fileName); 
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();
                uploadBytesResumable(fileRef, blob)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                    .then((downloadUrl) => {
                        console.log(downloadUrl);
                        // set imageUrl to be able to update pet profile that you are saving to mongo
                        setImageUrl(downloadUrl);
                    })
                })
            }
        }
        } catch (error) {
            console.log(error);
        }
    };
    
    return <TouchableOpacity style={uploadPhotoStyles.container} onPress={pickImageAsync} >
        <Text>+</Text>
    </TouchableOpacity>
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

export default RegPetScreen
