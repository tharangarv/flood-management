import React, {useState} from "react";
import {Card, CardContent, Container, IconButton, InputAdornment, Stack} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {toast} from "react-toastify";
import Iconify from "../../components/Iconify";
import {FormProvider, RHFTextField} from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
import {changePassword} from "../../repository/user";
import ErrorHandler from "../../utils/errorHandler";

const ChangePassword = () => {

    const {auth} = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const UserSchema = Yup.object().shape({
        oldPassword: Yup.string().required("Old Password is required"),
        newPassword: Yup.string().min(8).required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    });

    const defaultValues = {
        oldPassword: '',
        newPassword: '',
        passwordConfirmation: '',
    };

    const methods = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
        reset,
    } = methods;

    const onSubmit = async (data) => {
        try {
            const result = await changePassword(data.newPassword, data.oldPassword, auth.accessToken);
            if (result) {
                reset(defaultValues);
                return toast.success("Password changed");
            }
            return toast.warning("something happened while updating password");

        } catch (e) {
            const messages = {
                e400: "Old password not matching"
            }
            const options = {
                isSignOut: true
            }
            return ErrorHandler(e, messages, options);
        }
    }

    return (
        <Container maxWidth="xl">
            <Card sx={{padding: '20px'}}>
                <CardContent>
                    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            <RHFTextField
                                name="oldPassword"
                                label="Old Password"
                                type={showOldPassword ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                                <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <RHFTextField
                                name="newPassword"
                                label="New Password"
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
                            <RHFTextField
                                name="passwordConfirmation"
                                label="Password Confirmation"
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                edge="end">
                                                <Iconify
                                                    icon={showPasswordConfirmation ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>

                        <LoadingButton sx={{my: 3, alignItems: 'center'}} size="large"
                                       type="submit"
                                       variant="contained"
                                       loading={isSubmitting}>
                            Change Password
                        </LoadingButton>
                    </FormProvider>
                </CardContent>
            </Card>
        </Container>
    );

}

export default ChangePassword;