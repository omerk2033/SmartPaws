import React from 'react'
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import Button from "../../components/shared/button";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeStackNavigationProps = NativeStackNavigationProp<HomeStackParamList, 'RegPet'>

export default function OnBoarding2() {

  const navigation = useNavigation<HomeStackNavigationProps>()

  const navigateToOnboard3Screen = () => {
    navigation.navigate("Onboard3")
  }
  const navigateToOnboard1Screen = () => {
    navigation.navigate("Onboard1")
  }

  return (
    <SafeAreaWrapper>
      <LinearGradient
        colors={[
          "#8FB8ED",
          "#8FB8ED",
          "#8FB8ED",
          "#8FB8ED",
          "#8FB8ED",
          "#8FB8ED",
        ]}
        style={{ flex: 1 }}
      >
        <Box flex={1} justifyContent="center">
          <Box alignItems="center" mb="3.5">

          </Box>
          <Text textAlign="center" variant="textXl" fontWeight="700">
            Concern Tracker:
            Enabling this for a pet will keep track of when a concern was noted.
            You can add more details about the concern within this space to help maintain your
            pet's progress.
          </Text>
          <Box my="3.5" mx="10">
            <Button
              label="Next"
              onPress={navigateToOnboard3Screen}
            />
          </Box>
          <Box my="3.5" mx="10">
            <Button
              label="Back"
              onPress={navigateToOnboard1Screen}
            />
          </Box>
        </Box>
      </LinearGradient>
    </SafeAreaWrapper>
  )

}