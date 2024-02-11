import {ThemeProvider} from "@shopify/restyle";
import theme from "./src/utils/theme/style";
import Navigation from "./src/navigation";
import {SafeAreaContext, SafeAreaProvider} from "react-native-safe-area-context";
import {SWRConfig} from "swr";
import {AppState} from "react-native";

export default function App() {



  return (
   <ThemeProvider theme={theme}>
     <SafeAreaProvider>
         <SWRConfig
             value={{
                 provider: () => new Map(),
                 isVisible: () => {
                     return true
                 },
                 initFocus(callback) {
                     let appState = AppState.currentState

                     const onAppStateChange = (nextAppState: any) => {
                         /* If it's resuming from background or inactive mode to active one */
                         if (
                             appState.match(/inactive|background/) &&
                             nextAppState === "active"
                         ) {
                             callback()
                         }
                         appState = nextAppState
                     }

                     // Subscribe to the app state change events
                     const subscription = AppState.addEventListener(
                         "change",
                         onAppStateChange
                     )

                     return () => {
                         subscription.remove()
                     }
                 },
             }}
         >
             <Navigation/>
         </SWRConfig>

     </SafeAreaProvider>
   </ThemeProvider>
  );
}

