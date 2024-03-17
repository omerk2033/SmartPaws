// need to use context in order to be able to set initialScreen going from authStackNavigator to homeStackNavigator 
// context is a built in way in react
// to pass data through the component tree 
// without having to pass props manually through every level of the tree
import React from 'react';

export const NavigationContext = React.createContext({
    initialScreen: 'Home',
    setInitialScreen: (value: string) => {},
});