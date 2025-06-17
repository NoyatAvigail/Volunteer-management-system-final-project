import React, { createContext, useContext, useState, useEffect } from "react";
import { codeServices } from '../services/codeServices';
export const CodesContext = createContext([]);

export const CodesProvider = ({ children }) => {
    const [codes, setCodes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const data = await codeServices.getAllCodes();
                setCodes(data);
            } catch (error) {
                console.error("Failed to load codes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCodes();
    }, []);

    return (
        <CodesContext.Provider value={{ codes, loading }}>
            {children}
        </CodesContext.Provider>
    );
};

export const useCodes = () => useContext(CodesContext);