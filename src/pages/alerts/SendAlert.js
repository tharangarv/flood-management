import React from "react";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
import {LoadingButton} from "@mui/lab";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";

import {Card, Container, Grid, Stack, Typography} from "@mui/material";
import Page from "../../components/Page";
import {FormProvider, RHFTextField} from "../../components/hook-form";
import useAuth from "../../hooks/useAuth";
import errorHandler from "../../utils/errorHandler";
import {sendAlert} from "../../repository/alert";

export const SendAlert = () => {

    const {auth} = useAuth();

    const AlertSchema = Yup.object().shape({
        alertName: Yup.string().min(4).required("Alert Title is required"),
        alertBody: Yup.string().min(6).required('Alert Body is required'),
    });

    const defaultValues = {
        alertName: '',
        alertBody: '',
    };

    const methods = useForm({
        resolver: yupResolver(AlertSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
        reset,
    } = methods;

    const onSubmit = async (data) => {
        try {
            await sendAlert(auth.accessToken, data.alertName, data.alertBody)
            reset(defaultValues);
            toast.success("Alert sent to devices")
        } catch (e) {
            const messages = {
                e401: 'Not Authorized',
            }
            const options = {
                isSignOut: true
            }
            errorHandler(e, messages, options);
        }
    };

    return (
        <Page title="Send Alert">
            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Send Alert
                    </Typography>
                </Stack>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={{padding: '20px'}}>
                            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={3}>
                                    <RHFTextField name="alertName" label="Alert Title"/>
                                    <RHFTextField name="alertBody" label="Alert Body"/>
                                </Stack>

                                <LoadingButton sx={{my: 3, alignItems: 'center'}} size="large"
                                               type="submit"
                                               variant="contained"
                                               loading={isSubmitting}>
                                    Send Alert
                                </LoadingButton>
                            </FormProvider>
                        </Card>
                    </Grid>
                </Grid>

            </Container>
        </Page>
    );

}