import {createContext, useEffect, useState} from "react";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {

    const localData = localStorage.getItem('auth');

    const initialState = JSON.parse(localData) || '';

    const [auth, setAuth] = useState(initialState);

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);


    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;