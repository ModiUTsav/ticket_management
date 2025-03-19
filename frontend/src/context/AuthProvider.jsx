import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Restoring user from localStorage:", JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
    }
    setLoading(false)
  }, []);

  const login = (userData) => {
    try {
      console.log("Processing user login data:", userData);

      if (!userData.token) {
        throw new Error("No token provided");
      }

      const decodedToken = jwtDecode(userData.token);

      const storedUser = {
        user_id: decodedToken.user_id, // ✅ Extracted from token
        email: userData.email, // ✅ Ensure email is retrieved
        role: decodedToken.role, // ✅ Extract role
        token: userData.token,
        
      };

      setUser(storedUser);
      localStorage.setItem("user", JSON.stringify(storedUser));
      console.log("srored user", storedUser);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
