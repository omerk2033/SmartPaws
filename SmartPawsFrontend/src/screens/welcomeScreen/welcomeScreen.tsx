import React, { useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { AuthScreenNavigationType } from "../../navigation/types";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { Box, Text } from "../../utils/theme/style";
import { Image, Animated, TouchableOpacity } from 'react-native';

export default function WelcomeScreen() {

  const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>();

  const navigateToSignUpScreen = () => {
    navigation.navigate("SignUp");
  }

  // Create an animated value
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation when the component mounts
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceAnim]);

  // Interpolate the animated value to use it for scale transformation
  const bounce = bounceAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1], // Scale from 100% to 110% to 100%
  });

  return (
    <SafeAreaWrapper>
      <TouchableOpacity style={{ flex: 1 }} onPress={navigateToSignUpScreen} activeOpacity={1}>
        <LinearGradient
          colors={["#1B7899", "#43B2BD", "#43B2BD", "#43B2BD", "#1B7899",
          ]}
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
                transform: [{ scale: bounce }],
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
          <Box alignItems="center" mt="10">
            <Text
              textAlign="center"
              variant="textXs"
              fontWeight="700"
              color="zinc900"
            >
              Tap anywhere to continue...
            </Text>
          </Box>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
