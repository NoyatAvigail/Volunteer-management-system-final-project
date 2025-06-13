import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from '.././App';
import { userService } from '../../services/usersServices';

function ContactPatientInfo() {
    const { currentUser } = useContext(CurrentUser);
    const [patientInfo, setPatientInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            setError("User not logged in");
            return;
        }
        const fetchPatientInfo = async () => {
            try {
                const data = await userService.getByValue(currentUser.id, "patient-info", { contactId: currentUser.id });
                setPatientInfo(data);
            } catch (err) {
                setError(`Error loading patient information: ${err.message || err}`);
            }
        };
        fetchPatientInfo();
    }, [currentUser]);

    if (error) return <div className="error">{error}</div>;
    if (!patientInfo) return <div>Loading patient information...</div>;

    return (
        <div>
            <h2>Patient Information</h2>
            <p>The patient information will appear here.</p>
        </div>
    );
}

export default ContactPatientInfo;