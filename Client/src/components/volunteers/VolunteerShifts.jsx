import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CurrentUser } from "../App";
import Sort from '../Sort';
import Search from '../Search';

function Shifts() {
    const { currentUser } = useContext(CurrentUser);
    const [shifts, setShifts] = useState([]);
    const [isChange, setIsChange] = useState(false);


    useEffect(() => {
        if (!currentUser?.id) return;

        axios
            .get(`/api/events/my-shifts/${currentUser.id}`)
            .then((res) => {
                setShifts(res.data);
            })
            .catch((err) => {
                console.error("אירעה שגיאה בטעינת המשמרות", err);
            });
    }, [currentUser]);

    return (
        <div>

            <h2>המשמרות שלי</h2>
            <Sort type="Shifts" setIsChange={setIsChange} options={["id", "date"]} userData={shifts} setData={setShifts} />
            <Search type="Shifts" setIsChange={setIsChange} options={["All", "ID", "Date"]} data={shifts} setData={setShifts} />
            {/* {shifts.map((shift) => (
                <div key={shift.id}>
                    <p>תאריך: {new Date(shift.date).toLocaleDateString()}</p>
                    <p>שעה: {shift.startTime} - {shift.endTime}</p>
                    <p>בית חולים: {shift.hospital}</p>
                    <p>מחלקה: {shift.department}</p>
                </div>
            ))} */}
            {Array.isArray(shifts) && shifts.length > 0 ? (
                shifts.map((shift) => (
                    <div key={shift.id}>
                        <p>תאריך: {new Date(shift.date).toLocaleDateString()}</p>
                        <p>שעה: {shift.startTime} - {shift.endTime}</p>
                        <p>בית חולים: {shift.hospital}</p>
                        <p>מחלקה: {shift.department}</p>
                    </div>
                ))
            ) : (
                <p>אין לך משמרות כרגע.</p>
            )}

        </div>
    );
}

export default Shifts;
