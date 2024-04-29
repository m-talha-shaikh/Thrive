import axios from "axios";


export const makeRequest = axios.create({
    baseURL:"http://192.168.100.7:3000/api/v1",
    withCredentials:true

})