import React, { useState, useEffect } from 'react';
import { thanksService } from '../../services/thanksService';
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
            const data = await thanksService.getNotesByFromId();
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
            <h2>Your Thanks Notes</h2>
            <>
                <Add
                    type="Thanks"
                    onSuccess={() => fetchNotes()}
                    inputs={["fromName", "message"]}
                    defaultValue={{ fromName: "", message: "" }}
                    name="Add Thank You"
                />
                <ul>
                    {notes.map(note => (
                        <li key={note.id}>
                            <p>{note.message}</p>
                            <Update
                                type="Thanks"
                                itemId={note.id}
                                onSuccess={() => fetchNotes()}
                                inputs={["message"]}
                                defaultValue={{ message: note.message }}
                            />
                            <Delete
                                type="Thanks"
                                itemId={note.id}
                                setIsChange={(result) => {
                                    console.log("Delete successful:", result); 
                                    fetchNotes();
                                }}

                            />
                        </li>
                    ))}
                </ul>
            </>
        </div>
    );
}

export default ThankYouManager;
