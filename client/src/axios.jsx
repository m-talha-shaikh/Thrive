import axios from "axios";


export const makeRequest = axios.create({
    baseURL:"http://192.168.163.188:3000/api/v1",
    withCredentials:true

})