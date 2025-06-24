import React, { useState, useEffect } from 'react';
import { thanksService } from '../../services/thanksService';
import Add from '../Add';
import Update from '../Update';
import Delete from '../Delete';
import '../../style/Thanks.css';

const colors = ['#ffbd59', '#5fa79b', '#e06eb2', '#f15a3c'];

function ContactThanks() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fetchNotes = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await thanksService.getNotesByFromId();
            const notesWithColor = data.map(note => ({
                ...note,
                color: colors[Math.floor(Math.random() * colors.length)]
            }));
            setNotes(notesWithColor);
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
        <div className="thank-you-container">
            <h2 className="thank-you-header">Your thanks notes</h2>
            <Add
                type="Thanks"
                onSuccess={fetchNotes}
                inputs={["fromName", "message"]}
                defaultValue={{ fromName: "", message: "" }}
                name="Add a thanks note"
            />
            <div className="notes-grid">
                {notes.map(note => (
                    <div className="note-card" key={note.id} style={{ backgroundColor: note.color }}>
                        <div className="note-message">{note.message}</div>
                        <div className="note-actions">
                            <Update
                                type="Thanks"
                                itemId={note.id}
                                onSuccess={fetchNotes}
                                inputs={["message"]}
                                defaultValue={{ message: note.message }}
                            />
                            <Delete
                                type="Thanks"
                                itemId={note.id}
                                setIsChange={fetchNotes}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ContactThanks;