import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet} from 'react-native';
import { HomeStackParamList } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

export default function OnBoarding3() {
  const navigation = useNavigation<HomeStackNavigationProps>();

  const navigateToHomeScreen = () => {
    navigation.navigate("Home");
  }

  return (
    <SafeAreaWrapper>
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1}
        onPress={navigateToHomeScreen}
      >
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
          style={{ flex: 1 }}
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
            Getting Started
          </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              1.) Select 'Add Pet' to begin adding your pet's profile.
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              2.) Fill in the Pet Profile; the more information, the better!
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              3.) With your pet added, you can view, edit, and flag the profile for concern after selecting it.
            </Text>
            <Text textAlign="center" variant="textLg" fontWeight="600" style={{ marginTop: 20 }}>
              4.) Enjoy! You are all set to use SmartPaws to keep your pets happy and healthy.
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
  titleText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
});
