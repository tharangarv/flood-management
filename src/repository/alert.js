import {apiInstance} from "../api/apiInstance";

const url = 'api/alerts';

export const getAlerts = async (accessToken, isAlertLimited) => {

    const {data} = await apiInstance(url, {
        params: {
            alert_limit: isAlertLimited
        },
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return data;
}

export const getAlert = async (accessToken, alertId) => {

    const getSpecificAlertUrl = `${url}/${alertId}`;

    const {data} = await apiInstance(getSpecificAlertUrl, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}

export const sendAlert = async (accessToken, alertName, alertBody) => {

    const {data} = await apiInstance.post(url, {
        alert_name: alertName,
        alert_body: alertBody
    }, {
        headers: {Authorization: `Bearer ${accessToken}`}
    });

    return data;
}