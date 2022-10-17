import React from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import useAuth from "../../hooks/useAuth";
import {e401} from "../../constants/defaultErrorMessages";

const SignOutToast = ({message, isSignOut = false}) => {

    const {setAuth} = useAuth();
    const navigate = useNavigate();

    const handleSignout = () => {
        setAuth(null);
        navigate('/login');
    }
    console.log(message)
    return (
        <>
            <p>{message}</p>
            {isSignOut && (<Button variant="contained" onClick={handleSignout}>Sign out</Button>)}
        </>
    );
}

export default SignOutToast;