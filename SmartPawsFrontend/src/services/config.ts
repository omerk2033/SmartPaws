import axios from "axios"
import * as SecureStore from "expo-secure-store"

export const BASE_URL = process.env.BASE_URL
console.log("BASE_URL: " + BASE_URL);
console.log("a change to config.ts to try to get stuff to update");

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