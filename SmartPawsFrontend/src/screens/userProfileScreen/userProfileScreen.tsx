import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { BASE_URL } from '../../services/config';
import SafeAreaWrapper from '../../components/shared/safeAreaWrapper';
import { LinearGradient } from 'expo-linear-gradient';


const UserProfileScreen = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : '';

      const response = await fetch(`${BASE_URL}user/get/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser({ name: data.name, email: data.email });
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const updateUserInMongoDB = async (uid: string, name: string, email: string) => {
    try {
      const response = await fetch(`${BASE_URL}user/update/${uid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('User updated in MongoDB:', data);
    } catch (error) {
      console.error('Error updating user in MongoDB:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        await updateUserInMongoDB(currentUser.uid, user.name, user.email);
      }

      Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // Or any other loading indicator you prefer
  }

  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
        style={styles.linearGradient}
      >
        <View style={styles.container}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input]}
            value={user.email}
            editable={false}
            onChangeText={(text) => setUser({ ...user, email: text })}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'space-around', // Adjust this to your content
    paddingHorizontal: 20,
    paddingTop: 20, // Additional space on top, adjust as necessary
  },
  container: {
    // Since the linearGradient already provides padding, you may not need padding here
    // padding: 20,
  },
  label: {
    fontSize: 18,
    color: 'white', // Adjust to match the theme
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Opaque background
    borderColor: 'rgba(0, 0, 0, 0.2)', // Lighter border
    color: '#000',
  },
  button: {
    // Match this style to the buttons in the SettingsScreen
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#201A64', // The button color from SettingsScreen
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default UserProfileScreen;