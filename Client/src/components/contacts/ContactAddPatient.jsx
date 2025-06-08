import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';
import { apiService } from '../../../services/genericServeices';

function ContactAddPatient() {
    const { currentUser } = useContext(CurrentUser);
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        patientId: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!currentUser) return <div>משתמש לא מחובר</div>;

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await apiService.addNew(currentUser.id, "patients", { ...formData, contactId: currentUser.id });
            setSuccess("מטופל נוסף בהצלחה");
            setFormData({
                name: '',
                birthDate: '',
                patientId: '',
            });
        } catch (err) {
            setError(`שגיאה בהוספת מטופל: ${err.message || err}`);
        }
    };

    return (
        <div>
            <h2>הוספת מטופל חדש</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <label>שם המטופל:
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </label>
                <label>תאריך לידה:
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                </label>
                <label>מספר מזהה:
                    <input name="patientId" value={formData.patientId} onChange={handleChange} required />
                </label>
                <button type="submit">הוסף מטופל</button>
            </form>
        </div>
    );
}

export default ContactAddPatient;