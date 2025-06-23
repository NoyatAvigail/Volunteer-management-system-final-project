import { thanksDal } from '../dal/thanksDal.js';

export const thanksService = {
  createNote: async (contactId, data) => {
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
