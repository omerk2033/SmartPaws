// Register pet's information for the user that is logged in
// displays all form fields for user to fill in
// and then saves pet profile to database 

import { Box, Text } from "../../utils/theme/style";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React, { useState } from "react"
import { ScrollView, TouchableOpacity, StyleSheet, View, Alert, } from "react-native";
import { HomeScreenNavigationType } from "navigation/types";
import { Controller, useForm } from "react-hook-form";
import { IPet } from "../../types";
import Input from "../../components/shared/input";
import axiosInstance from "../../services/config";
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE } from "../../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";

const RegPetScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>();

  // get current user's uid to associate user with their pets' profiles
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const ownerId = currentUser ? currentUser.uid : "";
  const threadId = "";
  // need to be able to useState in order to update the pet profile image url when 
  // received from user selecting picture to upload outside of react hook form
  const [imageUrl, setImageUrl] = useState<string | null>("");

  // disable Register Pet button until user's image is uploaded to firebase and url is generated
  const [imageIsUploading, setImageIsUploading] = useState(false);

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
      threadId: threadId, // threadId for pet's specific thread with openai assistant
    },
  });

  const onError = (errors: any, e: any) => {
    console.log(errors, e);
    Alert.alert("Submission Failed", "Please check your input and try again.");
  };

  const onSubmit = async (data: IPet) => {
    // imageUrl was set in UploadImage function
    // need to make sure that data for the pet profile that we're about to save
    // is updated before submitting to database
    if (imageUrl != null) {
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
        notes, threadId
      } = data;

      await savePetProfileToDatabase(ownerId, name, age,
        species, breed, color,
        gender, vaccinationRecords,
        medsSupplements, allergiesSensitivities, prevIllnessesInjuries,
        diet, exerciseHabits,
        indoorOrOutdoor, reproductiveStatus, image,
        notes, threadId);

      // reset all of the fields of the form now that pet profile has been saved to database
      reset();

      // navigate back to user's home page 
      navigation.navigate("Home");
    } catch (error) {
      console.log("Error on submit pet profile", error);
    }
  }

  return (
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
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollViewStyle}>

          <View style={styles.centeredView}>
            <Text style={styles.headerText}>New Pet Profile</Text>
          </View>

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
                style={styles.input}

              />
            )}
            name="name"
          />
          <Box mb="6" />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Age"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Pet Age"
                error={errors.name}
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
              />
            )}
            name="reproductiveStatus"
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
                style={styles.input}
              />
            )}
            name="notes"
          />
          <Box mb="6" />

          {/* upload image of pet option */}
          {/* now being saved to firebase right away in UploadImage function before REGISTER PET is pressed */}
          <View style={styles.container}>
            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Upload Pet Photo</Text>
            {/* setImageUrl passed in to be able to useState and update the pet profile being created in the form */}
            {/* setImageIsUploading useState hook passed in to be able to useState and disable Update Pet Profile button until image url is generated */}
            <UploadImage setImageUrl={setImageUrl} setImageIsUploading={setImageIsUploading} />
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit, onError)}
            disabled={imageIsUploading}
            style={[
              styles.button,
              { backgroundColor: imageIsUploading ? '#aaa' : '#201A64' } // Change color when disabled
            ]}>
            <Text style={styles.buttonText}>Register Pet</Text>
          </TouchableOpacity>
          <Box mb="5.5" />
        </ScrollView>
      </LinearGradient>
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
  threadId: string,
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
      threadId,
    });
    console.log("Pet registered to MongoDB");
    return response.data.pet;
  } catch (error) {
    console.log("error in savePetProfileToDatabase", error);
    throw error;
  }
}

// upload pet image
// able to access user's files if they allow it 
// saving to firebase and generating url to save as image url
// setImageUrl and setImageIsUploading useState hooks passed in 
// to be able to update url and disable register pet/update pet buttons while uploading image to firebase
// exporting function to be able to use in updatePetScreen.tsx as well
export const UploadImage = ({ setImageUrl, setImageIsUploading }: { setImageUrl: (url: string | null) => void, setImageIsUploading: (imageIsUploading: boolean) => void }) => {
  const pickImageAsync = async () => {
    try {
      // open user's image library for user to select pet image with expo-image-picker
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
      else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
          quality: 1,
        });
        if (!result.canceled) {
          // set imageIsUploading boolean to disable register pet button until image file is uploaded and url is available
          setImageIsUploading(true);
          // upload user's selected image to firebase
          // get current time to use as filename 
          const timestamp = format(new Date(), "yyyyMMddHHmmss");
          const fileName = `image_${timestamp}`;

          // use firebase ref to get url to storage with filename created with date string
          // the full url will be created by firebase once the file is successfully uploaded 
          const fileRef = ref(FIREBASE_STORAGE, fileName);
          console.log("fileRef: " + fileRef); // just printing

          // get image that user selected and convert to blob (binary large object) for uploading
          const response = await fetch(result.assets[0].uri);
          const blob = await response.blob();

          // firebase function to upload binary data of image to firebase storage
          uploadBytesResumable(fileRef, blob)
            .then((snapshot) => {
              // get full url created by firebase now that file has been uploaded
              getDownloadURL(snapshot.ref)
                .then((downloadUrl) => {
                  console.log(downloadUrl);
                  // set imageUrl to be able to update pet profile that you are saving to mongo
                  setImageUrl(downloadUrl);
                  setImageIsUploading(false);
                })
            })
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Upload Pet Photo button
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 16
  }
});

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
    borderRadius: 20, // Rounded corners
    paddingHorizontal: 15, // Horizontal padding
    borderColor: 'rgba(255, 255, 255, 0.5)', // Border color
    borderWidth: 1, // Border width
    marginBottom: 10, // Margin bottom
    height: 40
  },
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

export default RegPetScreen
