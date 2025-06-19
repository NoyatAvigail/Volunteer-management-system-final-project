import { Patients, Hospitalizeds } from '../../DB/index.mjs';

const contactsDal = {
    getPatients: async (contactId) => {
        return await Patients.findAll({
            where: { contactPeopleId: contactId, is_deleted: false },
            include: [{ model: Hospitalizeds }]
        });
    },

    createPatient: async (contactId, data) => {
        return await Patients.create({
            ...data,
            contactPeopleId: contactId,
            is_deleted: false
        });
    },

    getPatientById: async (contactId, patientId) => {
        const patient = await Patients.findOne({
            where: {
                id: patientId,
                contactPeopleId: contactId,
                is_deleted: false
            },
            include: [{ model: Hospitalizeds }]
        });
        if (!patient) {
            const error = new Error("Patient not found or unauthorized access");
            error.status = 403;
            throw error;
        }
        return patient;
    },

    updatePatient: async (contactId, patientId, data) => {
        const patient = await Patients.findOne({
            where: {
                id: patientId,
                contactPeopleId: contactId,
                is_deleted: false
            }
        });
        if (!patient) {
            const error = new Error("Patient not found or unauthorized access");
            error.status = 403;
            throw error;
        }
        await patient.update(data);
        return patient;
    },

    deletePatient: async (contactId, patientId) => {
        const patient = await Patients.findOne({
            where: {
                id: patientId,
                contactPeopleId: contactId,
                is_deleted: false
            }
        });
        if (!patient) {
            const error = new Error("Patient not found or unauthorized access");
            error.status = 403;
            throw error;
        }
        await patient.update({
            is_deleted: true,
            deleted_at: new Date()
        });

        return patient;
    },

    getThanks: async (userId) => {
        return await Thanks.findAll({
            where: {
                contactPeopleId: userId,
                is_deleted: false
            }
        });
    },

    createThanks: async (userId, data) => {
        return await Thanks.create({
            ...data,
            contactPeopleId: userId,
            is_deleted: false
        });
    }
};

export default contactsDal;