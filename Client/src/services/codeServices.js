import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const codeServices = {
    getAllCodes: async () => {
        const response = await axios.get(`${API_URL}/api/codetables`);
        return response.data;
    }
};
