import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const Login = async (inputs) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/Auth/login",
        inputs,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const Logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/Auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      setCurrentUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout failure if needed
    }
  };

  useEffect(() => {
    // Perform any initialization tasks here
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
