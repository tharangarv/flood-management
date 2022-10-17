import React, {useEffect, useState} from "react";
import {Box, Card, CardHeader} from "@mui/material";
import GoogleMapReact from 'google-map-react';

import Marker from "./Marker";
import {getLocations} from "../../repository/map";
import useAuth from "../../hooks/useAuth";
import errorHandler from "../../utils/errorHandler";

const MapCard = ({title, handleDataAdding, isDataAdding, ...other}) => {

    const {auth} = useAuth();
    const [markers, setMarkers] = useState([]);

    const apiKey = process.env.REACT_APP_MAP_KEY;
    const center = {
        lat: parseFloat(process.env.REACT_APP_MAP_CENTER_LAT),
        lng: parseFloat(process.env.REACT_APP_MAP_CENTER_LONG)
    }
    const zoom = parseInt(process.env.REACT_APP_MAP_ZOOM, 10);

    useEffect(() => {
        if (isDataAdding) {
            (async () => {
                try {
                    const data = await getLocations(auth.accessToken);
                    setMarkers(data?.items);
                } catch (e) {
                    const messages = {
                        e404: 'No Markers'
                    }

                    const options = {
                        isSignOut: true
                    }

                    errorHandler(e, messages, options);
                }
            })()
            handleDataAdding(false);
        }
    }, [isDataAdding]);

    const MarkersList = () => (
        markers.map((marker, index) => (
                <Marker key={index} name={marker.name} lat={marker.latitude} lng={marker.longitude}/>
            )
        )
    );

    return (
        <Card {...other}>
            <CardHeader title={title}/>
            <Box sx={{mx: 3, my: 3}} dir="ltr">
                <div style={{height: '70vh', width: '100%'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{key: apiKey}}
                        defaultCenter={center}
                        defaultZoom={zoom}
                    >
                        {MarkersList()}
                    </GoogleMapReact>
                </div>
            </Box>
        </Card>
    );
}

export default MapCard;
