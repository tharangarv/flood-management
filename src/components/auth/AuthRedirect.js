import {Navigate, Outlet} from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const AuthRedirect = () => {
    const {auth} = useAuth();
    return (
        auth?.email
            ? <Navigate to='/dashboard/app' replace/>
            : <Outlet/>
    );
}

export default AuthRedirect;