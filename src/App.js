import {ToastContainer} from "react-toastify";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import {BaseOptionChartStyle} from './components/chart/BaseOptionChart';
import {AuthProvider} from "./context/AuthProvider";

// ----------------------------------------------------------------------

export default function App() {
    return (
        <>
            <AuthProvider>
                <ToastContainer/>
                <ThemeProvider>
                    <ScrollToTop/>
                    <BaseOptionChartStyle/>
                    <Router/>
                </ThemeProvider>
            </AuthProvider>
        </>
    );
}
