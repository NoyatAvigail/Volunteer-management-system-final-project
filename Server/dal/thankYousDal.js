// import { ThankYous } from '../models/ThankYous.js';
// const thankYousDal={
// createThankYou :async ({ contactId, message }) => {
//   return await ThankYous.create({ contactId, message });
// },
// }
// export default { createThankYou };
import { ThankYous } from '../../DB/index.mjs';

export const thankYousDal = {
    createNote: async (noteData) => {
        console.log("הגיע לדאל");
        
        return await ThankYous.create(noteData);
    },

    getAllNotes: async () => {
        return await ThankYous.findAll({
            where: { is_deleted: false },
            order: [['createdAt', 'DESC']],
        });
    },
    getNotesByFromId: async (contactId) => {
        return await ThankYous.findAll({
            where: { contactId, is_deleted: false },
            order: [['createdAt', 'DESC']],
        });
    },

    updateNote: async (id, data) => {
        const note = await ThankYous.findByPk(id);
        if (!note || note.is_deleted) throw new Error('Note not found');
        return await note.update(data);
    },

    softDeleteNote: async (id) => {
        const note = await ThankYous.findByPk(id);
        if (!note || note.is_deleted) throw new Error('Note not found');
        return await note.update({ is_deleted: true, deleted_at: new Date() });
    },
};
