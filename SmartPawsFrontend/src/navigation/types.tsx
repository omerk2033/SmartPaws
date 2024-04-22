// various types for use in defining variables in other program files

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

// trying moving onboarding screens to HomeStackParamList
export type AuthStackParamList = {
  Welcome: undefined
  SignIn: undefined
  SignUp: undefined
  // moved onboarding screens to home stack
  // Onboard1: undefined
  // Onboard2: undefined
  // Onboard3: undefined
}

export type RootBottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>
  AiStack: NavigatorScreenParams<AiStackParamList>
  JournalStack: NavigatorScreenParams<JournalStackParamList>
  MapStack: NavigatorScreenParams<SettingsStackParamList>
}

export type HomeStackParamList = {
  Onboard1: undefined
  Onboard2: undefined
  Onboard3: undefined

  Home: undefined
  // when user is logged out of firebase index.tsx will handle switching to welcome screen
  // usere clicks on add pet from home screen
  RegPet: undefined
  // user clicks on the settings button in the header
  Settings: undefined
  // user selects pet from home screen
  PetProfile: {
    ownerId: string;
    petName: string;
  }
  // user selects to update pet from pet profile screen
  UpdatePet: {
    ownerId: string;
    petName: string;
  }
  // bottom tab navigation screens
  Map: undefined
  UserProfile: undefined
  AIScreen: undefined
  Journal: undefined
  TermsOfUse: undefined
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

export type SettingsStackParamList = {
  settings: undefined
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

export type HomeScreenNavigationType<
  RouteName extends keyof HomeStackParamList
> = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, RouteName>,
  NativeStackNavigationProp<AppStackParamList, "Root">
>