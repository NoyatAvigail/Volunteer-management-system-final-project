import axios from "axios";
import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(table, params = {}, method = 'GET', body = null, onSuccess, onError) {
    try {
        const config = {
            method,
            url: `${API_URL}/api/requests/${table}`,
            params
        };
        if (method !== 'DELETE' && body) {
            config.data = body;
        }
        const response = await axios(config);
        const data = response.data;
        if (onSuccess) {
            onSuccess(data)
        };
        return data;
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
}

export const genericServices = {
    getAll: (table, onSuccess, onError) =>
        request(table, {}, 'GET', null, onSuccess, onError),
    getByValue: (table, params, onSuccess, onError) =>
        request(table, params, 'GET', null, onSuccess, onError),
    getById: (table, onSuccess, onError) =>
        request(`${table}`, {}, 'GET', null, onSuccess, onError),
    getNested: (base, id, nested, params, onSuccess, onError) =>
        request(`${base}/${id}/${nested}`, params, 'GET', null, onSuccess, onError),
    create: (table, body, onSuccess, onError) =>
        request(table, {}, 'POST', body, onSuccess, onError),
    update: (table, id, data, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'PUT', data, onSuccess, onError),
    patch: (table, id, data, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'PATCH', data, onSuccess, onError),
    remove: (table, id, onSuccess, onError) =>
        request(`${table}/${id}`, {}, 'DELETE', null, onSuccess, onError),
};