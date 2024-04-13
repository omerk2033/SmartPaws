// display google maps with nearby veterinarian offices

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // to get user's current location

const MapScreen: React.FC = () => {
  // const homeStackNavigation = useNavigation<HomeStackNavigationProps>();  
  // using region to set the region based on how large is needed 
  // for all of the vet offices returned from google maps api
  const [region, setRegion] = useState({
    latitude: 32.7310,
    longitude: -97.1150,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [locationFetched, setLocationFetched] = useState(false);

  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);

  const [vetsFetched, setVetsFetched] = useState(false);

  interface Location {
    lat: number;
    lng: number;
  }

  interface Geometry {
    location: Location;
  }

  interface Veterinarian {
    name: string;
    vicinity: string;
    geometry: Geometry;
  }

  interface UserLocation {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  // using reference instead of state for userLocation
  // because need to be able to store the user's location without causing the component to render again
  const userLocation = useRef<UserLocation | null>(null);

  const searchRadius: number = 48280; // approximately 30 miles in meters

  // fetch list of veterinarians within a hardcoded radius using google maps api
  const getVeterinarians = async (latitude: number, longitude: number) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${searchRadius}&type=veterinary_care&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    console.log("API URL: ", apiUrl); // Log the complete API URL
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('API Response:', data); // Log the API response
      return data.results;
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    }
  };

  // get current user's location when page initially loads
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      userLocation.current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      console.log(userLocation.current);
      // set locationFetched to trigger next useEffect
      setLocationFetched(true);
    })();
  }, []);

  //   // find all vets within specified radius of user's location
  //   // waits for locationFetched to be true before running 
  //   // to make sure user location is known before getVeterinarians is called 
  //   // with user's current location as arguments 
  //   useEffect(() => {
  //     // This effect depends on `locationFetched` to trigger.
  //     // It's designed to run after the user's location has been successfully fetched.
  //     if (locationFetched && !vetsFetched) {
  //         // `userLocation.current` has been correctly set by the first useEffect.
  //         if (userLocation.current) {
  //             const { latitude, longitude } = userLocation.current;

  //             getVeterinarians(latitude, longitude)
  //                 .then((vets) => {
  //                     setVeterinarians(vets);
  //                     setVetsFetched(true); // Ensure we mark that vets have been fetched.
  //                 })
  //                 .catch((error) => {
  //                     console.error("Failed to fetch veterinarians:", error);
  //                 });
  //         }
  //     }
  // }, [locationFetched]); // This useEffect is triggered when `locationFetched` changes.

  // for some reason the above useEffect was missing several things that the below has
  // find all vets within specified radius of user's location
  // waits for locationFetched to be true before running 
  // to make sure user location is known before getVeterinarians is called 
  // with user's current location as arguments 
  useEffect(() => {
    // get all veterinarians within radius and save in veterinarians
    if (userLocation.current && locationFetched && !vetsFetched) {
      getVeterinarians(userLocation.current.latitude, userLocation.current.longitude)
        .then((vets: Veterinarian[]) => {
          setVeterinarians(vets);
          setVetsFetched(true);
          // just printing
          // console.log("some veterinarians:");
          // veterinarians.forEach((veterinarian: { name: string; vicinity: string;  }) => {
          // vets.forEach((veterinarian) => {
          //     console.log(`Name: ${veterinarian.name}, Vicinity: ${veterinarian.vicinity}`);
          //     console.log(`Latitude: ${veterinarian.geometry.location.lat}, Longitude: ${veterinarian.geometry.location.lng}`);
          // });

          let minLat: number | null = null;
          let maxLat: number | null = null;
          let minLng: number | null = null;
          let maxLng: number | null = null;

          // calculate the max region needed to show all of the vet locations
          vets.forEach((vet) => {
            const lat = vet.geometry.location.lat;
            const lng = vet.geometry.location.lng;
            minLat = minLat !== null ? Math.min(minLat, lat) : lat;
            maxLat = maxLat !== null ? Math.max(maxLat, lat) : lat;
            minLng = minLng !== null ? Math.min(minLng, lng) : lng;
            maxLng = maxLng !== null ? Math.max(maxLng, lng) : lng;
          });
          // set the display region of the map
          if (minLat != null && maxLat != null && minLng != null && maxLng != null) {
            setRegion({
              latitude: (minLat + maxLat) / 2,
              longitude: (minLng + maxLng) / 2,
              latitudeDelta: (maxLat - minLat) * 1.1, // * 1.1 for a bit of padding around the furthest locations
              longitudeDelta: (maxLng - minLng) * 1.1,
            });
          }

        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [locationFetched]);

  const refreshVets = () => {
    console.log('Refreshing veterinarians list');
    if (userLocation.current) {
      // Log the current location being used for refreshing
      console.log(`Using location: ${userLocation.current.latitude}, ${userLocation.current.longitude}`);

      // Update the map's region to center on the user's current location
      setRegion({
        latitude: userLocation.current.latitude,
        longitude: userLocation.current.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Reset the vetsFetched to false to re-fetch the veterinarians
      setVetsFetched(false);
      // Since we already have the user's location, we don't need to fetch it again
      // Just set locationFetched to true to trigger the effect that fetches the veterinarians
      setLocationFetched(true);
    } else {
      console.error("User location not available.");
    }
  };

  return (
    <LinearGradient
      colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
      style={styles.linearGradient}
    >
      <View style={{ marginTop: 5, flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={region => setRegion(region)}
        >
          {/* Markers for all of the nearby veterinarians */}
          {veterinarians.map((veterinarian, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: veterinarian.geometry.location.lat,
                longitude: veterinarian.geometry.location.lng
              }}
              title={veterinarian.name}
              description={veterinarian.vicinity}
            />
          ))}
          {userLocation.current && (
            <Marker
              key="user_location"
              coordinate={{
                latitude: userLocation.current.latitude,
                longitude: userLocation.current.longitude
              }}
              title="Your Location"
              pinColor="#ADD8E6"
            />
          )}
        </MapView>
      </View>
      <View style={styles.refreshButtonContainer}>
        <TouchableOpacity onPress={refreshVets} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  refreshButtonContainer: {
    position: 'absolute', // Position over the map
    bottom: 20, // Distance from bottom
    // right: 20, // Distance from right
    left: 20 // Distance from left
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.8)', // Semi-transparent white
    borderRadius: 20, // Rounded corners
    padding: 10, // Padding around the button
  },
  refreshButtonText: {
    color: '#007aff',
    textAlign: 'center',
  },

  linearGradient: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  dropdownContainer: {
    marginTop: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    borderRadius: 20,
    paddingHorizontal: 10,
    padding: 8,
    marginVertical: 15,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#ADD8E6', // Light blue background for user message
    color: 'blue', // Blue text for user message
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#FFC0CB', // Light red background for AI message
    color: 'red', // Red text for AI message
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#201A64',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;