import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { CurrentUser } from './App';
import Search from './Search';
import Sort from './Sort';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import '../style/Posts.css';
import { userService } from '../services/usersServices';

function Volunteers() {
    const [shifts, setShifts] = useState([]);
    const [fixedShifts, setFixedShifts] = useState([]);
    const [openCalls, setOpenCalls] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
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