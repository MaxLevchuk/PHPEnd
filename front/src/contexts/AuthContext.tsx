import React, {FC, ReactNode, useState} from "react";

interface AuthContextProps {
    isAuth: boolean;
    UserLogin: () => void;
    UserExit: () => void;
}
const default_={
    isAuth:false,
};


export const AuthContext = React.createContext<AuthContextProps|undefined>(undefined);
export const AuthProvider = ({ children }) => {
    const [isAuth, setAuth] = useState(false);
    const UserLogin = () => setAuth(true);
    const UserExit = () => setAuth(false);
    const value: AuthContextProps = { isAuth, UserLogin, UserExit };
    return(<AuthContext.Provider value={value}>{ children }</AuthContext.Provider>)
}
