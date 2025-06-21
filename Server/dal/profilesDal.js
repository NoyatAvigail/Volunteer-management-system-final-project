import genericDAL from './genericDal.js';
import { Users, Volunteers, VolunteerTypes, sequelize, VolunteeringForGenders, VolunteeringForSectors, VolunteeringInDepartments, ContactPeople, Patients, Hospitalizeds } from '../../DB/index.mjs'

const profilesDAL = {
    getVolunteerProfile: async (userId) => {
        
        return Volunteers.findOne({
            where: { userId, is_deleted: 0 },
            include: [
                { model: Users },
                { model: VolunteerTypes },
                { model: VolunteeringInDepartments },
                { model: VolunteeringForSectors },
                { model: VolunteeringForGenders }
            ]
        });
    },

    getContactProfile: async (userId) => {
        return ContactPeople.findOne({
            where: { userId, is_deleted: 0 },
            include: [
                { model: Users }
            ]
        });
    },

    updateVolunteerProfile: async (userId, data) => {
        const transaction = await sequelize.transaction();
        try {
            const volunteer = await Volunteers.findOne({ where: { userId }, transaction });
            const user = await Users.findByPk(userId, { transaction });
            if (!volunteer || !user)
                throw new Error(`Volunteer or user with userId ${userId} not found`);
            await user.update({
                email: data.email,
                phone: data.phone,
                type: data.type
            }, { transaction });
            await volunteer.update({
                fullName: data.fullName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                sector: data.sector,
                address: data.address,
                volunteerStartDate: data.volunteerStartDate,
                volunteerEndDate: data.volunteerEndDate,
                isActive: data.isActive,
                flexible: data.flexible
            }, { transaction });
            const volunteerId = volunteer.id;
            await Promise.all([
                genericDAL.deleteByField(VolunteerTypes, volunteerId, transaction),
                genericDAL.deleteByField(VolunteeringForGenders, volunteerId, transaction),
                genericDAL.deleteByField(VolunteeringForSectors, volunteerId, transaction),
                genericDAL.deleteByField(VolunteeringInDepartments, volunteerId, transaction)
            ]);
            const helpTypes = data.helpTypes.map(typeId => ({
                id: volunteerId,
                volunteerTypeId: typeId
            }));
            const departments = data.preferredHospitals.flatMap(hospitalId =>
                data.preferredDepartments.map(departmentId => ({
                    id: volunteerId,
                    hospital: hospitalId,
                    department: departmentId
                }))
            );
            const sectors = data.guardSectors.map(sectorId => ({
                id: volunteerId,
                sectorId
            }));
            const genders = data.guardGenders.map(genderId => ({
                id: volunteerId,
                genderId
            }));
            await Promise.all([
                helpTypes.length && genericDAL.bulkCreateModel(VolunteerTypes, helpTypes, transaction),
                departments.length && genericDAL.bulkCreateModel(VolunteeringInDepartments, departments, transaction),
                sectors.length && genericDAL.bulkCreateModel(VolunteeringForSectors, sectors, transaction),
                genders.length && genericDAL.bulkCreateModel(VolunteeringForGenders, genders, transaction)
            ]);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error("Error updating volunteer profile:", error);
            throw error;
        }
    },

    updateContactProfile: async (userId, data) => {
        const transaction = await sequelize.transaction();
        try {
            const contact = await ContactPeople.findOne({ where: { userId }, transaction });
            const user = await Users.findByPk(userId, { transaction });
            if (!contact || !user)
                throw new Error(`Contact person or user with userId ${userId} not found`);
            await user.update({
                email: data.email,
                phone: data.phone,
                type: data.type
            }, { transaction });
            await contact.update({
                fullName: data.fullName,
                address: data.address
            }, { transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error("Error updating contact profile:", error);
            throw error;
        }
    },

    getPatients: async (contactId) => {

        return await Patients.findAll({
            where: { contactPeopleId: contactId, is_deleted: 0 },
            //לבדוק את זה
            include: [
                { model: Hospitalizeds }
            ]
        });
    },

    updatePatientProfile: async (patientId, data) => {
        try {
            console.log("data:", data);
            console.log("patientId:",patientId);
            
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
    }
};

export default profilesDAL;