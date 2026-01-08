import { createContext,useState,useEffect} from "react";
import API from "../api/axios";

export const AuthContext  = createContext()  // container for data

export const AuthProvider = ({children})=>{ // children means every component we will be using in this auth provider 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // check if user is already logged in when our app starts
    useEffect(()=>{
        const checkUser = async ()=>{
            const token = localStorage.getItem('token')
            if (token){
                try {
                    const res = await API.get('/auth/me')  // hits backend and check token there
                    setUser(res.data.user)
                } catch (err) {
                    console.log(err.message)
                    localStorage.removeItem('token') // if token was not there or expired
                }
            }
            setLoading(false)
        }
        checkUser()
    },[]); // [] make sure it runs one time only when the page loads

    const login = (userData, token)=>{
        localStorage.setItem('token', token)
        setUser(userData)
    }

    const logout = ()=>{
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}