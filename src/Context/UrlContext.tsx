// defining a context provider for whole app to access the user data, once logged in 

import React, { createContext, useEffect } from "react"
import { useFetch } from "../customHooks/useFetch";
import { getCurrentUser } from "../db/userAuth";

interface contextType{
    userInfo : {
        role? : string;
    } | null ;
    loading : boolean;
    isAuthenticated : boolean;
    fetchUserInfo : () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const urlContext = createContext<contextType | undefined>(undefined);

interface propType{
    children : React.ReactNode;
}

export function UrlContextProvider({children}:propType){

    const { data:userInfo, loading, callCb:fetchUserInfo } = useFetch(getCurrentUser);

    const isAuthenticated = userInfo?.role === "authenticated";

    useEffect(()=>{
        if(!userInfo) fetchUserInfo();
        
    },[fetchUserInfo,userInfo])

    return <urlContext.Provider value={{userInfo, isAuthenticated, loading, fetchUserInfo}}>
        {children}
    </urlContext.Provider>
}