// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Add a small delay so the boot loader is actually visible
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); 
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify", { email, otp });
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Verification failed" };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      return { success: true, message: data.message, email: data.email };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Registration failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
};