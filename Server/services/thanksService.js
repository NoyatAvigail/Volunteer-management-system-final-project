// import thankYousDal from '../dal/thankYousDal.js';
// const thankYousService = {
//     addThankYou: async (contactId, message) => {
//         if (!contactId || !message) throw new Error('Missing fields');
//         return await thankYousDal.createThankYou({ contactId, message });
//     },
// }
// export default thankYousService;
import { thanksDal } from '../dal/thanksDal.js';

export const thanksService = {
  createNote: async (contactId, data) => {
    console.log("הגיע לסרביס");
    
    return await thanksDal.createNote({
      contactId,
      fromName: data.fromName,
      message: data.message,
    });
  },

  getAllNotes: async () => {
    return await thanksDal.getAllNotes();
  },
   getNotesByFromId: async (contactId) => {
    return await thanksDal.getNotesByFromId(contactId);
  },

  updateNote: async (id, data) => {
    
    return await thanksDal.updateNote(id, data);
  },

  softDeleteNote: async (id) => {
    return await thanksDal.softDeleteNote(id);
  },
};
