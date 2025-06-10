import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from '.././App';
import { userService } from '../../services/usersServices';

function ContactPatientInfo() {
    const { currentUser } = useContext(CurrentUser);
    const [patientInfo, setPatientInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            setError("משתמש לא מחובר");
            return;
        }
        const fetchPatientInfo = async () => {
            try {
                const data = await userService.getByValue(currentUser.id, "patient-info", { contactId: currentUser.id });
                setPatientInfo(data);
            } catch (err) {
                setError(`שגיאה בטעינת מידע על המטופל: ${err.message || err}`);
            }
        };
        fetchPatientInfo();
    }, [currentUser]);

    if (error) return <div className="error">{error}</div>;
    if (!patientInfo) return <div>טוען מידע על המטופל...</div>;

    return (
        <div>
            <h2>מידע על המטופל</h2>
            <p>שם המטופל: {patientInfo.name}</p>
            <p>תאריך לידה: {patientInfo.birthDate}</p>
            <p>מספר מזהה: {patientInfo.patientId}</p>
        </div>
    );
}

export default ContactPatientInfo;