// frontend/src/contexts/AuthContext.jsx
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

// import React, { createContext, useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode"; // Ensure you have jwt-decode installed

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token"));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         // Check if the token is expired
//         if (decoded.exp * 1000 < Date.now()) {
//           logout();
//         } else {
//           setUser({ id: decoded.id }); // this is the moment the app officially considers the user logged in
//         }
//       } catch (error) {
//         console.error("Invalid token:", error);
//         logout();
//       }
//     }
//     setLoading(false);
//   }, [token]);

//   const login = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null); // essential to do
//     setUser(null); // essential to do
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token,login, logout, loading, isAuthenticated: !!user }}
//     >
//       {/* !!user  is a quick way to turn a user obejct or null into true or false*/}
//       {children}
//       {/* // other way to write rather than !!user */}
//       {/* <AuthContext.Provider value={{user,token, login,logout, loading, 
//       isAuthenticated: user ? true : false 
//       }}>
//       {children}
//       </AuthContext.Provider> */}
//     </AuthContext.Provider>
//   );
// };


// // !!user	Very concise, idiomatic	Can be cryptic to beginners
// // Boolean(user)	Extremely readable, explicit	Slightly more typing
// // user !== null	Very clear and specific	Assumes null is the only "falsy" state
// // user ? true : false	Clear logic flow	Unnecessarily verbose