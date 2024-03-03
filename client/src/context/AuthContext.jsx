import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { makeRequest } from "../axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const Login = async (inputs) => {
  try {
    const res = await makeRequest.post(
      "/Auth/login",
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
    await makeRequest.post(
      "/Auth/logout",
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


  return (
    <AuthContext.Provider value={{ currentUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
