import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8080/api' ,
})

// problem solved of token delete on every refresh now this runs before every request 
API.interceptors.request.use((req)=>{
    const token = localStorage.getItem('token')

    if (token){
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

export default API;