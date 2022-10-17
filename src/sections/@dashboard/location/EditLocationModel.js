import React, {useEffect, useState} from "react";
import {Box, Modal, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as Yup from "yup";
import {toast} from "react-toastify";

import {FormProvider, RHFTextField} from "../../../components/hook-form";
import {editLocation} from "../../../repository/map";
import SignOutToast from "../../../components/auth/SignOutToast";
import errorHandler from "../../../utils/errorHandler";

const EditLocationModel = ({open, handleClose, item}) => {

    const initialState = {
        name: '',
        longitude: 0,
        latitude: 0
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: 'none',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
    };
    const LocationSchema = Yup.object().shape({
        name: Yup.string().min(4).required("Location name is required"),
        longitude: Yup.number().required("Longitude is required"),
        latitude: Yup.number().required("Latitude is required"),
    });


    const defaultValues = {
        name: '',
        longitude: 0,
        latitude: 0,
    };

    const methods = useForm({
        resolver: yupResolver(LocationSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: {isSubmitting},
        reset
    } = methods;

    useEffect(() => {
        if (open) {
            reset(item)
        }
    }, [open]);

    const onSubmit = async (data) => {
        if (item?.id === null) {
            return toast.warning('Something happened, please close and retry.')
        }
        try {
            await editLocation(item.id, data.name, data.longitude, data.latitude);
            handleClose(item.id, data.name, data.longitude, data.latitude);
            toast.success('Location updated');
        } catch (e) {
            const messages = {
                e401: 'Location not found'
            }
            const options = {
                isSignOut: true
            };

            errorHandler(e, messages, options)
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: '20px'}}>
                    Edit Location
                </Typography>

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
            </Box>
        </Modal>
    )

}

export default EditLocationModel;