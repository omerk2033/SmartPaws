import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import { Image, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

export default function OnBoarding1() {
  const navigation = useNavigation<HomeStackNavigationProps>();

  const navigateToOnboard2Screen = () => {
    navigation.navigate("Onboard2");
  }

  return (
    <SafeAreaWrapper>
      <TouchableOpacity 
        style={{ flex: 1 }} 
        activeOpacity={1} 
        onPress={navigateToOnboard2Screen} 
      >
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899"]}
          style={{ flex: 1 }}
        >
          <Box alignItems="center" mt="5">
            <Image
              source={require('../../../assets/sp_logo.png')}
              style={{ width: 225, height: 225 }}
            />
          </Box>

          <Box flex={1} justifyContent="center" alignItems="center">
            <Text
              textAlign="center"
              variant="textXl"
              fontWeight="700"
              color="zinc900"
              style={{ marginHorizontal: 20 }}
            >
              Thank you for joining us at SmartPaws! We strive to keep your pets happy and healthy.
              Together, we can make a difference in their lives with cutting-edge technology and a
              compassionate community. Our powerful AI assistant, Gigi, is here to help you along the way!
            </Text>
          </Box>
          <Box alignItems="center" mb="10">
            <Text
              color='fuchsia900'
              style={{ fontSize: 16 }}
            >
              Tap anywhere to continue...
            </Text>
          </Box>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
