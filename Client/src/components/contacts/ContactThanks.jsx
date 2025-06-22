import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';

function ContactThanks() {
    const { currentUser } = useContext(CurrentUser);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!currentUser) return <div>User not logged in</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!message.trim()) {
            setError("Please enter a thank you message");
            return;
        }
        try {
            await userService.addNew(currentUser.id, "thanks", { contactId: currentUser.id, message });
            setSuccess("Thanks sent successfully");
            setMessage('');
        } catch (err) {
            setError(`Error sending thanks: ${err.message || err}`);
        }
    };

    return (
        <div>
            <h2>Thanks</h2>
            <p>The Thanks will appear here.</p>
        </div>
    );
}

export default ContactThanks;