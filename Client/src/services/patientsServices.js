import axios from 'axios';
import Cookies from 'js-cookie';
import { logOutFunc } from '../js/logout.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
let getToken = () => Cookies.get('token');

export function setTokenGetter(fn) {
    getToken = fn;
}

async function request({ method = 'GET', url = "", data = null, onSuccess, onError }) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/api/patients${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data,
        };

        const response = await axios(config);
        const result = response.data;
        if (onSuccess) onSuccess(result);
        return result;
    } catch (error) {
        if (error.response?.status === 403) {
            logOutFunc();
        }
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const patientsService = {
    getAll: (onSuccess, onError) =>
        request({ method: 'GET', url: '', data: null, onSuccess, onError, }),
    create: (data, onSuccess, onError) =>
        request({ method: 'POST', url: '', params: null, data, onSuccess, onError, }),
    update: (id, body = {}, onSuccess, onError) =>
        request({ method: 'PUT', url: `/${id}`, data: body, params: null, onSuccess, onError }),
}