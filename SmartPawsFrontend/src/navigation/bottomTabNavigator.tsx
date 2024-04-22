// Screens that can be accessed via the bottom tab navigator.

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootBottomTabParamList } from "./types";
import React from "react";
import HomeStackNavigator from "./homeStackNavigator";
import theme from "../utils/theme/style";
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from the library
import aiScreen from "../screens/aiScreen/aiScreen";
import journalScreen from "../screens/journalScreen/journalScreen";
import mapScreen from "../screens/mapScreen/mapScreen";

const Tab = createBottomTabNavigator<RootBottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: theme.colors.gray550,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AiStack"
        component={aiScreen}
        options={{
          title: "AI Companion",
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
            <MaterialIcons name="bookmark" color={color} size={size} />
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
            <MaterialIcons name="map" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
