import genericDAL from "../dal/genericDal.js";
import userDal from "../dal/userDal.js"
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";
import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import VolunteerTypes from '../Models/VolunteerTypes.js';
// import ContactPeople from "../Models/ContactPeople.js"
// import Patients from "../Models/Patients.js"
// import RelationToPatients from '../Models/RelationToPatients.js'
// import Hospitalizeds from '../Models/Hospitalizeds.js';
import { ContactPeople, Patients, RelationToPatients, Hospitalizeds, } from '../Models/Index.js'
import VolunteeringInDepartments from '../Models/VolunteeringInDepartments.js';
import VolunteeringForSectors from '../Models/VolunteeringForSectors.js';
import VolunteeringForGenders from '../Models/VolunteeringForGenders.js';
import { cUserType } from '../common/consts.js'
import sequelize from '../../DB/connectionDB.mjs';

const userService = {
    signup: async (userData) => {
        const transaction = await sequelize.transaction();
        try {
            const { email, password, type, phone, id, ...rest } = userData;
            const existingUser = await userDal.findByEmail(email);
            if (existingUser) throw new Error("Email already taken");

            let newUser = await userDal.createModel(Users, { email, type, phone, id }, { transaction });
            const hashed = await hashPassword(password);
            const pwd = await userDal.createModel(Passwords, {
                id: newUser.id,
                password: hashed
            }, { transaction });

            if (type == cUserType.VOLUNTEER) {
                const Volunteer = await userDal.createModel(Volunteers, {
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
                    await userDal.bulkCreateModel(VolunteerTypes, helpTypes, { transaction });

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
                    await userDal.bulkCreateModel(VolunteeringInDepartments, departments, { transaction });

                const sectors = rest.guardSectors.map(sectorId => ({
                    id: Volunteer.id,
                    sectorId
                }));
                if (sectors.length)
                    await userDal.bulkCreateModel(VolunteeringForSectors, sectors, { transaction });

                const genders = rest.guardGenders.map(genderId => ({
                    id: Volunteer.id,
                    genderId
                }));
                if (genders.length)
                    await userDal.bulkCreateModel(VolunteeringForGenders, genders, { transaction });

                newUser = {
                    ...rest,
                    type: type,
                    id: Volunteer.id,
                    autoId: userData.id
                };
            }

            if (type == cUserType.CONTACTPERSON) {
                const contact = await userDal.createModel(ContactPeople,
                    {
                        userId: newUser.id,
                        fullName: rest.fullName,
                        address: rest.address
                    }, { transaction });
                //TODO check if patient exists, if not then create
                const patient = await userDal.createModel(Patients,
                    {
                        userId: rest.patientId,
                        contactPeopleId: contact.id,
                        fullName: rest.patientFullName,
                        dateOfBirth: rest.patientDateOfBirth,
                        sector: rest.patientSector,
                        gender: rest.patientGender,
                        address: rest.patientAddress,
                        dateOfDeath: rest.patientDateOfDeath || null,
                        interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
                    }, { transaction });

                const relationToPatients = await userDal.createModel(RelationToPatients,
                    {
                        contactPeopleId: contact.id,
                        patientId: patient.id,
                        relationId: rest.relationId,
                    }, { transaction });
                //TODO check if hospitalized exists, if exists then popup check to user, else create 
                const hospitalizeds = await userDal.createModel(Hospitalizeds,
                    {
                        patientId: patient.id,
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
        const user = await userDal.findByEmail(email);
        if (!user) return null;
        const passwordEntry = await userDal.getPasswordByUserId(user.id);
        if (!passwordEntry) return null;
        const valid = await isPasswordValid(password, passwordEntry.password);
        if (!valid) return null;
        const userData = user.toJSON();
        if (user.type == cUserType.VOLUNTEER) {
            const volunteer = await userDal.findVolunteerByUserId(user.id);
            if (!volunteer) return null;
            userData.fullName = volunteer.fullName;
            userData.autoId = volunteer.id;
        } else if (user.type == cUserType.CONTACTPERSON) {
            const contact = await userDal.findContactByUserId(user.id);
            if (!contact) return null;
            userData.fullName = contact.fullName;
            userData.autoId = contact.id;
        }
        return {
            user: userData,
            autoId: userData.id
        };
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

    // updateVolunteerProfile: async (userId, data) => {
    //     const volunteer = await genericDAL.findOneWithIncludes("Volunteers", { userId }, []);
    //     if (!volunteer) throw new Error("Volunteer not found");

    //     await genericDAL.updateFields("Volunteers", volunteer.id, data);

    //     await genericDAL.deleteWhere("VolunteerTypes", { id: volunteer.id });
    //     for (const vt of data.VolunteerTypes || []) {
    //         await genericDAL.create("VolunteerTypes", { id: volunteer.id, volunteerTypeId: vt.volunteerTypeId });
    //     }

    //     await genericDAL.deleteWhere("VolunteeringInDepartments", { id: volunteer.id });
    //     for (const dep of data.VolunteersDepartments || []) {
    //         await genericDAL.create("VolunteeringInDepartments", {
    //             id: volunteer.id,
    //             hospital: dep.hospital,
    //             department: dep.department
    //         });
    //     }

    //     await genericDAL.deleteWhere("VolunteeringForSectors", { id: volunteer.id });
    //     for (const sec of data.VolunteeringForSectors || []) {
    //         await genericDAL.create("VolunteeringForSectors", { id: volunteer.id, sectorId: sec.sectorId });
    //     }

    //     await genericDAL.deleteWhere("VolunteeringForGenders", { id: volunteer.id });
    //     for (const gen of data.VolunteeringForGenders || []) {
    //         await genericDAL.create("VolunteeringForGenders", { id: volunteer.id, genderId: gen.genderId });
    //     }

    //     return await genericDAL.findOneWithIncludes("Volunteers", { userId }, [
    //         { model: genericDAL.getModelByName("Users") },
    //         { model: genericDAL.getModelByName("VolunteerTypes") },
    //         { model: genericDAL.getModelByName("VolunteeringInDepartments") },
    //         { model: genericDAL.getModelByName("VolunteeringForSectors") },
    //         { model: genericDAL.getModelByName("VolunteeringForGenders") }
    //     ]);
    // },
    updateVolunteerProfile: async (userId, data) => {
        try {
            const Volunteers = genericDAL.getModelByName("Volunteers");
            const volunteerArr = await genericDAL.findByField(Volunteers, { userId });
            if (!volunteerArr || volunteerArr.length === 0) throw new Error("Volunteer not found");

            const volunteer = volunteerArr[0];
            console.log("🔍 volunteer id:", volunteer.id);

            // עדכון שדות בסיסיים של הטבלה Volunteers
            await genericDAL.updateFields(Volunteers, volunteer.id, data);

            // טבלאות עזר
            const VolunteerTypes = genericDAL.getModelByName("VolunteerTypes");
            const VolunteeringInDepartments = genericDAL.getModelByName("VolunteeringInDepartments");
            const VolunteeringForSectors = genericDAL.getModelByName("VolunteeringForSectors");
            const VolunteeringForGenders = genericDAL.getModelByName("VolunteeringForGenders");

            // מחיקה ויצירה מחדש לפי id (שהוא volunteerId בטבלאות האלה)
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

            // שליפת כל המידע מחדש באותו סגנון פשוט
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
            console.error("❗ שגיאה ב-updateVolunteerProfile:", error);
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