import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
    getToken = fn;
}

async function request(userId, startDate, endDate, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method: 'GET',
            url: `${API_URL}/api/requests`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: { user: userId, startDate, endDate }
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

export const requestService = {
    getRequestsByContactAndDate: (userId, startDate, endDate, onSuccess, onErrorr) =>
        request(userId, startDate, endDate, onSuccess, onErrorr),
}