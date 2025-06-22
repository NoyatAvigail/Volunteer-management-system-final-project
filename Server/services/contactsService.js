import genericDAL from "../dal/genericDal.js";
import contactsDal from "../dal/contactsDal.js";
import ContactPeople from '../models/ContactPeople.js';

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
            // שימי לב: חיפוש לפי ID של טבלת ContactPeople (שולח מהלקוח)
            const contact = await genericDAL.findById(ContactPeople, authenticatedId);
            if (!contact) {
                const error = new Error("Contact person not found");
                error.status = 404;
                throw error;
            }

            const fullData = {
                ...body,
                // חובה: להציב כאן את userId של contactPerson, כי זה מה שמקושר לפציינט
                contactPeopleId: contact.userId,
                is_deleted: false
            };

            return await contactsDal.createPatient(fullData);
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

    getHospitalizeds: async (authenticatedId, patientId) => {
        try {
            return await contactsDal.getHospitalizeds(patientId);
        } catch (error) {
            console.error("Error in contactsService.getHospitalizeds:", error);
            throw error;
        }
    },

    createHospitalized: async (authenticatedId, body) => {
        try {
            const patientId = body.patientId;
            return await contactsDal.createHospitalized(patientId, body);
        } catch (error) {
            console.error("Error in contactsService.createHospitalized:", error);
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