import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet } from 'react-native';
import { HomeStackParamList } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

export default function OnBoarding2() {
  const navigation = useNavigation<HomeStackNavigationProps>();

  const navigateToNextScreen = () => {
    navigation.navigate("Onboard3"); // Adjust as needed for your flow
  }

  return (
    <SafeAreaWrapper>
      <TouchableOpacity style={styles.fullScreenButton} onPress={navigateToNextScreen} activeOpacity={1}>
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
          style={styles.fullScreen}
        >
          <Box flex={1} justifyContent="center" alignItems="center" paddingHorizontal="10">
          <Text 
              style={{
                textAlign: 'center', 
                fontSize: 24, 
                fontWeight: '700',
                textDecorationLine: 'underline' 
              }}
            >
            Explore our Key Features
          </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              Pet Profiles: Detailed and personalized because each pet is unique!
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              Gigi: Our powerful AI assistant, here to empower and guide you through pet care.
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              Concern Tracking: Toggle a profile you are concerned about to recieve daily reminders to check-in.
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              Journal: Keep heartfelt notes and track your pet’s milestones.
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              Locate Nearby Veterinaries: Quickly find veterinary care when you need it most.
            </Text>
          </Box>
          <Box alignItems="center" mb="10">
            <Text
              style={{ color: 'fuchsia900', fontSize: 16 }}
            >
              Tap anywhere to continue...
            </Text>
          </Box>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  fullScreenButton: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
});
