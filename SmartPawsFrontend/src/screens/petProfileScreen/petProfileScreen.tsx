import {Box,  Text} from "../../utils/theme/style";
import {useNavigation} from "@react-navigation/native";
import SafeAreaWrapper from "../../components/shared/safeAreaWrapper";
import { Button, ScrollView, View } from "react-native";
import {HomeStackParamList} from "../../navigation/types";
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAuth, signOut } from 'firebase/auth';

import React, { useEffect, useState } from "react";
import { IPet } from "../../types";
import { BASE_URL } from "../../services/config";

const PetProfileScreen = () => {

    return(
        <SafeAreaWrapper>
        <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, paddingHorizontal: 5.5, marginTop: 13}}>
            <Box>
                <Text>Pet Profile Screen</Text>
            </Box>
        </ScrollView>
    </SafeAreaWrapper>

    )
}

export default PetProfileScreen