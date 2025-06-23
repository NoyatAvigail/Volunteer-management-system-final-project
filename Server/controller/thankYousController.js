// import thankYousService from '../services/thankYousService.js';
// const thankYousController={
// addThankYou: async (req, res) => {
//     try {
//         const authenticatedId = req.user.id?.toString();
//         const { message } = req.body;
//         const newThankYou = await thankYousService.addThankYou(authenticatedId, message);
//         res.status(201).json(newThankYou);
//     } catch (err) {
//         console.error('Error adding thank you:', err);
//         res.status(500).json({ error: 'Failed to add thank you' });
//     }
// },
// }
// export default { addThankYou };
import { thankYousService } from '../services/thankYousService.js';

export const thankYousController = {
    createNote: async (req, res) => {        
        try {
            const contactId = req.user.id?.toString();
            const noteData = {
                fromName: req.body.fromName,
                message: req.body.message,
            };

            const newNote = await thankYousService.createNote(contactId, noteData);
            res.status(201).json(newNote);
        } catch (err) {
            console.error('Error creating thank you note:', err);
            res.status(500).json({ error: 'Failed to create note' });
        }
    },

    getAllNotes: async (req, res) => {
        try {
            const notes = await thankYousService.getAllNotes();
            res.status(200).json(notes);
        } catch (err) {
            console.error('Error fetching thank you notes:', err);
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    },

    getNotesByFromId: async (req, res) => {
        try {
            const contactId = req.user.id?.toString();
            const notes = await thankYousService.getNotesByFromId(contactId);
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
            const updatedNote = await thankYousService.updateNote(id, data);
            res.status(200).json(updatedNote);
        } catch (err) {
            console.error('Update note error:', err);
            res.status(500).json({ error: 'Failed to update note' });
        }
    },

    softDeleteNote: async (req, res) => {
        try {
            const id = req.params.id;
            await thankYousService.softDeleteNote(id);
            res.status(200).json({ message: 'Note deleted successfully' });
        } catch (err) {
            console.error('Delete note error:', err);
            res.status(500).json({ error: 'Failed to delete note' });
        }
    },
};
export default thankYousController;