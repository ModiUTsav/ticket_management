import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider.jsx";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        console.log("🔹 Current user in ProtectedRoute:", user);
        console.log("🔹 Allowed roles:", allowedRoles);
        console.log("🔹 User role:", user?.role);  // Debug role specifically
    }, [user]);

    if (loading) {
        return <p>Loading...</p>;  
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/not-authorized" replace />;
    }

    return element;
};

export default ProtectedRoute;
