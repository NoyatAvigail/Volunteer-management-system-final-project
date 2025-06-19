import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
    getToken = fn;
}

async function request(endpoint, method = 'GET', body, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/api/volunteers/${endpoint}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            ...(method === "GET" ? { params: body } : { data: body })
        };
        const response = await axios(config);
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        if (error.response?.status === 403) {
            logOutFunc();
        }
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const volunteerService = {
    getAll: (table, onSuccess, onError) =>
        request(table, "GET", null, onSuccess, onError),
    getByValue: (table, params, onSuccess, onError) =>
        request(table, "GET", params, onSuccess, onError),
    update: (entityName, data, onSuccess, onError) =>
        request(entityName, "PUT", data, onSuccess, onError),
}