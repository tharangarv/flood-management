import {useLocation, Navigate, Outlet} from "react-router-dom";
import {toast} from "react-toastify";
import useAuth from "../../hooks/useAuth";

const AuthGuard = ({allowedRoles}) => {

    const {auth} = useAuth();
    const location = useLocation();

    if (auth?.roles?.find(role => allowedRoles.includes(role))) {
        return <Outlet/>
    }
    if (auth?.email) {
        toast.warn("Not allowed to access")
        return <Navigate to="/dashboard/app" state={{from: location}} replace/>
    }
    return <Navigate to="/login" state={{from: location}} replace/>
}

export default AuthGuard;