import React from 'react';
import * as Yup from 'yup';
import {toast} from 'react-toastify';
// form
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
// @mui
import {Stack} from '@mui/material';
import {LoadingButton} from '@mui/lab';
// components
import {FormProvider, RHFTextField} from '../../../components/hook-form';
import {addLocation} from "../../../repository/map";
import useAuth from "../../../hooks/useAuth";
import errorHandler from "../../../utils/errorHandler";

const AddLocationForm = ({handleDataAdding}) => {

    const {auth} = useAuth();

    const LocationSchema = Yup.object().shape({
        name: Yup.string().min(4).required("Location name is required"),
        longitude: Yup.number().required("Longitude is required"),
        latitude: Yup.number().required("Latitude is required"),
    });

    const defaultValues = {
        name: '',
        longitude: '',
        latitude: '',
    };

    const methods = useForm({
        resolver: yupResolver(LocationSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
        reset,
    } = methods;

    const onSubmit = async (data) => {
        try {
            const result = await addLocation(data.name, data.longitude, data.latitude, auth.accessToken);
            handleDataAdding(true);
            reset(defaultValues);
            toast.success("Location added")
        } catch (e) {
            if (!e?.response) {
                toast.warn("No response from server")
            } else if (e?.response?.status === 401) {
                toast.warn("Not Authorized")
            } else if (e?.response?.status === 400) {
                toast.warn('Location name already exists')
            } else {
                toast.warn("Something happened please try again")
            }
            const messages = {
                e401: 'Not Authorized',
                e400: 'Location name already exists'
            }
            const options = {
                isSignOut: true
            }
            errorHandler(e, messages, options);
        }
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <RHFTextField name="name" label="Location Name"/>
                <RHFTextField name="longitude" label="Longitude"/>
                <RHFTextField name="latitude" label="Latitude"/>
            </Stack>

            <LoadingButton sx={{my: 3}} fullWidth size="large" type="submit" variant="contained"
                           loading={isSubmitting}>
                Submit
            </LoadingButton>
        </FormProvider>
    );
}

export default AddLocationForm;
