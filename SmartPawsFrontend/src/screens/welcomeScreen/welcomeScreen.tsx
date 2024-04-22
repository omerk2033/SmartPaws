import React, { useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigationType } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import { Image, Animated } from 'react-native';

export default function WelcomeScreen() {
  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();

  const fadeAnim = useRef(new Animated.Value(1)).current;  // Initial opacity set to 1

  useEffect(() => {
    // Set a timeout for automatic navigation with fade effect
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      }).start(() => {
        navigation.navigate("SignUp");  // Navigate after the fade animation completes
      });
    }, 3000);  // Wait for 3 seconds before starting the fade-out

    return () => clearTimeout(timer);  // Clear the timeout if the component unmounts
  }, [navigation, fadeAnim]);

  return (
    <SafeAreaWrapper>
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
        <Box alignItems="center" mt="10">
          <Animated.Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "700",
              color: "#FFFFFF",
            }}
          >
            Welcome to SmartPaws
          </Animated.Text>
        </Box>
        <Box alignItems="center" mt="10">
          <Text
            textAlign="center"
            variant="textLg"
            fontWeight="700"
            color="fuchsia900"
          >
            Keeping your pets happy and healthy!
          </Text>
        </Box>
      </LinearGradient>
    </SafeAreaWrapper>
  );
}
