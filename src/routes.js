import {Navigate, Routes, Route} from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
// components
import User from './pages/User/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import DashboardApp from './pages/DashboardApp';
import AuthGuard from "./components/auth/AuthGuard";
import AuthRedirect from "./components/auth/AuthRedirect";
import LocationList from "./pages/Locations/LocationList";
import AddLocation from "./pages/Locations/AddLocation";
import AddUser from "./pages/User/AddUser";
import Profile from "./pages/User/Profile";
import {SendAlert} from "./pages/alerts/SendAlert";
import {AlertList} from "./pages/alerts/AlertList";

const Router = () => (

    <Routes>
        {/* Public Routes */}
        <Route element={<AuthRedirect/>}>
            <Route path='/login' element={<Login/>}/>
        </Route>
        <Route path='/*' element={<Navigate to='/404' replace/>}/>

        <Route path='/' element={<LogoOnlyLayout/>}>
            <Route path='' element={<Navigate to='/dashboard/app'/>}/>
            <Route path='404' element={<NotFound/>}/>
            <Route path='*' element={<Navigate to='/404'/>}/>
        </Route>

        {/* Private Routes */}
        <Route path='/dashboard' element={<DashboardLayout/>}>
            <Route element={<AuthGuard allowedRoles={['Administrator']}/>}>
                <Route path='user' element={<User/>}/>
                <Route path='user/add' element={<AddUser/>}/>
            </Route>
            <Route element={<AuthGuard allowedRoles={['Administrator', 'Moderator']}/>}>
                <Route path='profile' element={<Profile/>}/>
                <Route path='app' element={<DashboardApp/>}/>
                <Route path='location/list' element={<LocationList/>}/>
                <Route path='location/add' element={<AddLocation/>}/>
                <Route path='alert/add' element={<SendAlert/>}/>
                <Route path='alert/list' element={<AlertList/>}/>
            </Route>
        </Route>

    </Routes>
);

export default Router;
