// components/common/UserRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>; // Optional loading state
    
    // If not logged in, go to login
    if (!user) return <Navigate to="/login" replace />;

    // If children exist, render them (for old style), otherwise render <Outlet /> (for nested routes style)
    return children ? children : <Outlet />;
};

export default UserRoute;
