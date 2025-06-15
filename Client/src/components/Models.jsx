import React from "react"; 
import { createContext, useContext, useEffect, useState } from "react";
import { genericServices } from '../services/genericServices';

export const CodesContext = createContext([]);

export const CodesProvider = ({ children }) => {
    const codeTables = ["UserTypes", "Sectors", "Genders", "Hospitals", "Departments", "FamilyRelations", "VolunteeringTypes"];
    const [codes, setCodes] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllCode = async () => {
            const results = {};
            await Promise.all(
                codeTables.map(async (table) => {
                    try {
                        const response = await genericServices.getAll(table);
                        console.log(`Data from ${table}:`, response);
                        if (Array.isArray(response)) {
                            results[table] = response;
                        } else {
                            console.error(`Invalid data from ${table}`, response);
                            results[table] = [];
                        }
                    } catch (error) {
                        console.error(`Error fetching ${table}`, error);
                        results[table] = [];
                    }
                })
            );
            setCodes(results);
            setLoading(false); 
        };
        fetchAllCode();
    }, []);

    return (
        <CodesContext.Provider value={{ codes, loading }}>
            {children}
        </CodesContext.Provider>
    );
};

export const useCodes = () => useContext(CodesContext);