import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    !!localStorage.getItem("authToken")
  );

  const navigate = useNavigate();

  const register = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.find((user) => user.email === email);

    if (userExists) {
      alert("User already exists");
    } else {
      const hashedPassword = password; // Replace with actual hashing in production
      users.push({ email, password: hashedPassword });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Registration successful");
      navigate("/login");
    }
  };

  const login = (email, password) => {
    // You can remove the local user check if you're fully relying on the backend
    const token = localStorage.getItem("authToken");
    if (token && validateToken(token)) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert("Please log in again");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const validateToken = (token) => {
    // Add real token validation logic here (e.g., check expiration or make an API call)
    return !!token; // For now, just check if token exists
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);