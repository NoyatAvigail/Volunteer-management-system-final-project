import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
    getToken = fn;
}

async function request(startDate, endDate, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method: 'GET',
            url: `${API_URL}/api/contacts`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: { startDate, endDate }
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

export const contactsServices = {
    getAll: (startDate, endDate, onSuccess, onErrorr) =>
        request(startDate, endDate, onSuccess, onErrorr),
}