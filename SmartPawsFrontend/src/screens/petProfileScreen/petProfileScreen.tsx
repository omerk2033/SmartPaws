// pet profile screen displays all of selected pet's details and picture
// update profile button to go to update pet screen
// concern toggle switch to toggle on concern for the pet
// remove profile button to remove pet's profile 

import { Box, Text } from "../../utils/theme/style";
import { useNavigation } from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Alert, Animated, TouchableOpacity, ScrollView, View, Image, StyleSheet } from "react-native";
import { HomeScreenNavigationType, HomeStackParamList } from "../../navigation/types";
import React, { useRef, useEffect, useState } from "react";
import { IPet } from "../../types";
import { BASE_URL } from "../../services/config";
// RouteProp provides ability to receive parameters from previous screen homeScreen.tsx 
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  route: RouteProp<HomeStackParamList, 'PetProfile'>;
};

const PetProfileScreen: React.FC<Props> = ({ route }) => {
  const { ownerId, petName } = route.params;
  const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>();

  const [pet, setPet] = useState<IPet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Slider animation value, initially 0 or 1 based on the pet's flaggedForConcern
  const sliderAnim = useRef(new Animated.Value(pet?.flaggedForConcern ? 1 : 0)).current;


  // Function that toggles the 'flaggedForConcern' state of the pet
  const toggleConcernFlag = async () => {
    // Determine the new value for the flaggedForConcern state
    const newValue = pet?.flaggedForConcern ? 0 : 1; // If flagged, animate to 0, if not, animate to 1

    // Start the animation for the slider
    Animated.timing(sliderAnim, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Call the backend to toggle the `flaggedForConcern` status
    try {
      const response = await fetch(`${BASE_URL}pet/toggleConcern/${ownerId}/${petName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Success:', data);

      // Update local pet state with the new `flaggedForConcern` value
      setPet(prevPet => {
        if (!prevPet) {
          throw new Error("Pet data is not available");
        }
        return { ...prevPet, flaggedForConcern: !prevPet.flaggedForConcern };
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  useEffect(() => {
    // Set the slider's initial position based on the pet's flaggedForConcern state
    sliderAnim.setValue(pet?.flaggedForConcern ? 1 : 0);
  }, [pet?.flaggedForConcern]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // concern toggle slider parameters
  const trackWidth = 150; // The total width of the slider track
  const thumbWidth = 80; // The width of the slider thumb
  const spaceForThumbToMove = trackWidth - thumbWidth;

  const sliderMove = sliderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, spaceForThumbToMove], // Correctly updated for thumb in bounds
  });
  const sliderColor = sliderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 255, 255, 0.3)', '#E8A317'],
  });

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
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13 }}>
          {/* display pet image */}
          {/* pet.image is url to actual image stored in firebase */}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* show default empty pet image if none has been selected yet */}
            <Image
              source={pet?.image !== '' ? { uri: pet?.image } : require('../../../assets/pawprint.png')}
              style={styles.petImage}
              resizeMode="cover"
            />
          </View>

          {/* pet info */}
          <Box>
            <Text style={{ textAlign: "center", fontSize: 24, fontWeight: 'bold' }}>{pet?.name + "'s Information:"}</Text>
            <Text>{"Age: " + pet?.age}</Text>
            <Text>{"Species: " + pet?.species}</Text>
            <Text>{"Breed: " + pet?.breed}</Text>
            <Text>{"Color: " + pet?.color}</Text>
            <Text>{"Gender: " + pet?.gender}</Text>
            <Text>{"Vaccination Records: " + pet?.vaccinationRecords}</Text>
            <Text>{"Meds/Supplements: " + pet?.medsSupplements}</Text>
            <Text>{"Allergies/Sensitivities: " + pet?.allergiesSensitivities}</Text>
            <Text>{"Previous Illnesses/Injuries: " + pet?.prevIllnessesInjuries}</Text>
            <Text>{"Diet: " + pet?.diet}</Text>
            <Text>{"Exercise Habits: " + pet?.exerciseHabits}</Text>
            <Text>{"Indoor/Outdoor: " + pet?.indoorOrOutdoor}</Text>
            <Text>{"Reproductive Status: " + pet?.reproductiveStatus}</Text>
            <Text>{"Notes: " + pet?.notes}</Text>
          </Box>
          <Box mt="6" style={styles.centeredView}>
            <TouchableOpacity
              onPress={handleUpdateProfileRequest}
              style={[styles.button, { backgroundColor: "#201A64" }]} // Apply custom button style
            >
              <Text style={styles.buttonText}>Update Profile</Text>
            </TouchableOpacity>
          </Box>
          <Box style={styles.centeredView}>
            {/* This is the track of the switch */}
            <View style={styles.sliderTrack}>
              {/* This is the animated part of the switch */}
              <Animated.View style={[styles.sliderThumb, { transform: [{ translateX: sliderMove }], backgroundColor: sliderColor }]} />
            </View>
            {/* Touchable area to trigger the toggle */}
            <TouchableOpacity onPress={toggleConcernFlag} style={styles.touchableArea}>
              <Text style={styles.buttonText}>
                {pet?.flaggedForConcern ? "Concern Flagged" : "Flag Concern"}
              </Text>
            </TouchableOpacity>
          </Box>

          <Box mb="6" style={styles.centeredView}>
            <TouchableOpacity
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
                      onPress: () => deletePet(ownerId, petName),
                      style: "destructive",
                    }
                  ]
                );
              }}
              style={[styles.button, { backgroundColor: "#800000" }]} // Apply custom button style
            >
              <Text style={styles.buttonText}>Remove Profile</Text>
            </TouchableOpacity>
          </Box>
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  petImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
  },
  centeredView: {
    alignItems: 'center', // This will center the child components horizontally
    justifyContent: 'center', // This will center the child components vertically if the view has a defined height
    flex: 1,
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
  sliderTrack: {
    width: 150, // Use the trackWidth defined above
    height: 40, // Adjust as needed
    borderRadius: 30, // Typically half the height for a rounded effect
    backgroundColor: 'grey', // Background color of the track
  },
  sliderThumb: {
    width: 80, // Use the thumbWidth defined above
    height: 40, // Adjust as needed
    borderRadius: 30, // Typically half the height for a rounded effect
    backgroundColor: 'green', // Background color of the thumb
    position: 'absolute',
  },
  touchableArea: {
    position: 'absolute', // Position over the track
    width: '100%', // Same width as the track
    height: '100%', // Same height as the track
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});

export default PetProfileScreen