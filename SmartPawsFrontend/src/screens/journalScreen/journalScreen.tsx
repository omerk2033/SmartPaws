// user can view journal entries per pet and create new journal memories

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axiosInstance, { BASE_URL } from '../../services/config';
import { getAuth } from 'firebase/auth';
import { SelectList } from 'react-native-dropdown-select-list';
import { IJournalEntry, IPet } from '../../types';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SafeAreaWrapper from 'components/shared/safeAreaWrapper';

const JournalScreen = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const ownerId = currentUser ? currentUser.uid : "";
  const [entry, setEntry] = useState('');
  const [pets, setPets] = useState<IPet[]>([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [petDetails, setPetDetails] = useState<IPet | null>(null);
  const isFocused = useIsFocused();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [journalEntries, setJournalEntries] = useState<IJournalEntry[]>([]);
  const [entryAddedTrigger, setEntryAddedTrigger] = useState(false);

  // fetch user's pets for dropdown menu upon screen loading
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
      // Handle the error as appropriate...
    }
  };

  // Fetch pet details when selected pet changes
  // and fetch pet's journal entries to display 
  useEffect(() => {
    if (selectedPet) {
      fetchPetDetails(selectedPet);
      fetchJournalEntries();
    } else {
      setPetDetails(null);
    }
  }, [selectedPet, entryAddedTrigger]); // triggered if new pet is selected from dropdown or new journal entry has been saved

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
  const data =
    pets.map((pet: IPet) => ({
      key: pet.name,
      value: pet.name
    })
    );

  // Triggered when a pet is selected from the dropdown list
  const onPetSelect = (selectedValue: string) => {
    if (selectedPet !== selectedValue) {
      setSelectedPet(selectedValue);
    }

    console.log("Selected Pet: " + selectedValue);
  };

  const handleSaveEntry = async () => {
    try {
      const formattedDate = date.toLocaleDateString('en-US'); // format the date as a string
      // just printing
      console.log("ownerId: " + ownerId + " petName: " + petDetails?.name + " date: " + formattedDate + " entry: " + entry);

      if (petDetails?.name != null) {
        await saveJournalEntryToDatabase(ownerId, petDetails?.name, formattedDate, entry);
        // change the state to trigger fetchJournalEntries again
        // so that new journal entry will be rendered on screen
        setEntryAddedTrigger(!entryAddedTrigger); 
      }

      console.log('Entry saved:', entry);
    } catch (error) {
      console.log("Error in handleSaveEntry");
    }

    setEntry(''); // reset input box

  };

  const saveJournalEntryToDatabase = async (
    ownerId: string,
    petName: string,
    date: string,
    entry: string
  ) => {
    try {
      const response = await axiosInstance.post("journalEntry/create", {
        ownerId,
        petName,
        date,
        entry
      });
      console.log("journal saved to MongoDB");
      return response.data.journalEntry;
    } catch (error) {
      console.log("error in saveJournalEntryToDatabase", error);
      throw error;
    }
  }

  const fetchJournalEntries = async () => {
    try {
      // get current user's uid 
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const ownerId = currentUser ? currentUser.uid : "";

      // make get request to backend with ownerId of currently logged in user
      // and selected pet name
      console.log("fetchJournalEntries called");
      console.log(BASE_URL + 'journalEntry/get/' + ownerId + '/' + selectedPet);
      const response = await fetch(BASE_URL + 'journalEntry/get/' + ownerId + '/' + selectedPet);
      const data = await response.json();
      setJournalEntries(data);
      console.log(journalEntries);
    } catch (error) {
      console.error("Error fetching journal entries", error);
    }
  };

  console.log(journalEntries);

  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
        style={styles.linearGradient}
      >
        <ScrollView keyboardShouldPersistTaps='handled' style={styles.scrollViewStyle}>
          <View style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 23, fontWeight: '700', color: 'white' }}>Pet Journal</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.dropdownContainer}>
              <SelectList
                data={data}
                setSelected={onPetSelect}
                placeholder='Select a pet...'
                boxStyles={styles.selectListStyle}
                dropdownTextStyles={styles.selectListStyle}
              />
            </View>

            <View>
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={date}
                  mode={'date'}
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || date;
                    setDate(currentDate);
                  }}
                />
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.buttonText}>Select a date</Text>
                </TouchableOpacity>
              )}

              <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.dateDisplay}>Selected Date: {date.toLocaleDateString('en-US')}</Text>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode={'date'}
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || date;
                    setShowDatePicker(Platform.OS === 'ios');
                    setDate(currentDate);
                  }}
                />
              )}
            </View>
            <View>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Write your journal entry here..."
                value={entry}
                onChangeText={setEntry}
              />

              <TouchableOpacity style={styles.button} onPress={handleSaveEntry}>
                <Text style={styles.buttonText}>Save Entry</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            {selectedPet &&
              <Text style={styles.heading}>{selectedPet}'s Journal Entries</Text>
            }
          </View>
          <View style={{ flex: 1 }}>

            {/* sort journal entries by date and display */}
            {/* date format is like 4/13/2024 */}
            {journalEntries.sort((a, b) => {
              // convert dates to array of #s [month, day, year]
              const dateA = a.date.split('/').map(Number);
              const dateB = b.date.split('/').map(Number);
              // convert to Date and return journal entry that is later (more recent) 
              return new Date(dateB[2], dateB[0] - 1, dateB[1]).getTime() - new Date(dateA[2], dateA[0] - 1, dateA[1]).getTime();
            }).map((journalEntry: IJournalEntry, index: number) => (
              <View key={index}>
                <Text style={styles.journalDate}>{journalEntry.date}</Text>
                <Text style={styles.journalMemoryStyle}>{journalEntry.entry}</Text>
              </View>
            ))}

          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    marginTop: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, // Add some vertical padding if needed
    borderWidth: 0, // If you want an outline for the container
    borderColor: '#cccccc', // Color for the container border
    borderRadius: 30, // Example border radius
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Opaque background
    overflow: 'hidden', // Ensures nothing goes outside the container's bounds
  },
  input: {
    height: 100,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Opaque background
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue',
    borderRadius: 25,
    width: 140,
    alignItems: 'center',
    alignSelf: 'center',
  },
  selectListStyle: {
    width: '100%', // Ensure SelectList fills the container width
    borderRadius: 20, // Match the dropdownContainer's border radius
    padding: 0,
    margin: 0,
    borderColor: 'transparent', // Make the border color transparent
    borderWidth: 0, // Set border width to 0 to remove it
  },
  dateDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 10
  },
  journalEntryStyle: {
    backgroundColor: '#ADD8E6',
    color: 'blue',
    alignSelf: 'stretch', // This will make the element stretch to fill the parent container
    width: '100%', // This will make the element take up 100% of the width of its parent container
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16
  },
  journalMemoryStyle: {
    backgroundColor: '#7BA3B5',
    color: 'blue',
    alignSelf: 'stretch', // This will make the element stretch to fill the parent container
    width: '100%', // This will make the element take up 100% of the width of its parent container
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 2, // This will make the border somewhat thick
    borderColor: '#3B6F7C', // This will make the border blue    
  },
  scrollViewStyle: {
    flex: 1,
    paddingHorizontal: 5.5,
    marginTop: 13,
  },
  heading: {
    marginTop: 40,
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
  },
  journalDate: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '600',
  },

});

export default JournalScreen;