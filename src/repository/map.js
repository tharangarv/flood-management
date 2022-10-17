import {apiInstance} from "../api/apiInstance";

export const addLocation = async (name, longitude, latitude, accessToken) => {
    const url = 'api/locations';
    const {data} = await apiInstance.post(url, {
        name,
        longitude,
        latitude
    }, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}

export const getLocations = async (accessToken) => {
    const url = '/api/locations';
    const {data} = await apiInstance(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });
    return data;
}

export const editLocation = async (id, name, longitude, latitude) => {
    const url = 'api/locations';
    const {data} = await apiInstance.put(url, {
        id,
        name,
        longitude,
        latitude
    });

    return data;
}

export const deleteLocation = async (id, accessToken) => {
    const url = `/api/locations/${id}`;
    const {data} = await apiInstance.delete(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}
