// User's home screen shows already registered pets, button to register a new pet

import { Box, Text } from "../../utils/theme/style";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { TouchableOpacity, Image, ActivityIndicator, ScrollView, View, StyleSheet, RefreshControl } from "react-native";
import { HomeStackParamList } from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from "react";
import { IPet, IUser } from "../../types";
import { BASE_URL } from "../../services/config";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useIsFocused } from "@react-navigation/native";

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true); 

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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
      // no need to pass userId to fetchPets as fetchPets gets the userId from finding the currently logged in user
      await fetchPets(); // Fetch pets after successfully fetching user
    } catch (error) {
      console.error("Error fetching user", error);
    } finally {
      setLoading(false); // Set loading to false regardless of the outcome
    }
  };

  const fetchPets = async () => {
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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser().then(() => setRefreshing(false))
      .catch((error) => {
        console.error("Error fetching user on refresh", error);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchUser().catch((error) => {
        console.error("Error fetching user on focus", error);
      }).finally(() => {
        setLoading(false);
      });
    }
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
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13 }}
          refreshControl={<RefreshControl refreshing={refreshing}
            onRefresh={onRefresh} />} >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Box>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{user?.name}'s Pets:</Text>
            </Box>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={navigateToRegPetScreen}
              style={[styles.button, { backgroundColor: "#201A64" }]}
            >
              <Text style={styles.buttonText}>Add New Pet</Text>
            </TouchableOpacity>
          </View>
          {pets.map((pet: IPet, index: number) => (
            <View key={index} style={styles.petEntry}>
              <TouchableOpacity onPress={() => handlePetSelection(pet)} style={styles.button}>
                <Image
                  source={pet.image ? { uri: pet.image } : require('../../../assets/pawprint.png')}
                  style={styles.petImage}
                  resizeMode="cover"
                />
                <Text style={styles.petName}>{pet.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  petEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8, // Adds space between entries
  },
  petImage: {
    width: 100, // Adjust width as desired
    height: 100, // Adjust height as desired
    borderRadius: 50, // Adjust for rounded corners, 50 if you want it circular
  },
  petInfo: {
    marginLeft: 10, // Space between image and pet name
  },
  petName: {
    fontSize: 24, // Adjust font size as desired
    fontWeight: 'bold',
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
