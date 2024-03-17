import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../../services/config';
import { getAuth } from 'firebase/auth';
import { SelectList } from 'react-native-dropdown-select-list';
import { IPet } from 'types';
import { useIsFocused } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  type: 'user' | 'ai';
}

const AIScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pets, setPets] = useState<IPet[]>([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [petDetails, setPetDetails] = useState<IPet | null>(null);
  const isFocused = useIsFocused();

  // If user navigates to this screen, fetch pets in case they've added a new pet
  useEffect(() => {
    if (isFocused) {
      fetchPets();
    }
  }, [isFocused]);

  // Fetch pets from backend
  // Used to populate the dropdown list of pets
  const fetchPets = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const ownerId = currentUser ? currentUser.uid : "";
      if (!ownerId) {
        throw new Error("No user ID found");
      }

      const response = await fetch(`${BASE_URL}pet/get/${ownerId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets", error);
      // Handle the error as appropriate
    }
  };

  // Fetch pet details when selected pet changes
  useEffect(() => {
    if (selectedPet && selectedPet !== 'Chat with Gigi') {
      fetchPetDetails(selectedPet);
    } else {
      setPetDetails(null);
    }
  }, [selectedPet]);

  // useEffect(() => {
  //   fetchPets();
  // }, []);

  // Fetch pet details from backend
  const fetchPetDetails = async (petName: string) => {
    try {
      const ownerId = getAuth().currentUser?.uid;
      const response = await fetch(`${BASE_URL}pet/get/${ownerId}/${petName}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setPetDetails(await response.json());
    } catch (error) {
      console.error("Error fetching pet details", error);
    }
  };

  // Construct the data for the dropdown list
  const data = [{ key: 'Chat with Gigi', value: 'Chat with Gigi' }].concat(
    pets.map((pet: any) => ({
      key: pet.id,
      value: pet.name
    }))
  );

  // Triggered when a pet is selected from the dropdown list
  const onPetSelect = (selectedValue: string) => {
    setSelectedPet(selectedValue);
  };

  // Construct a message from the pet details
  const constructPetDetailsMessage = (pet: IPet): string => {
    return `Pet Details:\n`
         + `Name: ${pet.name}\n`
         + `Age: ${pet.age}\n`
         + `Species: ${pet.species}\n`
         + `Breed: ${pet.breed}\n`
         + `Color: ${pet.color}\n`
         + `Gender: ${pet.gender}\n`
         + `Vaccination Records: ${pet.vaccinationRecords}\n`
         + `Meds/Supplements: ${pet.medsSupplements}\n`
         + `Allergies/Sensitivities: ${pet.allergiesSensitivities}\n`
         + `Previous Illnesses/Injuries: ${pet.prevIllnessesInjuries}\n`
         + `Diet: ${pet.diet}\n`
         + `Exercise Habits: ${pet.exerciseHabits}\n`
         + `Indoor/Outdoor: ${pet.indoorOrOutdoor}\n`
         + `Reproductive Status: ${pet.reproductiveStatus}\n`
         + `Image URL: ${pet.image}\n`
         + `Notes: ${pet.notes}\n`;
  };

  // Triggered when pet details change
  useEffect(() => {
    if (petDetails) {
      sendPetDetailsToAI(petDetails);
    }
  }, [petDetails]);

  // Send pet details to the AI
  const sendPetDetailsToAI = async (pet: IPet) => {
    const petMessageContent = constructPetDetailsMessage(pet);

    // Log the pet message content
    console.log("Sending pet details to AI:", petMessageContent);

    // Simulate an AI response by echoing the pet details
    const simulatedAIResponse = `Received the following pet details:\n${petMessageContent}`;

    // Add the AI response to the messages state
    const aiMessage: Message = { id: `ai-${Date.now()}`, text: simulatedAIResponse, type: 'ai' };
    setMessages(messages => [...messages, aiMessage]);

    try {
      const response = await fetch(`${BASE_URL}user/chatGPT`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: petMessageContent })
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send pet details to AI');
    }
  };
  

  const handleSendRequest = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const newMessage: Message = { id: `user-${Date.now()}`, text: inputText, type: 'user' };
    processUserMessage(newMessage);
  };

  const processUserMessage = async (message: Message) => {
    setMessages(messages => [...messages, message]);
    setInputText('');

    try {
      const response = await fetch(`${BASE_URL}user/chatGPT`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: message.text })
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const aiMessage: Message = { id: `ai-${Date.now()}`, text: (await response.json()).message.content, type: 'ai' };
      setMessages(messages => [...messages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send request');
    }
  };

  return (
    <LinearGradient
      colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
      style={styles.linearGradient}
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View style={styles.dropdownContainer}>
          <SelectList 
            data={data} 
            setSelected={onPetSelect}
            placeholder='Select a pet...' 
          />
        </View>
        <ScrollView contentContainerStyle={styles.chatContainer}>
          {messages.map((message) => (
            <Text key={message.id} style={[
              styles.message,
              message.type === 'ai' ? styles.aiMessage : styles.userMessage,
            ]}>
              {message.text}
            </Text>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your input..."
            onChangeText={setInputText}
            value={inputText}
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
            <Text style={styles.sendButtonText}>Send to Gigi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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
});

export default AIScreen;
