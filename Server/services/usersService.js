import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";
import Users from '../models/Users.js';
import Passwords from '../models/Passwords.js';
import Volunteers from "../models/Volunteers.js";
import VolunteerTypes from '../models/VolunteerTypes.js';
import ContactPeople from "../models/ContactPeople.js"
import Patients from "../models/Patients.js"
import RelationToPatients from '../models/RelationToPatients.js'
import Hospitalizeds from '../models/Hospitalizeds.js';
import VolunteeringInDepartments from '../models/VolunteeringInDepartments.js';
import VolunteeringForSectors from '../models/VolunteeringForSectors.js';
import VolunteeringForGenders from '../models/VolunteeringForGenders.js';
import { cUserType } from '../common/consts.js'
import sequelize from '../../DB/connectionDB.mjs';
import genericDAL from "../dal/genericDal.js";
import _ from "lodash";
const userService = {
    signup: async (userData) => {
        const transaction = await sequelize.transaction();
        try {
            const { email, password, type, phone, id, ...rest } = userData;
            const findUser = await genericDAL.findByField(Users, { id });
            const existingUser = findUser[0];
            if (existingUser) throw new Error("Email already taken");
            let newUser = await genericDAL.createModel(Users, { email, type, phone, id }, { transaction });
            const hashed = await hashPassword(password);
            const pwd = await genericDAL.createModel(Passwords, {
                id: newUser.id,
                password: hashed
            }, { transaction });
            if (type == cUserType.VOLUNTEER) {
                const Volunteer = await genericDAL.createModel(Volunteers, {
                    userId: newUser.id,
                    fullName: rest.fullName,
                    dateOfBirth: rest.dateOfBirth,
                    gender: rest.gender,
                    sector: rest.sector,
                    address: rest.address,
                    volunteerStartDate: rest.volunteerStartDate,
                    volunteerEndDate: rest.volunteerEndDate,
                    isActive: rest.isActive,
                    flexible: rest.flexible
                }, { transaction });
                const helpTypes = rest.helpTypes.map(typeId => ({
                    id: Volunteer.id,
                    volunteerTypeId: typeId
                }));
                if (helpTypes.length)
                    await genericDAL.bulkCreateModel(VolunteerTypes, helpTypes, { transaction });
                const departments = [];
                for (const hospitalId of rest.preferredHospitals) {
                    for (const departmentId of rest.preferredDepartments) {
                        departments.push({
                            id: Volunteer.id,
                            department: departmentId,
                            hospital: hospitalId
                        });
                    }
                }
                if (departments.length)
                    await genericDAL.bulkCreateModel(VolunteeringInDepartments, departments, { transaction });
                const sectors = rest.guardSectors.map(sectorId => ({
                    id: Volunteer.id,
                    sectorId
                }));
                if (sectors.length)
                    await genericDAL.bulkCreateModel(VolunteeringForSectors, sectors, { transaction });

                const genders = rest.guardGenders.map(genderId => ({
                    id: Volunteer.id,
                    genderId
                }));
                if (genders.length)
                    await genericDAL.bulkCreateModel(VolunteeringForGenders, genders, { transaction });

                newUser = {
                    ...rest,
                    user: newUser,
                    email: userData.email,
                    type: type,
                    id: Volunteer.id,
                    autoId: userData.id
                };
            };
            if (type == cUserType.CONTACTPERSON) {
                const contact = await genericDAL.createModel(ContactPeople,
                    {
                        userId: newUser.id,
                        fullName: rest.fullName,
                        address: rest.address
                    }, { transaction });
                const patient = await genericDAL.createModel(Patients,
                    {
                        userId: rest.patientId,
                        contactPeopleId: contact.userId,
                        fullName: rest.patientFullName,
                        dateOfBirth: rest.patientDateOfBirth,
                        sector: rest.patientSector,
                        gender: rest.patientGender,
                        address: rest.patientAddress,
                        dateOfDeath: rest.patientDateOfDeath || null,
                        interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
                    }, { transaction });
                const relationToPatients = await genericDAL.createModel(RelationToPatients,
                    {
                        contactPeopleId: contact.id,
                        patientId: patient.id,
                        relationId: rest.relationId,
                    }, { transaction });
                const hospitalizeds = await genericDAL.createModel(Hospitalizeds,
                    {
                        patientId: patient.userId,
                        hospital: rest.hospital,
                        department: rest.department,
                        roomNumber: rest.roomNumber,
                        hospitalizationStart: rest.hospitalizationStart,
                        hospitalizationEnd: rest.hospitalizationEnd
                    }, { transaction });
                newUser = {
                    ...rest,
                    type: type,
                    email: userData.email,
                    id: contact.id,
                    autoId: contact.id
                };
            }
            await transaction.commit();
            return newUser;
        } catch (e) {
            await transaction.rollback();
            console.error("Signup failed:", e);
            throw e;
        }
    },

    login: async ({ email, password }) => {
        log('[POST]', { email, password });
        const findUser = await genericDAL.findByField(Users, { email });
        const user = findUser[0];
        if (!user) return null;
        const findPassword = await genericDAL.findByField(Passwords, { id: user.id });
        const passwordEntry = findPassword[0];
        if (!passwordEntry) return null;
        const valid = await isPasswordValid(password, passwordEntry.password);
        if (!valid) return null;
        const userData = user.toJSON();
        if (user.type == cUserType.VOLUNTEER) {
            const findVolunteer = await genericDAL.findByField(Volunteers, { userId: user.id });
            const volunteer = findVolunteer[0];
            if (!volunteer) return null;
            userData.email = user.email;
            userData.fullName = volunteer.fullName;
            userData.autoId = volunteer.id;
        } else if (user.type == cUserType.CONTACTPERSON) {
            const findContact = await genericDAL.findByField(ContactPeople, { userId: user.id });
            const contact = findContact[0];
            if (!contact) return null;
            userData.fullName = contact.fullName;
            userData.autoId = contact.id;
        }
        return {
            user: userData,
            autoId: userData.id,
        };
    },
};

export default userService;