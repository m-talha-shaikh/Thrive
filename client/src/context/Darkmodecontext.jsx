import { createContext, useEffect, useState } from "react";

export const DarkmodeContext= createContext();

export const DarkModeContextProvider = ({children})=>
{
    const [darkMode,setDarkmode]= useState(JSON.parse(localStorage.getItem("darkMode"))||false);
    const toggel =()=>
    {
        setDarkmode(!darkMode);
    };
    useEffect(()=>
    {
        localStorage.setItem("darkMode",darkMode)
    },[darkMode]);
    
    
    return(<DarkmodeContext.Provider value={{darkMode,toggel}}>{children}</DarkmodeContext.Provider>);
}