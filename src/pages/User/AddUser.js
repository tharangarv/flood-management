import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {toast} from "react-toastify";
import {Card, Container, Grid, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";

import errorHandler from "../../utils/errorHandler";
import {FormProvider, RHFTextField} from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
import {addUser, getUserRoles} from "../../repository/user";
import RHFDropDown from "../../components/hook-form/RHFDropDown";
import Page from "../../components/Page";


const AddUser = () => {
    const {auth} = useAuth();

    const [roles, setRoles] = useState([]);

    const UserSchema = Yup.object().shape({
        name: Yup.string().min(4).required("Name is required"),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        role: Yup.string().required("User Role is required"),
    });

    const defaultValues = {
        name: '',
        email: '',
        role: '',
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
            await addUser(data.name, data.email, data.role, auth.accessToken);
            reset(defaultValues);
            toast.success("User added")
        } catch (e) {
            const messages = {
                e401: 'Not Authorized',
                e400: 'User email already exists'
            }
            const options = {
                isSignOut: true
            }
            errorHandler(e, messages, options);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const result = await getUserRoles(auth.accessToken);
                setRoles(result.items);

            } catch (e) {
                const messages = {
                    e404: 'Roles not found'
                }
                const options = {
                    isSignOut: true
                }
                errorHandler(e, messages, options);
            }
        })();
    }, []);

    return (
        <Page title="Add User">
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Add User
                    </Typography>
                </Stack>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{padding: '20px'}}>
                            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <RHFTextField name="name" label="Name"/>
                                    <RHFTextField name="email" label="Email"/>
                                    <RHFDropDown name="role" label="User Role" options={roles}/>
                                    <p>Default password : password123</p>
                                </Stack>

                                <LoadingButton sx={{my: 3, alignItems: 'center'}} size="large"
                                               type="submit"
                                               variant="contained"
                                               loading={isSubmitting}>
                                    Add User
                                </LoadingButton>
                            </FormProvider>
                        </Card>
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );
}

export default AddUser;