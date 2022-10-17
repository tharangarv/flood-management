import {toast} from "react-toastify";
import {
    defaultError,
    e400, e401, e404, e405, e408, e409,
    noResponse
} from "../constants/defaultErrorMessages";
import SignOutToast from "../components/auth/SignOutToast";

const ErrorHandler = (error, messages, options) => {

    if (!error?.response) {
        return toast.warning(noResponse);
    }

    const {status} = error.response;

    if (status === 400) {
        toast.warning(messages?.e400 || e400);
    } else if (status === 401) {
        toast.warning(<SignOutToast isSignOut={options?.isSignOut} message={messages?.e401 || e401}/>);
    } else if (status === 404) {
        toast.warning(messages?.e404 || e404);
    } else if (status === 405) {
        toast.warning(messages?.e405 || e405);
    } else if (status === 408) {
        toast.warning(messages?.e408 || e408);
    } else if (status === 409) {
        toast.warning(messages?.e409 || e409);
    } else {
        const httpError = status ? ` | ${status}` : '';
        toast.warning(`${defaultError} ${httpError}`);
    }
    console.log(error);

}

export default ErrorHandler;