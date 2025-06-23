import genericDAL from './genericDal.js';
import { Users, Volunteers, VolunteerTypes, sequelize, VolunteeringForGenders, VolunteeringForSectors, VolunteeringInDepartments, ContactPeople, Patients, Hospitalizeds } from '../../DB/index.mjs'

const patientsDal = {
    getPatients: async (contactId) => {
        return await Patients.findAll({
            where: { contactPeopleId: contactId, is_deleted: 0 },
            include: [
                { model: Hospitalizeds }
            ]
        });
    },

    updatePatient: async (patientId, data) => {
        try {
            const transaction = await sequelize.transaction();
            const patient = await Patients.findByPk(patientId, { transaction });
            if (!patient)
                throw new Error(`Patient with id ${patientId} not found`);
            await patient.update({
                fullName: data.fullName,
                dateOfBirth: data.dateOfBirth,
                sector: data.sector,
                gender: data.gender,
                address: data.address,
                dateOfDeath: data.dateOfDeath,
                interestedInReceivingNotifications: data.interestedInReceivingNotifications
            }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error("Error updating patient profile:", error);
            throw error;
        }
    },

    deletePatient: async (patientId) => {
        await Patients.update(
            { is_deleted: true, deleted_at: new Date() },
            { where: { id: patientId } }
        );
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

};

export default patientsDal;