import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";
import { getToken, setToken, clearToken } from "../utils/auth.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ id: decoded.id });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await api.auth.login(credentials);
      const receivedToken = res.data.token;
      
      setToken(receivedToken);
      setTokenState(receivedToken);
      
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (data) => {
     try {
        const res = await api.auth.signup(data);
        return res.data;
     } catch (err) {
        console.error("Signup failed:", err);
        throw err;
     }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login,signup, logout, loading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
