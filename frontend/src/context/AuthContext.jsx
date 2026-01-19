import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check for existing session on mount
    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token')
            if (token) {
                try {
                    const res = await API.get('/auth/me')  // hits backend and check token there
                    setUser(res.data)
                } catch (err) {
                    console.log(err.message)
                    localStorage.removeItem('token') // if token was not there or expired
                }
            }
            setLoading(false)
        }
        checkUser()
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}