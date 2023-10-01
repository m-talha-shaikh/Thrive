import { createContext, useEffect, useState } from "react";

export const AuthContext= createContext();

export const AuthContextProvider = ({children})=>
{
    const [CurrentUser,setCurrentUser]= useState(JSON.parse(localStorage.getItem("user"))||null);
    const toggel =()=>
    {
        
    };
    useEffect(()=>
    {
      localStorage.setItem("user",CurrentUser);
    },[CurrentUser]);
    
    
    return(<AuthContext.Provider value={{darkMode,toggel}}>{children}</AuthContext.Provider>);
}