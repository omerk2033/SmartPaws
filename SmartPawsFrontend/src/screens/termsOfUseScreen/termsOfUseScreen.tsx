// display terms of use 

import React from "react";
import { Text, TouchableOpacity, StyleSheet, View, ScrollView, } from "react-native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationType } from "navigation/types";

const TermsOfUseScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationType<"RegPet">>();

  const navigateToSettingsScreen = () => {
    navigation.navigate("Settings");
  }
  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
        style={styles.linearGradient}
      >
        <ScrollView keyboardShouldPersistTaps='handled'>

          <Text style={[styles.title, { marginTop: 20 }]}>Terms Of Use</Text>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold', textAlign: 'left', paddingHorizontal: 30, marginTop: 10 }}>
              Welcome to SmartPaws, the virtual veterinarian chatbot designed to provide you with preliminary advice and information regarding your pet's health. By using SmartPaws, you agree to be bound by these Terms of Use.{'\n'}{'\n'}
              The advice provided by SmartPaws is based on the information you provide and is for informational purposes only. No veterinary-client-patient relationship is established through the use of this app. SmartPaws is not a substitute for professional veterinary advice, diagnosis, or treatment.{'\n'}{'\n'}
              SmartPaws and its creators are not liable for any decisions or actions you take based on the information provided by the chatbot. It is your responsibility to seek immediate veterinary attention from a licensed professional for any health concerns you may have about your pets.{'\n'}{'\n'}
              As a user, you agree to provide accurate and complete information about your pets. You acknowledge that the effectiveness of the advice given by SmartPaws is directly related to the quality and completeness of the information you provide.{'\n'}{'\n'}
              SmartPaws reserves the right to modify these Terms of Use at any time. Your continued use of SmartPaws after any such changes constitutes your acceptance of the new Terms of Use.{'\n'}{'\n'}
              By using SmartPaws, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use.{'\n'}{'\n'}
            </Text>
          </View>
          <TouchableOpacity onPress={navigateToSettingsScreen} style={[styles.button, { backgroundColor: '#201A64' }]}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>

      </LinearGradient>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'space-between', // Push content to the top and button to the bottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30, // Adjust this value to control the "ovalness" of the button
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default TermsOfUseScreen;

