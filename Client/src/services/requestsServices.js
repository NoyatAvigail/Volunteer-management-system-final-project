// import axios from "axios";
// import Cookies from "js-cookie";
// import { logOutFunc } from "../js/logout.js";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// let getToken = () => Cookies.get('token');
// export function setTokenGetter(fn) {
//     getToken = fn;
// }

// async function request(startDate, endDate, onSuccess, onError) {
//     try {
//         const token = getToken();
//         const config = {
//             method: 'GET',
//             url: `${API_URL}/api/requests`,
//             headers: {
//                 authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             params: { startDate, endDate }
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

// export const requestsServices = {
//     getAll: (startDate, endDate, onSuccess, onErrorr) =>
//         request(startDate, endDate, onSuccess, onErrorr),
// }
import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
    getToken = fn;
}

async function request({ method,url="", params = null, data = null, onSuccess, onError }) {
    try {
        const token = getToken();
        const response = await axios({
            method,
            url: `${API_URL}/api/requests${url}`,
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params,
            data,
        });
        const result = response.data;
        if (onSuccess) onSuccess(result);
        return result;
    } catch (error) {
        if (error.response?.status === 403) {
            logOutFunc();
        }
        console.error(`${method} failed:`, error);
        if (onError) onError(error.message);
    }
}
export const requestsServices = {
    getAll: (startDate, endDate, onSuccess, onError) =>
        request({ method: 'GET',url:'', params: { startDate, endDate }, data: null, onSuccess, onError, }),
    createEvent: (data, onSuccess, onError) =>
        request({ method: 'POST',url:'', params: null, data, onSuccess, onError, }),
    patch: (id, onSuccess, onError) =>
        request({ method: 'PUT',url:`/${id}`, params: null, data:{}, onSuccess, onError, }),
    deleteEvent: (body, onSuccess, onError) =>
        request({ method: 'DELETE',url:'', params: null, body, onSuccess, onError, }),

}