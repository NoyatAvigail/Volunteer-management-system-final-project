import React, { useState, useContext } from 'react';
import { CurrentUser } from '.././App';
import { userService } from '../../services/usersServices';

function ContactThanks() {
    const { currentUser } = useContext(CurrentUser);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!currentUser) return <div>משתמש לא מחובר</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!message.trim()) {
            setError("אנא הזן הודעת תודה");
            return;
        }

        try {
            await userService.addNew(currentUser.id, "thanks", { contactId: currentUser.id, message });
            setSuccess("תודה נשלחה בהצלחה");
            setMessage('');
        } catch (err) {
            setError(`שגיאה בשליחת התודה: ${err.message || err}`);
        }
    };

    return (
        <div>
            <h2>אני רוצה לומר תודה</h2>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <textarea
                    rows="5"
                    cols="50"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="כתוב את הודעת התודה כאן..."
                    required
                />
                <br />
                <button type="submit">שלח תודה</button>
            </form>
        </div>
    );
}

export default ContactThanks;