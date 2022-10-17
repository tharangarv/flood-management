import {apiInstance} from "../api/apiInstance";

export const login = async (email, password) => {
    const url = '/login';
    const {data} = await apiInstance.post(url, new URLSearchParams({
            email,
            password
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

    return data;
}

export const addUser = async (name, email, role, accessToken) => {
    const url = '/api/users/';
    const defaultPassword = 'password123';

    const {data} = apiInstance.post(url, {
        name,
        email,
        role,
        password: defaultPassword
    }, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });
    return data;
}

export const getUsers = async (accessToken) => {
    const url = '/api/users/';
    const {data} = await apiInstance(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });
    return data;
}

export const getUser = async (email, accessToken) => {
    const url = `/api/users/${email}`;
    const {data} = await apiInstance(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}

export const deleteUser = async (email, accessToken) => {
    const url = `/api/users/${email}`;

    const {data} = await apiInstance.delete(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}

export const changePassword = async (newPassword, oldPassword, accessToken) => {

    const url = '/api/users/change_password';

    const {data} = await apiInstance.post(url, {
        old_password: oldPassword,
        new_password: newPassword
    }, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;

}

export const getUserRoles = async (accessToken) => {
    const url = '/api/users/role';
    const {data} = await apiInstance(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}