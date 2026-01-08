import React from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Home() {
  const {user,loading} = useContext(AuthContext)

  if (loading) return <p>Loading...</p>

  return user ? <h1>Welcome {user.name}</h1> : <h1>Guest</h1>
}
