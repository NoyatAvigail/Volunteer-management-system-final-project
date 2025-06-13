import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';
import { userService } from '../../services/usersServices';

function ContactAddPatient() {
    const { currentUser } = useContext(CurrentUser);
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        patientId: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!currentUser) return <div>User not logged in</div>;

    return (
        <div>
            <h2>Contact Add Patient</h2>
            <p>The contact add patient will appear here.</p>
        </div>
    );
}

export default ContactAddPatient;