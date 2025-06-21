import { Patients, Hospitalizeds, ContactPeople } from '../../DB/index.mjs';

const contactsDal = {
    getPatients: async (contactId) => {
        const contact = await ContactPeople.findOne({
            where: { id: contactId }
        });

        if (!contact) return [];

        return await Patients.findAll({
            where: {
                contactPeopleId: contact.userId,
                is_deleted: false
            },
            include: [{ model: Hospitalizeds }]
        });
    },

    createPatient: async (data) => {
        return await Patients.create(data);
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

    getHospitalizedsById: async (patientId) => {
        return await Hospitalizeds.findAll({
            where: {
                patientId: patientId, is_deleted: 0
            }
            // include: [{
            //     model: Patients,
            //     required: true,
            //     where: {
            //         id: patientId
            //     }
            // }]
        });
    },

    createHospitalizeds: async (patientId, body) => {
        return await Hospitalizeds.create({
            ...body,
            patientId
        });
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