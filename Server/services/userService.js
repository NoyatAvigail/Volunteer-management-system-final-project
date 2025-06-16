import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";
import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import VolunteerTypes from '../Models/VolunteerTypes.js';
import ContactPeople from "../Models/ContactPeople.js"
import Patients from "../Models/Patients.js"
import RelationToPatients from '../Models/RelationToPatients.js'
import Hospitalizeds from '../Models/Hospitalizeds.js';
// import { ContactPeople, Patients, RelationToPatients, Hospitalizeds, } from '../Models/Index.js'
import VolunteeringInDepartments from '../Models/VolunteeringInDepartments.js';
import VolunteeringForSectors from '../Models/VolunteeringForSectors.js';
import VolunteeringForGenders from '../Models/VolunteeringForGenders.js';
import { cUserType } from '../common/consts.js'
import sequelize from '../../DB/connectionDB.mjs';
import genericDAL from "../dal/genericDal.js";

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
        const model = userDal.getModelByName((table));
        return userDal.createModel(model, data);
    },

    getProfile: async (userId) => {
        const Users = genericDAL.getModelByName("Users");
        const user = await genericDAL.findById(Users, userId);
        if (!user) throw new Error('User not found');

        if (user.type == 1) {
            return await userService.getVolunteerProfile(user, user.id);
        } else if (user.type == 2) {
            return await userService.getContactProfile(user.id);
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

    getContactProfile: async (userId) => {
        try {
            const contact = await genericDAL.findOneWithIncludes("ContactPeople", { userId }, [
                {
                    model: genericDAL.getModelByName("Patients"),
                    as: 'patients',
                    include: [
                        { model: genericDAL.getModelByName("RelationToPatients"), as: 'relation' },
                        { model: genericDAL.getModelByName("Hospitalizeds"), as: 'hospitalizeds' }
                    ]
                }
            ]);
            if (!contact) throw new Error("Contact person not found");
            return contact;
        } catch (e) {
            console.error("getContactProfile error:", e);
            throw e;
        }
    },
    updateVolunteerProfile: async (userId, data) => {
        try {
            const Volunteers = genericDAL.getModelByName("Volunteers");
            const volunteerArr = await genericDAL.findByField(Volunteers, { userId });
            if (!volunteerArr || volunteerArr.length === 0) throw new Error("Volunteer not found");

            const volunteer = volunteerArr[0];
            console.log(" volunteer id:", volunteer.id);

            await genericDAL.updateFields(Volunteers, volunteer.id, data);

            const VolunteerTypes = genericDAL.getModelByName("VolunteerTypes");
            const VolunteeringInDepartments = genericDAL.getModelByName("VolunteeringInDepartments");
            const VolunteeringForSectors = genericDAL.getModelByName("VolunteeringForSectors");
            const VolunteeringForGenders = genericDAL.getModelByName("VolunteeringForGenders");

            await VolunteerTypes.destroy({ where: { id: volunteer.id } });
            for (const vt of data.VolunteerTypes || []) {
                await genericDAL.create(VolunteerTypes, {
                    id: volunteer.id,
                    volunteerTypeId: vt.volunteerTypeId
                });
            }

            await VolunteeringInDepartments.destroy({ where: { id: volunteer.id } });
            for (const dep of data.VolunteersDepartments || []) {
                await genericDAL.create(VolunteeringInDepartments, {
                    id: volunteer.id,
                    hospital: dep.hospital,
                    department: dep.department
                });
            }

            await VolunteeringForSectors.destroy({ where: { id: volunteer.id } });
            for (const sec of data.VolunteeringForSectors || []) {
                await genericDAL.create(VolunteeringForSectors, {
                    id: volunteer.id,
                    sectorId: sec.sectorId
                });
            }

            await VolunteeringForGenders.destroy({ where: { id: volunteer.id } });
            for (const gen of data.VolunteeringForGenders || []) {
                await genericDAL.create(VolunteeringForGenders, {
                    id: volunteer.id,
                    genderId: gen.genderId
                });
            }

            const [types, departments, sectors, genders] = await Promise.all([
                genericDAL.findByField(VolunteerTypes, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringInDepartments, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringForSectors, { id: volunteer.id }),
                genericDAL.findByField(VolunteeringForGenders, { id: volunteer.id }),
            ]);

            return {
                ...volunteer.toJSON(),
                VolunteerTypes: types.map(t => t.toJSON()),
                VolunteersDepartments: departments.map(d => d.toJSON()),
                VolunteeringForSectors: sectors.map(s => s.toJSON()),
                VolunteeringForGenders: genders.map(g => g.toJSON()),
            };
        } catch (error) {
            console.error(" error- updateVolunteerProfile:", error);
            throw error;
        }
    },


    updateContactProfile: async (userId, data) => {
        const contact = await genericDAL.findOneWithIncludes("ContactPeople", { userId }, []);
        if (!contact) throw new Error("Contact person not found");

        await genericDAL.updateFields("ContactPeople", contact.id, {
            fullName: data.fullName,
            address: data.address
        });

        const patientData = data.patients?.[0];
        if (!patientData) throw new Error("Missing patient data");

        let patient = await genericDAL.findById("Patients", patientData.id);
        if (patient) {
            await genericDAL.updateFields("Patients", patient.id, {
                fullName: patientData.fullName,
                dateOfBirth: patientData.dateOfBirth,
                sector: patientData.sector,
                gender: patientData.gender,
                address: patientData.address,
                dateOfDeath: patientData.dateOfDeath || null,
                interestedInReceivingNotifications: patientData.interestedInReceivingNotifications ?? true
            });
        } else {
            patient = await genericDAL.create("Patients", {
                ...patientData,
                contactPeopleId: contact.id
            });
        }

        await genericDAL.deleteWhere("RelationToPatients", {
            contactPeopleId: contact.id,
            patientId: patient.id
        });

        if (patientData.relation?.[0]) {
            await genericDAL.create("RelationToPatients", {
                contactPeopleId: contact.id,
                patientId: patient.id,
                relationId: patientData.relation[0].relationId
            });
        }

        await genericDAL.deleteWhere("Hospitalizeds", { patientId: patient.id });

        if (patientData.hospitalizeds?.[0]) {
            const h = patientData.hospitalizeds[0];
            await genericDAL.create("Hospitalizeds", {
                patientId: patient.id,
                hospital: h.hospital,
                department: h.department,
                roomNumber: h.roomNumber,
                hospitalizationStart: h.hospitalizationStart,
                hospitalizationEnd: h.hospitalizationEnd
            });
        }

        return await genericDAL.findOneWithIncludes("ContactPeople", { userId }, [
            { model: genericDAL.getModelByName("Users") },
            {
                model: genericDAL.getModelByName("Patients"),
                as: 'patients',
                include: [
                    { model: genericDAL.getModelByName("RelationToPatients"), as: 'relation' },
                    { model: genericDAL.getModelByName("Hospitalizeds"), as: 'hospitalizeds' }
                ]
            }
        ]);
    },

};

export default userService;