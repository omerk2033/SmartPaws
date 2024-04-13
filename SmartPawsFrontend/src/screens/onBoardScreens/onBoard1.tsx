import React from 'react';
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import Button from "../../components/shared/button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

export default function OnBoarding1() {

  // const navigation = useNavigation<AuthScreenNavigationType<"Onboard1">>();
  const navigation = useNavigation<HomeStackNavigationProps>();

  const navigateToOnboard2Screen = () => {
    navigation.navigate("Onboard2");
  }

  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={[
          "#C2BBF0",
          "#C2BBF0",
          "#C2BBF0",
          "#C2BBF0",
          "#C2BBF0",
          "#C2BBF0",
        ]}
        style={{ flex: 1 }}
      >
        {/* Add Image at the top and center */}
        <Box flex={1} justifyContent="center">
          <Box alignItems="center" mb="10">
            <Text
              textAlign="center"
              variant="textXl"
              fontWeight="700"
              color="blu900"
            >
              Registering a Pet:
              Use the Add Pet button and fill out the requested fields about your pet! They will be added to
              the home screen which will allow you to manage your pet's data.
            </Text>
          </Box>
          <Text
            textAlign="center"
            variant="textXl"
            fontWeight="700"
            color="red700"
          >
            Fi
          </Text>
          <Box my="3.5" mx="10">
            <Button
              label="Next"
              onPress={navigateToOnboard2Screen}
            />
          </Box>
        </Box>
      </LinearGradient>
    </SafeAreaWrapper>
  );
}
