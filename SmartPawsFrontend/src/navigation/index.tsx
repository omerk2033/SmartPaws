// Important configuration file that puts user on what stack accordingly.

import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import AuthStackNavigator from "./authStackNavigator";
import AppStackNavigator from "./appStackNavigator";
import { onAuthStateChanged } from "firebase/auth"; // Import the onAuthStateChanged function
import { FIREBASE_AUTH } from "../services/firebase";

// adding context to be able to control if Home screen loads from SignIn screen or Onboard1 loads from SignUp screen
import { NavigationContext } from './navigationContext';

const Navigation = () => {
  const [initialScreen, setInitialScreen] = useState('Home');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Change initial state to false

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setIsAuthenticated(!!user);

      // set inital screen of home stack based on if user exists already
      // otherwise will be registering for the 1st time and will go to Onboard1 instead
      // setInitialScreen(user ? 'Home' : 'Onboard1');
      setInitialScreen(user ? 'Home' : 'TermsOfUse');
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContext.Provider value={{ initialScreen, setInitialScreen }}>
      <NavigationContainer>
        {isAuthenticated ? <AppStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </NavigationContext.Provider>
  );
};

export default Navigation;

