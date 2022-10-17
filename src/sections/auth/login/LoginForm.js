import * as Yup from 'yup';
import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {toast} from 'react-toastify';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Stack, IconButton, InputAdornment} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import {getUser, login} from "../../../repository/user";
import useAuth from "../../../hooks/useAuth";
import ErrorHandler from "../../../utils/errorHandler";

export default function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const {setAuth} = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const from = location?.state?.from || '/dashboard/app';

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().min(8).required('Password is required'),
    });

    const defaultValues = {
        email: '',
        password: '',
        remember: true,
    };

    const methods = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = methods;

    const onSubmit = async (data) => {
        try {
            const authData = await login(data.email, data.password);
            const userData = await getUser(data.email, authData?.access_token);

            toast.success("Success");

            const authDetails = {
                roles: JSON.parse(authData?.roles),
                accessToken: authData?.access_token,
                email: authData?.email,
                name: userData?.name
            };
            console.log(authDetails);
            setAuth(authDetails);
            navigate(from, {replace: true});

        } catch (e) {
            const errorMessages = {
                e401: 'Invalid Credentials',
                e404: 'Unable to find the user'
            }
            ErrorHandler(e, errorMessages);
        }
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack ack spacing={3}>
                <RHFTextField name="email" label="Email address"/>
                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>

            {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}> */}
            {/*    <RHFCheckbox name="remember" label="Remember me"/> */}
            {/*    <Link variant="subtitle2" underline="hover"> */}
            {/*        Forgot password?   */}
            {/*    </Link> */}
            {/* </Stack>  */}

            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}
                           sx={{marginTop: 5}}>
                Login
            </LoadingButton>
        </FormProvider>
    );
}
