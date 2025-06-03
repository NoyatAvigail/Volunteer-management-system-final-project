import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const registerAuth = async (endpoint, body, onSuccess, onError) => {
    console.log(`Request to ${endpoint}:`, body);
    try {
        const response = await axios.post(
            `${API_URL}/${endpoint}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(`Response from ${endpoint}:`, response);    
        const data = response.data;
        if (onSuccess) onSuccess(data);
        return data;
    } catch (error) {
        console.error(error);
        if (onError) onError(error.message);
    }
};

export const signup = (body, onSuccess, onError) => registerAuth("signup", body, onSuccess, onError);
export const login = (body, onSuccess, onError) => registerAuth("login", body, onSuccess, onError);