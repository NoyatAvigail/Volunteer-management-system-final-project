import axios from 'axios';
import Cookies from 'js-cookie';
import { logOutFunc } from '../js/logout.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
let getToken = () => Cookies.get('token');

export function setTokenGetter(fn) {
    getToken = fn;
}

export async function sendEditRequests() {
    try {
         const token = getToken();
        await axios.post(`${API_URL}/api/profiles/send-edit-email`, {}, {
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (err) {
        console.error("Failed to send edit email:", err);
    }
}

export async function handleVerifyCode(code, setIsEditing, setShowCodeInput) {
    try {
        await axios.post(`${API_URL}/api/profiles/verify-edit-code`, { code }, {
            headers: { authorization: `Bearer ${getToken()}` }
        });
        setIsEditing(true);
        setShowCodeInput(false);
        alert("Verification successful. You may now edit the profile.");
    } catch (err) {
        console.error("Verification failed:", err);
        alert("Invalid or expired code.");
    }
}

async function request(method = 'GET',url, body = null, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}/api/profiles${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: body, 
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

export const profilesServices = {
    getAll:(url="")=>
    request('GET',`/${url}`),
    update: (url="",data, onSuccess, onError) =>
        request('PUT', `/${url}`, data, onSuccess, onError),
    create: (data, onSuccess, onError) =>
        request('POST',"", data, onSuccess, onError),
}


