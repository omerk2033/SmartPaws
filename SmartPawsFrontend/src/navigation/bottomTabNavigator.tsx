// Screens that can be accessed via the bottom tab navigator.
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import HomeStackNavigator from "./homeStackNavigator"; // make sure this is correct
import theme from "../utils/theme/style"; // make sure this is correct
import aiScreen from "../screens/aiScreen/aiScreen"; // make sure this is correct
import journalScreen from "../screens/journalScreen/journalScreen"; // make sure this is correct
import mapScreen from "../screens/mapScreen/mapScreen"; // make sure this is correct

const Tab = createBottomTabNavigator();

type HomeTabButtonProps = {
  children: React.ReactNode;
};

// Custom tab button component
const HomeTabButton: React.FC<HomeTabButtonProps> = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={{ marginRight: 25 }} onPress={() => {
        // Reset the navigation state to go to the Home screen of HomeStack
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'HomeStack', // The name of the stack navigator in RootBottomTabParamList
                state: {
                  index: 0,
                  routes: [{ name: 'Home' }], // The name of the home screen in HomeStackParamList
                },
              },
            ],
          })
        );
      }}
    >
      {children}
    </TouchableOpacity>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.gray550,
        tabBarInactiveTintColor: theme.colors.gray550,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          paddingLeft: 35,  
          paddingRight: -40
        },
        tabBarItemStyle: {
          marginHorizontal: 0,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
          tabBarButton: (props) => (
            <HomeTabButton {...props}>
              <MaterialIcons name="home" color="grey" size={34} />            
              {props.children}
            </HomeTabButton>
          ),
        }}
      />
      <Tab.Screen
        name="AiStack"
        component={aiScreen}
        options={{
          title: "Gigi",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="goat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="JournalStack"
        component={journalScreen}
        options={{
          title: "Journal",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MapStack"
        component={mapScreen}
        options={{
          title: "Locate Vet",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
