import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
    CompositeNavigationProp,
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native"
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from "@react-navigation/native-stack"

export type AuthStackParamList = {
    Welcome: undefined
    SignIn: undefined
    SignUp: undefined
    Onboard1: undefined
    Onboard2: undefined
    Onboard3: undefined
}

export type RootBottomTabParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    AiStack: NavigatorScreenParams<AiStackParamList>
    JournalStack: NavigatorScreenParams<JournalStackParamList>
    ProfileStack: NavigatorScreenParams<ProfileStackParamList>
}

export type HomeStackParamList = {

    Home: undefined
    // adding RegPet Screen 
    RegPet: undefined
    // when user is logged out of firebase index.tsx will handle switching to welcome screen
    Settings: undefined
    // user clicks on the settings button in the header
    PetProfile: undefined
}

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
    Notifications: undefined;
    PrivacySettings: undefined;
    Settings: undefined;
    About: undefined;
    Help: undefined;
    Feedback: undefined;
    Logout: undefined;
};


export type AiStackParamList = {
    aiScreen: undefined
}

export type JournalStackParamList = {
    journal: undefined
}


export type AppStackParamList = {
    Root: NavigatorScreenParams<RootBottomTabParamList>
    Settings: undefined
}

export type RootStackParamList = {
    AppStack: NavigatorScreenParams<AppStackParamList>
    AuthStack: NavigatorScreenParams<AuthStackParamList>
}

export type AuthScreenNavigationType<
    RouteName extends keyof AuthStackParamList
> = CompositeNavigationProp<
    NativeStackNavigationProp<AuthStackParamList, RouteName>,
    NativeStackNavigationProp<AppStackParamList, "Root">
>

export type RootTabScreenProps<Screen extends keyof RootBottomTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<RootBottomTabParamList, Screen>,
        NativeStackScreenProps<RootBottomTabParamList>
    >

// trying to mimic the type of AuthScreenNavigationType for HomeScreen
export type HomeScreenNavigationType<
    RouteName extends keyof HomeStackParamList
> = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList, RouteName>,
    NativeStackNavigationProp<AppStackParamList, "Root">
>