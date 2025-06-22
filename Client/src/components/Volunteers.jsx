import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { CurrentUser } from './App';

function Volunteers() {
    const [error, setError] = useState(null);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    console.log("Volunteers component loaded");

    useEffect(() => {
        if (!currentUser?.id) {
            setError("User is not logged in");
            return;
        }
    }, [currentUser.id, isChange]);

    if (error) return <div>{error}</div>;

    return (
        <div className='volunteer-dashboard'>
        </div>
    );
}

export default Volunteers;