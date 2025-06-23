// import thankYousDal from '../dal/thankYousDal.js';
// const thankYousService = {
//     addThankYou: async (contactId, message) => {
//         if (!contactId || !message) throw new Error('Missing fields');
//         return await thankYousDal.createThankYou({ contactId, message });
//     },
// }
// export default thankYousService;
import { thankYousDal } from '../dal/thankYousDal.js';

export const thankYousService = {
  createNote: async (contactId, data) => {
    console.log("הגיע לסרביס");
    
    return await thankYousDal.createNote({
      contactId,
      fromName: data.fromName,
      message: data.message,
    });
  },

  getAllNotes: async () => {
    return await thankYousDal.getAllNotes();
  },
   getNotesByFromId: async (contactId) => {
    return await thankYousDal.getNotesByFromId(contactId);
  },

  updateNote: async (id, data) => {
    
    return await thankYousDal.updateNote(id, data);
  },

  softDeleteNote: async (id) => {
    return await thankYousDal.softDeleteNote(id);
  },
};
