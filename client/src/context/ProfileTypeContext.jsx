import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { makeRequest } from "../axios";

export const ProfileTypeContext = createContext();


export const ProfileTypeContextProvider = ({ children }) => {

    const fetchAccountType = async (id) => {
        try {
            const response = await makeRequest.get(`/Auth/accountType/${id}`);
            
            const accountType = response.data.accountType;

            switch(accountType) {
                case 'person':
                    window.history.pushState({}, '', `/person/${id}`);
                    window.location.reload();
                    break;
                case 'institute':
                    window.history.pushState({}, '', `/institute/${id}`);
                    window.location.reload();
                    break;
                case 'organization':
                    window.history.pushState({}, '', `/organization/${id}`);
                    window.location.reload();
                    break;
                default:
                    console.log("Unknown account type:", accountType);
            }

            return response.data;
        } catch (error) {
            console.error("Failed to fetch account type:", error);
            return null;  
        }
    };


    return (
        <ProfileTypeContext.Provider value={{ fetchAccountType }}>
            {children}
        </ProfileTypeContext.Provider>
    );
}
