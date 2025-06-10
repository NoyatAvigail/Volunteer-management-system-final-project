import React, { useState, useEffect, useContext } from 'react';
import { CurrentUser } from '.././App';
import { userService } from '../../services/usersServices';

function ContactProfile() {
    const { currentUser, setCurrentUser } = useContext(CurrentUser);
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            setError("משתמש לא מחובר");
            return;
        }
        const fetchProfile = async () => {
            try {
                const data = await userService.getByValue(currentUser.id, "contacts", { id: currentUser.id });
                setProfileData(data);
                setFormData({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (err) {
                setError(`שגיאה בטעינת פרופיל: ${err.message || err}`);
            }
        };
        fetchProfile();
    }, [currentUser]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await userService.update(currentUser.id, "contacts", currentUser.id, formData);
            setSuccess("הפרופיל עודכן בהצלחה");
            setCurrentUser(prev => ({ ...prev, ...formData }));
        } catch (err) {
            setError(`שגיאה בעדכון פרופיל: ${err.message || err}`);
        }
    };

    if (error) return <div className="error">{error}</div>;
    if (!profileData) return <div>טוען פרופיל...</div>;

    return (
        <div>
            <h2>ניהול פרופיל</h2>
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <label>שם מלא:
                    <input name="fullName" value={formData.fullName} onChange={handleChange} required />
                </label>
                <label>אימייל:
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </label>
                <label>טלפון:
                    <input name="phone" value={formData.phone} onChange={handleChange} />
                </label>
                <button type="submit">עדכן פרופיל</button>
            </form>
        </div>
    );
}

export default ContactProfile;