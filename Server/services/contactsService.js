import genericDAL from "../dal/genericDal.js";
import contactsDal from "../dal/contactsDal.js";

const contactsService = {
    getThanks: async (authenticatedId) => {
        try {
            return await contactsDal.getThanks(authenticatedId);
        } catch (error) {
            console.error("Error in contactsService.getThanks:", error);
            throw error;
        }
    },

    createThanks: async (authenticatedId, body) => {
        try {
            return await contactsDal.createThanks(authenticatedId, data);
        } catch (error) {
            console.error("Error in contactsService.createThanks:", error);
            throw error;
        }
    }
};

export default contactsService;