import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { CurrentUser } from './App';
import Search from './Search';
import Sort from './Sort';
import Add from './Add';
import Delete from './Delete';
import Update from './Update';
import '../style/Posts.css';
import { apiService } from '../../services/genericServeices';

function Volunteer() {
    const [shifts, setShifts] = useState([]);
    const [fixedShifts, setFixedShifts] = useState([]);
    const [openCalls, setOpenCalls] = useState([]);
    const [error, setError] = useState(null);
    const [isChange, setIsChange] = useState(0);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser?.id) {
            setError("המשתמש לא מחובר");
            return;
        }

        const fetchData = async () => {
            try {
                await apiService.getByValue(currentUser.id, "Shifts", { volunteerId: currentUser.id }, setShifts, setError);
                await apiService.getByValue(currentUser.id, "FixedShifts", { volunteerId: currentUser.id }, setFixedShifts, setError);
                await apiService.getAll(currentUser.id, "OpenCalls", setOpenCalls, setError);
            } catch (err) {
                setError("שגיאה בטעינת נתונים: " + err);
            }
        };

        fetchData();
    }, [currentUser.id, isChange]);

    if (error) return <div>{error}</div>;

    return (
        <div className='volunteer-dashboard'>
            <h1>שלום, {currentUser.firstName}</h1>

            <div className="section">
                <h2>המשמרות שלי</h2>
                <Sort type="Shifts" setIsChange={setIsChange} options={["id", "date"]} userData={shifts} setData={setShifts} />
                <Search type="Shifts" setIsChange={setIsChange} options={["All", "ID", "Date"]} data={shifts} setData={setShifts} />
                {shifts.map(shift => (
                    <div key={shift.id} className="post-item">
                        <p>#{shift.id}</p>
                        <p>תאריך: {shift.date}</p>
                        <p>מיקום: {shift.location}</p>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2>משמרות קבועות</h2>
                {fixedShifts.map(fixed => (
                    <div key={fixed.id} className="post-item">
                        <p>#{fixed.id}</p>
                        <p>יום: {fixed.weekDay}</p>
                        <p>שעה: {fixed.hour}</p>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2>בקשות פתוחות</h2>
                {openCalls.map(call => (
                    <div key={call.id} className="post-item">
                        <p>#{call.id}</p>
                        <p>סוג: {call.type}</p>
                        <p>כתובת: {call.address}</p>
                        <button onClick={() => navigate(`/take-call/${call.id}`)}>אני לוקח</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Volunteer;