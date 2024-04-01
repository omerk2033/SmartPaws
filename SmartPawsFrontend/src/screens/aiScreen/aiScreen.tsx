import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance, { BASE_URL } from '../../services/config';
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
    // modifying to specify pet type as IPet
    // and using pet.name as the key 
    // pets.map((pet: any) => ({
    pets.map((pet: IPet) => ({
      // key: pet.id,
      key: pet.name,
      value: pet.name
    }))
  );

  // Triggered when a pet is selected from the dropdown list
  const onPetSelect = (selectedValue: string) => {
    setSelectedPet(selectedValue);
  };

  // creating a json object instead
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

  // } 
  // construct pet profile json object to send to backend
  // for pet profile to be sent to new thread when 1st asking a question about a pet
  const petDetailsJsonObj = {
    name: petDetails?.name,
    age: petDetails?.age,
    species: petDetails?.species,
    breed: petDetails?.breed,
    color: petDetails?.color,
    gender: petDetails?.gender,
    vaccinationRecords: petDetails?.vaccinationRecords,
    medsSupplements: petDetails?.medsSupplements,
    allergiesSensitivities: petDetails?.allergiesSensitivities,
    prevIllnessesInjuries: petDetails?.prevIllnessesInjuries,
    diet: petDetails?.diet,
    exerciseHabits: petDetails?.exerciseHabits,
    indoorOrOutdoor: petDetails?.indoorOrOutdoor,
    reproductiveStatus: petDetails?.reproductiveStatus,
    notes: petDetails?.notes,
    threadId: petDetails?.threadId,
  }

  // Triggered when pet details change
  useEffect(() => {
    if (petDetails) {
      sendPetDetailsToAI(petDetails);
    }
  }, [petDetails]);

  // Send pet details to the AI
  const sendPetDetailsToAI = async (pet: IPet) => {
    // if threadId already exists, then don't send all of the pet details to the thread again
    if(pet.threadId != "") {
      console.log("there is already a thread associated with this pet so no need to send to assistant");
      console.log(pet.threadId);
      return;
    }

    // a thread id is not associated with this pet profile yet, so proceed

    const petMessageContent = constructPetDetailsMessage(pet);

    // Log the pet message content
    console.log("Sending pet details to AI:", petMessageContent);

    // // Simulate an AI response by echoing the pet details
    const simulatedAIResponse = `Received the following pet details:\n${petMessageContent}`;
    // const simulatedAIResponse = `Received ${pet.name}'s details`;

    // Add the AI response to the messages state
    const aiMessage: Message = { id: `ai-${Date.now()}`, text: simulatedAIResponse, type: 'ai' };
    setMessages(messages => [...messages, aiMessage]);

    // if thread id is not associated with this pet, call it nope 
    // to check in backend if a new thread needs to be created
    let threadId = pet.threadId;
    if(threadId == "") {
      threadId = "nope";
    }
    try {
      const petDetailsString = JSON.stringify(petDetailsJsonObj);
      console.log("petDetailsString: " + petDetailsString);
      // const response = await fetch(`${BASE_URL}user/chatGPT`, {
      // const response = await fetch(`${BASE_URL}user/chatGPT/${threadId}`, {
      const response = await fetch(`${BASE_URL}user/chatGPT/${pet.ownerId}/${pet.name}/${threadId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ input: petMessageContent })
        body: JSON.stringify({ input: petDetailsString })
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);

      // get newly created thread id from backend and updated pet profile
      const responseBody = await response.json();
      const receivedThreadId = responseBody.threadId;
      console.log("thread id received from backend: " + receivedThreadId);
      // update pet with new thread id 
      pet.threadId = receivedThreadId;

      // update pet profile in mongodb with new threadId
      await updatePetProfileInDatabase(pet);

    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send pet details to AI');
    }
  };

  const updatePetProfileInDatabase = async (pet: IPet) => {
    try {
        console.log(BASE_URL + "pet/update/" + pet.ownerId + "/" + pet.name);
        // Put request sent to pet/update route to update preexisting pet profile with updated values
        const response = await axiosInstance.put(BASE_URL + "pet/update/" + pet.ownerId + "/" + pet.name, pet);
        console.log("Pet updated in MongoDB");
        return response.data.pet;
    } catch (error) {
        console.log("Error in updatePetProfileInDatabase", error);
    }
  };

  const handleSendRequest2 = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const newMessage: Message = { id: `user-${Date.now()}`, text: inputText, type: 'user' };
    processUserMessage2(newMessage);
  };

  const processUserMessage2 = async (message: Message) => {
    setMessages(messages => [...messages, message]);
    setInputText('');

    try {
      console.log("petDetails.ownerId: " + petDetails?.ownerId);
      // check if no pet is selected, then use random chatgpt designated thread not associated with a particular pet
      let threadIdToSend = "";
      if(petDetails?.ownerId === undefined) {
        threadIdToSend = process.env.CHATGPT_GEN_THREAD_ID ?? ""; 
      }
      else {
        threadIdToSend = petDetails.threadId;
      }
      // const response = await fetch(`${BASE_URL}user/chatGPT`, {
      // const response = await fetch(`${BASE_URL}user/chatGPT/${petDetails?.ownerId}/${petDetails?.name}/${petDetails?.threadId}`, {
      const response = await fetch(`${BASE_URL}user/chatGPT/${petDetails?.ownerId}/${petDetails?.name}/${threadIdToSend}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: message.text })
      });

      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      const responseBody = await response.json();
      const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          text: responseBody.message, // extract the message text back from the response
          type: 'ai'
      };
      console.log(aiMessage);
      // const aiMessage: Message = { id: `ai-${Date.now()}`, text: (await response.json()).message.content, type: 'ai' };
      setMessages(messages => [...messages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send request');
    }
  };

  // const handleSendRequest = async () => {
  //   if (!inputText.trim()) {
  //     Alert.alert('Error', 'Please enter a message');
  //     return;
  //   }

  //   const newMessage: Message = { id: `user-${Date.now()}`, text: inputText, type: 'user' };
  //   processUserMessage(newMessage);
  // };

  // const processUserMessage = async (message: Message) => {
  //   setMessages(messages => [...messages, message]);
  //   setInputText('');

  //   try {
  //     const response = await fetch(`${BASE_URL}user/chatGPT`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ input: message.text })
  //     });

  //     if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
  //     const aiMessage: Message = { id: `ai-${Date.now()}`, text: (await response.json()).message.content, type: 'ai' };
  //     setMessages(messages => [...messages, aiMessage]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Alert.alert('Error', 'Failed to send request');
  //   }
  // };

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
          {/* <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}> */}
          <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest2}>
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
