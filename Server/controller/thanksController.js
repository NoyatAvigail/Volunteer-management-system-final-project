import { thanksService } from '../services/thanksService.js';

export const thanksController = {
    createNote: async (req, res) => {        
        try {
            const contactId = req.user.id?.toString();
            const noteData = {
                fromName: req.body.fromName,
                message: req.body.message,
            };
            const newNote = await thanksService.createNote(contactId, noteData);
            res.status(201).json(newNote);
        } catch (err) {
            console.error('Error creating thank you note:', err);
            res.status(500).json({ error: 'Failed to create note' });
        }
    },

    getAllNotes: async (req, res) => {
        try {
            const notes = await thanksService.getAllNotes();
            res.status(200).json(notes);
        } catch (err) {
            console.error('Error fetching thank you notes:', err);
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    },

    getNotesByFromId: async (req, res) => {
        try {
            const contactId = req.user.id?.toString();
            const notes = await thanksService.getNotesByFromId(contactId);
            res.status(200).json(notes);
        } catch (err) {
            console.error('Get notes error:', err);
            res.status(500).json({ error: 'Failed to get notes' });
        }
    },

    updateNote: async (req, res) => {
        try {            
            const id = req.params.id;
            const data = req.body;
            const updatedNote = await thanksService.updateNote(id, data);
            res.status(200).json(updatedNote);
        } catch (err) {
            console.error('Update note error:', err);
            res.status(500).json({ error: 'Failed to update note' });
        }
    },

    softDeleteNote: async (req, res) => {
        try {
            const id = req.params.id;
            await thanksService.softDeleteNote(id);
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (err) {
            console.error('Delete note error:', err);
            res.status(500).json({ error: 'Failed to delete note' });
        }
    },
};
export default thanksController;