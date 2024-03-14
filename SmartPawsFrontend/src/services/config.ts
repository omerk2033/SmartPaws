// require('dotenv').config();
import axios from "axios"
import * as SecureStore from "expo-secure-store"
//import * as process from "process";
//  export const BASE_URL = process.env["API_URL " as string]
// to get rid of network error directly inputting ip address here 
// but need to figure out concealing ip address...
export const BASE_URL = `http://192.168.254.68:1337/`;


const TIME_OUT = 3000
export const SMART_PAWS_TOKEN = "smart_paws_token"

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
})

axiosInstance.interceptors.request.use(async (req) => {
    try {
        const access_token = await SecureStore.getItemAsync(SMART_PAWS_TOKEN)
        req.headers.Authorization = access_token
        return req
    } catch (error) {
        return req
    }
})

axiosInstance.interceptors.response.use(response => {
    // Check if the response data is not empty and is a valid object before assuming it's JSON
    if (response.data && typeof response.data === 'object') {
      return response;
    } else {
      throw new Error('Response data is not valid JSON');
    }
  }, error => {
    // Handle errors
    return Promise.reject(error);
  });  

export default axiosInstance