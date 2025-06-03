// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const registerAuth = async (endpoint, body, onSuccess, onError) => {
//     console.log(`Request to ${endpoint}:`, body);
//     try {
//         const response = await axios.post(
//             `${API_URL}/${endpoint}`,
//             body,
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log(`Response from ${endpoint}:`, response);    
//         const data = response.data;
//         if (onSuccess) onSuccess(data);
//         return data;
//     } catch (error) {
//         console.error("123456", error);
//         if (onError) onError(error.message);
//     }
// };

// export const signup = (body, onSuccess, onError) => registerAuth("signup", body, onSuccess, onError);
// export const login = (body, onSuccess, onError) => registerAuth("login", body, onSuccess, onError);
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const registerAuth = async (endpoint, body, onSuccess, onError) => {
    console.log(`Request to ${endpoint}:`, body);

    let requestBody = body;
    let headers = { 'Content-Type': 'application/json' };

    const hasImage = body?.details?.image instanceof File;

    if (hasImage) {
        const formData = new FormData();
        for (const key in body) {
            if (key === 'details') {
                for (const dKey in body.details) {
                    if (dKey === 'image') {
                        formData.append('image', body.details.image);
                    } else {
                        formData.append(`details[${dKey}]`, body.details[dKey]);
                    }
                }
            } else {
                formData.append(key, body[key]);
            }
        }

        requestBody = formData;
        headers = {}; // לא מגדירים 'Content-Type' ידנית עם FormData
    }

    try {
        const response = await axios.post(`${API_URL}/${endpoint}`, requestBody, { headers });
        console.log(`Response from ${endpoint}:`, response);
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        console.error("123456", error);
        if (onError) onError(error.message);
    }
};

export const signup = (body, onSuccess, onError) => registerAuth("signup", body, onSuccess, onError);
export const login = (body, onSuccess, onError) => registerAuth("login", body, onSuccess, onError);