import React from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate()
  const {user,loading} = useContext(AuthContext)

  if (loading) return <p>Loading...</p>

  return user ? <h1>Welcome {user.name}</h1> : (
  <><h1>Guest</h1><button onClick={() => navigate("/register")} className="p-6 bg-brand-primary rounded-xl mt-4 mx-4 hover:bg-green-400">Register</button></>
)
}
