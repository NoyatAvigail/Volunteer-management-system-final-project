import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(method = 'GET', url, body = null, onSuccess, onError) {
    try {
        const config = {
            method,
            url: `${API_URL}/api/home/${url}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: body,
        };
        const response = await axios(config);
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const homeServices = {
    getStats: (onSuccess, onError) =>
        request('GET', 'stats', null, onSuccess, onError),
};