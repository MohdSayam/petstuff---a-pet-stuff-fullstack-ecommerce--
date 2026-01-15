import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../../loading/FullPageLoader";
import { Navigate } from "react-router-dom";

export default function UserRoute({children}){
    const {loading, user} = useContext(AuthContext)

    if (loading){
        return <FullPageLoader/>
    }

    if (!user || user.role !== 'customer') {
        return <Navigate to="/login"/>
    }

    return children
}