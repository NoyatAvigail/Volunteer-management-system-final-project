// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { logOutFunc } from '../js/logout.js';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// let getToken = () => Cookies.get('token');

// export function setTokenGetter(fn) {
//     getToken = fn;
// }

// async function request(method = 'GET', id, body = null, onSuccess, onError) {
//     try {
//         const token = getToken();
//         const config = {
//             method,
//             url: `${API_URL}/api/contact/${id}}`,
//             headers: {
//                 authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             data: body,
//         };

//         const response = await axios(config);
//         const data = response.data;
//         if (onSuccess) onSuccess(data);
//         return data;
//     } catch (error) {
//         if (error.response?.status === 403) {
//             logOutFunc();
//         }
//         console.error(error);
//         if (onError) onError(error.message);
//     }
// }

// export const patientsService = {
//     getAll: () =>
//         request('GET',),
//     update: (id = "", data, onSuccess, onError) =>
//         request('PUT', id, data, onSuccess, onError),
//     create: (data, onSuccess, onError) =>
//         request('POST', "", data, onSuccess, onError),
// }


// services/patientsService.js
// import { request } from './requestHelper';
// services/requestHelper.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { logOutFunc } from '../js/logout.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
let getToken = () => Cookies.get('token');

export function setTokenGetter(fn) {
    getToken = fn;
}

export async function request(method = 'GET', url, body = null, onSuccess, onError) {
    try {
        const token = getToken();
        const config = {
            method,
            url: `${API_URL}${url}`,
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

export const patientsService = {
    getAll: () => request('GET', '/api/contacts/patients'),
    getById: (id) => request('GET', `/api/contacts/patients/${id}`),
    update: (id, data, onSuccess, onError) =>
        request('PUT', `/api/contacts/patients/${id}`, data, onSuccess, onError),
    create: (data, onSuccess, onError) =>
        request('POST', `/api/contacts/patients`, data, onSuccess, onError),
};
