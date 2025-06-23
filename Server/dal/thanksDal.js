// import { ThankYous } from '../models/ThankYous.js';
// const thankYousDal={
// createThankYou :async ({ contactId, message }) => {
//   return await ThankYous.create({ contactId, message });
// },
// }
// export default { createThankYou };
import { Thanks } from '../../DB/index.mjs';

export const thanksDal = {
    createNote: async (noteData) => {
        console.log("הגיע לדאל");
        
        return await Thanks.create(noteData);
    },

    getAllNotes: async () => {
        return await Thanks.findAll({
            where: { is_deleted: false },
            order: [['createdAt', 'DESC']],
        });
    },
    getNotesByFromId: async (contactId) => {
        return await Thanks.findAll({
            where: { contactId, is_deleted: false },
            order: [['createdAt', 'DESC']],
        });
    },

    updateNote: async (id, data) => {
        const note = await Thanks.findByPk(id);
        if (!note || note.is_deleted) throw new Error('Note not found');
        return await note.update(data);
    },

    softDeleteNote: async (id) => {
        const note = await Thanks.findByPk(id);
        if (!note || note.is_deleted) throw new Error('Note not found');
        return await note.update({ is_deleted: true, deleted_at: new Date() });
    },
};
