// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { create } from "zustand"
// import { createJSONStorage, persist } from "zustand/middleware"
// import {IAuthenticatedUser} from "../types";
//
// interface IUserGlobalStore {
//     user: IAuthenticatedUser | null
//     updateUser: (user: IAuthenticatedUser | null) => void
// }
//
// const useUserGlobalStore = create<IUserGlobalStore>()(
//     persist(
//         (set, get) => ({
//             user: null,
//             updateUser: (user) => {
//                 set({
//                     user,
//                 })
//             },
//         }),
//         {
//             name: "smart-paws-application-store",
//             storage: createJSONStorage(() => AsyncStorage),
//         }
//     )
// )
//
// export default useUserGlobalStore