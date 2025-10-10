"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext({
    Key: null,
})

const UserContextProvider = ({children}) => {
    const [key, setKey] = useState(null);

    return (
        <UserContext.Provider value={{key, setKey}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => useContext(UserContext);

export default UserContextProvider;