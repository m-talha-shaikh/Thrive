import { createContext, useEffect, useState } from "react";

export const AuthContext= createContext();

export const AuthContextProvider = ({children})=>
{
    const [currentUser,setCurrentUser]= useState(JSON.parse(localStorage.getItem("user"))||null);
    const Login =()=>
    {
        setCurrentUser({
            id:69,
            name:"Hamza Tufail69",
            Profile: "https://images.pexels.com/photos/2422294/pexels-photo-2422294.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        });
    };
    useEffect(()=>
    {
      localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser]);
    
    
    return(<AuthContext.Provider value={{currentUser,Login}}>{children}</AuthContext.Provider>);
}