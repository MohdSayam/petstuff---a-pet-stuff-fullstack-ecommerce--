import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullPageLoader from "../../loading/FullPageLoader";
import { Navigate } from "react-router-dom";

export default function AdminRoute({children}){
    const {loading, user} = useContext(AuthContext)

    if (loading){
        return <FullPageLoader/>
    }

    // check user and if is admin or not 
    if (!user || user.role !== 'admin'){
        console.log("Access denied")
        return <Navigate to="/login"/>
    }

    // if everything fine redirect to admin dashboard
    return children
}