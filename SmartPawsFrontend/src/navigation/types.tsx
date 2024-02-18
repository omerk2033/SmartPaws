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
}

export type RootBottomTabParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>
    Today: undefined
    Completed: undefined
  //  CategoriesStack: NavigatorScreenParams<CategoriesStackParamList>
}

export type HomeStackParamList = {
    Home: undefined
    // adding RegPet Screen 
    RegPet: undefined
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

// export type HomeScreenNavigationType =
//     NativeStackNavigationProp<HomeStackParamList>

// trying to mimic the type of AuthScreenNavigationType for HomeScreen
export type HomeScreenNavigationType<
    RouteName extends keyof HomeStackParamList
> = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList, RouteName>,
    NativeStackNavigationProp<AppStackParamList, "Root">
>