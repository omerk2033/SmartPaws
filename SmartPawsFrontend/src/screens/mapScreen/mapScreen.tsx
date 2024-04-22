// display google maps with nearby veterinarian offices

import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // to get user's current location
import { FlatList } from 'react-native';

const MapScreen: React.FC = () => {
  // using region to set the region based on how large is needed 
  // for all of the vet offices returned from google maps api
  // default is UTA but should get set based on 
  // the user's location and the radius of the vets found
  // if the user grant's permission to their location
  const [region, setRegion] = useState({
    latitude: 32.7310,
    longitude: -97.1150,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [locationFetched, setLocationFetched] = useState(false);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [vetsFetched, setVetsFetched] = useState(false);
  const [regionSet, setRegionSet] = useState(false);

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
    console.log("API URL: ", apiUrl); 
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('API Response:', data); 
      return data.results;
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    }
  };

  const zoomedInDelta = 0.05; // Smaller values for a closer zoom

  const centerMapOnVet = (vet: Veterinarian) => {
    setRegion({
      latitude: vet.geometry.location.lat,
      longitude: vet.geometry.location.lng,
      latitudeDelta: zoomedInDelta,
      longitudeDelta: zoomedInDelta,
    });
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
            console.log("region");
            console.log(region);
            // set boolean to allow MapView component to render
            setRegionSet(true);
          }

        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [locationFetched]);

  
  return (
    <LinearGradient
      colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
      style={styles.linearGradient}
    >
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
        >
          {veterinarians.map((vet, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: vet.geometry.location.lat,
                longitude: vet.geometry.location.lng,
              }}
              title={vet.name}
              description={vet.vicinity}
            />
          ))}
        </MapView>
      </View>
      <FlatList
        data={veterinarians}
        keyExtractor={(item, index) => 'key' + index}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => centerMapOnVet(item)}>
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text style={styles.listItemSubtext}>{item.vicinity}</Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  refreshButtonContainer: {
    position: 'absolute', // Position over the map
    bottom: 20, // Distance from bottom
    // left: 20, // Distance from left
    alignSelf: 'center',
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
  },
  mapContainer: {
    flex: 1, // Take up all available space
    height: '50%', // Set the height to 50% of the screen
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fill up the entire space of its parent
  },
  list: {
    flex: 1, // Take up all available space
    height: '50%', // Set the height to 50% of the screen
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
  },
  listItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemSubtext: {
    fontSize: 14,
  },
});

export default MapScreen;