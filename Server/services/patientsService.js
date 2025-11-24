import genericDAL from "../dal/genericDal.js";
import patientsDal from "../dal/patientsDal.js";
import ContactPeople from '../models/ContactPeople.js';
import genericService from '../services/genericService.js'

const patientsService = {
    getPatients: async (authenticatedId, authenticatedType) => {
        try {
            const { userTypeDesc, model } = await genericService.utils(authenticatedType);
            const contactArr = await genericDAL.findByField(model, { id: authenticatedId });
            const contact = contactArr?.[0];
            if (!contact) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            if (userTypeDesc == 'ContactPerson') {
                return await patientsDal.getPatients(contact.userId);
            }
        } catch (error) {
            console.error("Error in getPatients:", error);
            throw error;
        }
    },

    getPatientById: async (authenticatedId, patientId) => {
        try {
            return await patientsDal.getPatientById(authenticatedId, patientId);
        } catch (error) {
            console.error("Error in contactsService.getPatientById:", error);
            throw error;
        }
    },

    createPatient: async (authenticatedId, body) => {
        try {
            const contact = await genericDAL.findById(ContactPeople, authenticatedId);
            if (!contact) {
                const error = new Error("Contact person not found");
                error.status = 404;
                throw error;
            }
            const fullData = {
                ...body,
                contactPeopleId: contact.userId,
                is_deleted: false
            };
            return await patientsDal.createPatient(fullData);
        } catch (error) {
            console.error("Error in patientsService.createPatient:", error);
            throw error;
        }
    },

    updatePatient: async (patientId, authenticatedId, authenticatedType, body) => {
        try {
            const { userTypeDesc, model } = await genericService.utils(authenticatedType);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            if (userTypeDesc == 'ContactPerson') {
                return await patientsDal.updatePatient(patientId, body);
            }
        } catch (error) {
            console.error("Error in updatePatient:", error);
            throw error;
        }
    },

    deletePatient: async (patientId, authenticatedId, authenticatedType) => {
        try {
            const { userTypeDesc, model } = await genericService.utils(authenticatedType);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            if (userTypeDesc === 'ContactPeople') {
                return await patientsDal.deletePatient(patientId);
            }
        } catch (error) {
            console.error("Error in deletePatient:", error);
            throw error;
        }
    }
};

export default patientsService;