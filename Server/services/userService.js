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
            const findUser = await genericDAL.findByField(Users, { email });
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
                    type: type,
                    id: Volunteer.id,
                    autoId: userData.id
                };
            }

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
            autoId: userData.id
        };
    },

    getModel: (table) => {
        return genericDAL.getModelByName(table);
    },

    getAll: async (table) => {
        log('[GET ALL]', { table });
        const model = genericDAL.getModelByName((table));
        const data = genericDAL.findAll(model);

        return data;
    },

    getItem: async (table, query) => {
        log('[GET ALL]', { table, query });
        const model = genericDAL.getModelByName((table));
        return genericDAL.findByField(model, query);
    },
    create: async (table, data) => {
        log('[POST]', { table, data });
        const model = genericDAL.getModelByName((table));
        return genericDAL.createModel(model, data);
    },

    // getRequests: async (table1, targetField, table2, foreignKey, targetKey, targetValue) => {
    //     const matchingRecordsTbl1 = await genericDAL.findByField(
    //         genericDAL.getModelByName(table1),
    //         { [targetKey]: targetValue }
    //     );
    //     const parentIds = matchingRecordsTbl1.map(item => item[targetField]);
    //     const matchingRecordsTbl2 = await genericDAL.findByFieldIn(
    //         genericDAL.getModelByName(table2),
    //         foreignKey,
    //         parentIds
    //     );
    //     const req = userService.joinTables({
    //         parents: matchingRecordsTbl1,
    //         children: matchingRecordsTbl2,
    //         parentKey: targetField,
    //         childKey: foreignKey,
    //         parentPrefix: ""
    //     });
    //     const distinctPatientIds = [...new Set(req.map(item => item.patientId))];
    //     const patients = await genericDAL.findByFieldIn(
    //         genericDAL.getModelByName("Patients"),
    //         "userId",
    //         distinctPatientIds
    //     );
    //     const req2 = userService.joinTables({
    //         parents: req,
    //         children: patients,
    //         parentKey: "patientId",
    //         childKey: "userId",
    //         parentPrefix: ""
    //     });
    //     return req2;
    // },

    joinTables({ parents, children, parentKey, childKey, parentPrefix = "parent" }) {
        return _.flatMap(parents, parent => {
            const parentData = parent.dataValues ?? parent;
            const matches = children.filter(child => {
                const childData = child.dataValues ?? child;
                return childData[childKey] === parentData[parentKey];
            });
            return matches.map(child => ({
                ..._.mapKeys(parentData, (v, k) => `${k}`),
                ...(child.dataValues ?? child)
            }));
        });
    },

    create: async (table, data) => {
        log('[POST]', { table, data });
        const model = genericDAL.getModelByName((table));
        return genericDAL.createModel(model, data);
    },

    update: async (table, id, body) => {
        log('[UPDATE]', { table, id, body });
        const model = genericDAL.getModelByName((table));
        return genericDAL.updateFields(model, id, body);
    },

    patch: async (table, id, body) => {
        const model = genericDAL.getModelByName(table);
        return genericDAL.updateByField(model, id, body);
    },

    softDeleteItem: async (table, id) => {
        log('[DELETE]', { table, id });
        const model = genericDAL.getModelByName((table));
        return genericDAL.update(model, id, {
            is_deleted: 1,
            deleted_at: new Date()
        });
    },

    cleanup: () => {
        setInterval(() => {
            genericDAL.cleanupOldDeleted();
        }, 14 * 24 * 60 * 60 * 1000);
    },

    getProfile: async (userId) => {
        const Users = genericDAL.getModelByName("Users");
        const user = await genericDAL.findById(Users, userId);
        if (!user) throw new Error('User not found');
        if (user.type == 1) {
            return await userService.getVolunteerProfile(user, user.id);
        } else if (user.type == 2) {
            return await userService.getContactProfile(user, user.id);
        } else {
            throw new Error('Unsupported user type');
        }
    },

    getVolunteerProfile: async (user, userId) => {
        try {
            const Volunteers = genericDAL.getModelByName("Volunteers");
            const volunteerArr = await genericDAL.findByField(Volunteers, { userId });
            if (!volunteerArr || volunteerArr.length === 0) throw new Error("Volunteer not found");
            const volunteer = volunteerArr[0];
            const VolunteerTypes = genericDAL.getModelByName("VolunteerTypes");
            const VolunteeringInDepartments = genericDAL.getModelByName("VolunteeringInDepartments");
            const VolunteeringForSectors = genericDAL.getModelByName("VolunteeringForSectors");
            const VolunteeringForGenders = genericDAL.getModelByName("VolunteeringForGenders");
            const [types, departments, sectors, genders] = await Promise.all([
                genericDAL.findByField(VolunteerTypes, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringInDepartments, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringForSectors, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringForGenders, { id: volunteer.id })
            ]);

            return {
                ...volunteer.toJSON(),
                user: user,
                VolunteerTypes: types.map(t => t.toJSON()),
                VolunteersDepartments: departments.map(d => d.toJSON()),
                VolunteeringForSectors: sectors.map(s => s.toJSON()),
                VolunteeringForGenders: genders.map(g => g.toJSON())
            };
        } catch (e) {
            console.error("getVolunteerProfile error:", e);
            throw e;
        }
    },

    getContactProfile: async (user, userId) => {
        try {
            const ContactPeople = genericDAL.getModelByName("ContactPeople");
            const contactArr = await genericDAL.findByField(ContactPeople, { userId });
            if (!contactArr || contactArr.length === 0) {
                throw new Error("Contact person not found");
            }
            const contact = contactArr[0];
            return {
                ...contact.toJSON(),
                user: user,
            };
        } catch (e) {
            console.error("getContactProfile error:", e);
            throw e;
        }
    },

    updateProfile: async (userId, type, newData) => {
        const Users = genericDAL.getModelByName("Users");
        const user = await genericDAL.findById(Users, userId);
        if (!user) throw new Error('User not found');
        if (type == "Volunteer") {
            return await userService.updateVolunteerProfile(user, newData);
        }
        if (type == "ContactPerson") {
            return await userService.updateContactProfile(user, newData);
        }
        if (type == "patient") {
            return await userService.updatePatientProfile(user, newData);
        }
        throw new Error('No profile found to update');
    },

    updateVolunteerProfile: async (user, data) => {
        const Volunteer = await genericDAL.updateFields(
            Volunteers,
            { userId: user.id },
            {
                fullName: data.fullName,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                sector: data.sector,
                address: data.address,
                volunteerStartDate: data.volunteerStartDate,
                volunteerEndDate: data.volunteerEndDate,
                isActive: data.isActive,
                flexible: data.flexible
            }
        );
        if (!Volunteer) throw new Error("Volunteer not found for update");
        const volunteerId = Volunteer.id;
        const volunteerIdField = 'volunteerId';
        await genericDAL.deleteByFieldValue('VolunteerTypes', 'id', volunteerId);
        const helpTypes = data.helpTypes.map(typeId => ({
            id: Volunteer.id,
            volunteerTypeId: typeId,
        }));
        if (helpTypes.length)
            await genericDAL.bulkCreateModel(VolunteerTypes, helpTypes);

        await genericDAL.deleteByFieldValue('VolunteeringInDepartments', 'id', volunteerId);
        const departments = [];
        for (const hospitalId of data.preferredHospitals) {
            for (const departmentId of data.preferredDepartments) {
                departments.push({
                    volunteerId: volunteerId,
                    department: departmentId,
                    hospital: hospitalId
                });
            }
        }
        if (departments.length)
            await genericDAL.bulkCreateModel(VolunteeringInDepartments, departments);

        await genericDAL.deleteByFieldValue('VolunteeringForSectors', 'id', volunteerId);
        const sectors = data.guardSectors.map(sectorId => ({
            volunteerId: volunteerId,
            sectorId
        }));
        if (sectors.length)
            await genericDAL.bulkCreateModel(VolunteeringForSectors, sectors);
        await genericDAL.deleteByFieldValue('VolunteeringForGenders', 'id', volunteerId);
        const genders = data.guardGenders.map(genderId => ({
            volunteerId: Volunteer.id,
            genderId
        }));
        if (genders.length)
            await genericDAL.bulkCreateModel(VolunteeringForGenders, genders);
        return { success: true };
    },

    updateContactProfile: async (user, data) => {
        const ContactPeople = genericDAL.getModelByName("ContactPeople");
        const contactArr = await genericDAL.findByField(ContactPeople, { userId: user.id });
        console.log("user id:", user.id);
        console.log("contactArr:", contactArr);
        if (!contactArr || contactArr.length === 0) throw new Error("Contact person not found");
        const contact = contactArr[0];
        await genericDAL.updateFields(ContactPeople, { userId: user.id }, {
            fullName: data.fullName,
            phone: data.phone,
            birthDate: data.birthDate,
            address: data.address,
            identity: data.identity,
            email: data.email,
            status: data.status,
            notes: data.notes
        });
        return { success: true };
    },

    updatePatientProfile: async (user, data) => {
        const Patients = genericDAL.getModelByName("Patients");
        const ContactPeople = genericDAL.getModelByName("ContactPeople");
        const contactArr = await genericDAL.findByField(ContactPeople, { user });
        const patientArr = await genericDAL.findByField(Patients, { contactPeopleId: contactArr.id });
        if (!patientArr || patientArr.length === 0) throw new Error("Patient not found");
        const patient = patientArr[0];
        await genericDAL.updateFields(Patients, { contactPeopleId: contactArr.id },
            {
                fullName: data.patientFullName,
                dateOfBirth: data.patientDateOfBirth,
                sector: data.patientSector,
                gender: data.patientGender,
                address: data.patientAddress,
                dateOfDeath: data.patientDateOfDeath || null,
                interestedInReceivingNotifications: data.patientInterestedInReceivingNotifications ?? true
            });
        await genericDAL.updateFields(RelationToPatients, { contactPeopleId: contactArr.id },
            {
                contactPeopleId: contact.id,
                patientId: patient.id,
                relationId: data.relationId,
            });
        await genericDAL.updateFields(Hospitalizeds, { patientId: patient.id },
            {
                hospital: data.hospital,
                department: data.department,
                roomNumber: data.roomNumber,
                hospitalizationStart: data.hospitalizationStart,
                hospitalizationEnd: data.hospitalizationEnd
            });
        return { success: true };
    },
};

export default userService;