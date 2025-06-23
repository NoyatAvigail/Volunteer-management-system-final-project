import React, { useState, useEffect } from 'react';
import { thankYousService } from '../../services/thankYousService';
import Add from '../Add';
import Update from '../Update';
import Delete from '../Delete';

function ThankYouManager() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchNotes = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await thankYousService.getNotesByFromId();
            setNotes(data);
        } catch (e) {
            setError('Failed to fetch notes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div>
            <h2>Your Thank You Notes</h2>
            <>
                <Add
                    type="ThankYous"
                    onSuccess={() => fetchNotes()}
                    inputs={["message"]}
                    defaultValue={{ message: "" }}
                    name="Add Thank You"
                />
                <ul>
                    {notes.map(note => (
                        <li key={note.id}>
                            <p>{note.message}</p>

                            <Update
                                type="ThankYous"
                                itemId={note.id}
                                onSuccess={() => fetchNotes()}
                                inputs={["message"]}
                                defaultValue={{ message: note.message }}
                            />

                            <Delete
                                type="ThankYous"
                                itemId={note.id}
                                setIsChange={fetchNotes}

                            />
                        </li>
                    ))}
                </ul>
            </>
            {/* )} */}
        </div>
    );
}

export default ThankYouManager;
