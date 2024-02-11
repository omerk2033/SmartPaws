// Important configuration file that puts user on what stack accordingly.

import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AuthStackNavigator from "./authStackNavigator";
import AppStackNavigator from "./appStackNavigator";
import { onAuthStateChanged } from "firebase/auth"; // Import the onAuthStateChanged function
import { FIREBASE_AUTH } from "../services/firebase";

const Navigation = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Change initial state to false

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setIsAuthenticated(!!user); // Update isAuthenticated based on user existence
        });

        // Cleanup function for useEffect
        return () => unsubscribe();
    }, []);

    return (
        <NavigationContainer>
            {isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
    );
};

export default Navigation;

