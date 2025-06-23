// import axios from 'axios';

// export const addThankYou = async ({ contactId, message }) => {
//   const res = await axios.post('/api/thank-you', { contactId, message });
//   return res.data;
// };
import axios from "axios";
import Cookies from "js-cookie";
import { logOutFunc } from "../js/logout.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

let getToken = () => Cookies.get('token');
export function setTokenGetter(fn) {
  getToken = fn;
}

async function request({ method, url = "", data = null, onSuccess, onError }) {
  try {
    const token = getToken();
    const response = await axios({
      method,
      url: `${API_URL}/api/thankyous${url}`,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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

export const thankYousService = {
  getNotesByFromId: (onSuccess, onError) =>
    request({ method: 'GET', url: '', data: null, onSuccess, onError, }),
  create: (data, onSuccess, onError) =>
    request({ method: 'POST', url: '', data, onSuccess, onError, }),
  updateNote: (id, body = {}, onSuccess, onError) =>
    request({ method: 'PUT', url: `/${id}`, data: body, onSuccess, onError }),
  deleteNote: (id, onSuccess, onError) =>
    request({ method: 'DELETE', url: `/${id}`, data: {}, onSuccess, onError, }),
}