import genericDAL from "../dal/genericDal.js";
import contactsDal from "../dal/contactsDal.js";

const contactsService = {
    getPatients: async (authenticatedId) => {
        try {
            return await contactsDal.getPatients(authenticatedId);
        } catch (error) {
            console.error("Error in contactsService.getPatients:", error);
            throw error;
        }
    },

    createPatient: async (authenticatedId, body) => {
        try {
            return await contactsDal.createPatient(authenticatedId, body);
        } catch (error) {
            console.error("Error in contactsService.createPatient:", error);
            throw error;
        }
    },

    getPatientById: async (authenticatedId, patientId) => {
        try {
            return await contactsDal.getPatientById(authenticatedId, patientId);
        } catch (error) {
            console.error("Error in contactsService.getPatientById:", error);
            throw error;
        }
    },

    updatePatient: async (authenticatedId, patientId, body) => {
        try {
            return await contactsDal.updatePatient(authenticatedId, patientId, body);
        } catch (error) {
            console.error("Error in contactsService.updatePatient:", error);
            throw error;
        }
    },

    deletePatient: async (authenticatedId, patientId) => {
        try {
            return await contactsDal.deletePatient(authenticatedId, patientId);
        } catch (error) {
            console.error("Error in contactsService.deletePatient:", error);
            throw error;
        }
    },

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