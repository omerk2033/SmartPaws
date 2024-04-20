// update pet screen presents pet profile fields similar to regPetScreen
// with prefilled in fields from previous entries now modifiable by user
// to update previously existing pet profile
// any fields with preexisting data will remain the same if not edited

import { Box, Text } from "../../utils/theme/style";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import React, { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity, StyleSheet, View, } from "react-native";
import { HomeScreenNavigationType, HomeStackParamList } from "navigation/types";
import { Controller, useForm } from "react-hook-form";
import { IPet } from "../../types";
import Input from "../../components/shared/input";
import axiosInstance, { BASE_URL } from "../../services/config";
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

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

  // disable Update Pet button until user's image is uploaded to firebase and url is generated
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
    if (imageUrl != null && imageUrl != "") {
      // imageUrl was set in UploadImage function
      data.image = imageUrl;
    }

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
      navigation.navigate("Home");
    } catch (error) {
      console.log("Error on submit pet profile", error);
    }
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

  // sets the default values of the form to the already entered values of the pet profile
  useEffect(() => {
    fetchPet(ownerId, petName).then((pet: IPet | undefined) => {
      if (pet) {
        reset({
          ownerId: ownerId,
          name: pet.name,
          age: pet.age,
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
            <Text style={styles.headerText}>Update Pet Profile</Text>
          </View>
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
            onPress={handleSubmit(onSubmit)}
            disabled={imageIsUploading}
            style={[
              styles.button,
              { backgroundColor: imageIsUploading ? '#aaa' : '#201A64' } // Change color when disabled
            ]}>
            <Text style={styles.buttonText}>Update Profile</Text>
          </TouchableOpacity>
          <Box mb="5.5" />
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
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

export default UpdatePetScreen
