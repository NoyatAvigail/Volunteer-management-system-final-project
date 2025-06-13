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
            setError("User not logged in");
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
                setError(`Error loading profile: ${err.message || err}`);
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
            setSuccess("Profile updated successfully");
            setCurrentUser(prev => ({ ...prev, ...formData }));
        } catch (err) {
            setError(`Error updating profile: ${err.message || err}`);
        }
    };

    if (error) return <div className="error">{error}</div>;
    if (!profileData) return <div>Loading profile...</div>;

    return (
        <div>
            <h2>Contact Profile</h2>
            <p>The contact profile will appear here.</p>
        </div>
    );
}

export default ContactProfile;