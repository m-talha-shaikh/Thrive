import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const Login = async (inputs) => {
    console.log(inputs);
    const res = await axios.post(
      "http://localhost:3000/api/v1/Auth/login",
      inputs,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(res.data);
    setCurrentUser(res.data);
  };

  const Logout = async () => {
    // Clear user data from localStorage
    const res = await axios.post(
        "http://localhost:3000/api/v1/Auth/logout"
        
      );
    localStorage.removeItem("user");
    // Set the currentUser to null or an initial value
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, Login, Logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
