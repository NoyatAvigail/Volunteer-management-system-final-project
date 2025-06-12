// import userDal from "../dal/userDal.js";
// import { hashPassword, isPasswordValid } from "../utils/utils.js";
// import { log } from "../utils/logger.js";
// import Users from '../Models/Users.js';
// import Passwords from '../Models/Passwords.js';
// import Volunteers from "../Models/Volunteers.js";
// import VolunteerTypes from '../models/VolunteerTypes.js';
// import ContactPeople from "../Models/ContactPeople.js"
// import Patients from "../Models/Patients.js"
// import RelationToPatients from '../Models/RelationToPatients.js'
// import Hospitalizeds from '../Models/Hospitalizeds.js';
// import VolunteeringInDepartments from '../Models/VolunteeringInDepartments.js';
// import VolunteeringForSectors from '../Models/VolunteeringForSectors.js';
// import VolunteeringForGenders from '../models/VolunteeringForGenders.js';
// import { cUserType } from '../common/consts.js'
// import sequelize from '../../DB/connectionDB.mjs';

// const userService = {
//     signup: async (userData) => {
//         const transaction = await sequelize.transaction();
//         try {
//             const { email, password, type, phone, id, ...rest } = userData;
//             const existingUser = await userDal.findByEmail(email);
//             if (existingUser) throw new Error("Email already taken");

//             let newUser = await userDal.createModel(Users, { email, type, phone, id }, { transaction });
//             const hashed = await hashPassword(password);
//             const pwd = await userDal.createModel(Passwords, {
//                 id: newUser.id,
//                 password: hashed
//             }, { transaction });

//             if (type == cUserType.VOLUNTEER) {
//                 const Volunteer = await userDal.createModel(Volunteers, {
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     dateOfBirth: rest.dateOfBirth,
//                     gender: rest.gender,
//                     sector: rest.sector,
//                     address: rest.address,
//                     volunteerStartDate: rest.volunteerStartDate,
//                     volunteerEndDate: rest.volunteerEndDate,
//                     isActive: rest.isActive,
//                     flexible: rest.flexible
//                 }, { transaction });

//                 const helpTypes = rest.helpTypes.map(typeId => ({
//                     id: Volunteer.id,
//                     volunteerTypeId: typeId
//                 }));
//                 if (helpTypes.length)
//                     await userDal.bulkCreateModel(VolunteerTypes, helpTypes, { transaction });

//                 const departments = [];
//                 for (const hospitalId of rest.preferredHospitals) {
//                     for (const departmentId of rest.preferredDepartments) {
//                         departments.push({
//                             id: Volunteer.id,
//                             department: departmentId,
//                             hospital: hospitalId
//                         });
//                     }
//                 }
//                 if (departments.length)
//                     await userDal.bulkCreateModel(VolunteeringInDepartments, departments, { transaction });

//                 const sectors = rest.guardSectors.map(sectorId => ({
//                     id: Volunteer.id,
//                     sectorId
//                 }));
//                 if (sectors.length)
//                     await userDal.bulkCreateModel(VolunteeringForSectors, sectors, { transaction });

//                 const genders = rest.guardGenders.map(genderId => ({
//                     id: Volunteer.id,
//                     genderId
//                 }));
//                 if (genders.length)
//                     await userDal.bulkCreateModel(VolunteeringForGenders, genders, { transaction });

//                 newUser = {
//                     ...rest,
//                     type: type,
//                     id: Volunteer.id,
//                 };
//             }

//             if (type == cUserType.CONTACTPERSON) {
//                 const contact = await userDal.createModel(ContactPeople,
//                     {
//                         userId: newUser.id,
//                         fullName: rest.fullName,
//                         address: rest.address
//                     }, { transaction });

//                 const patient = await userDal.createModel(Patients,
//                     {
//                         userId: rest.patientId,
//                         contactPeopleId: contact.id,
//                         fullName: rest.patientFullName,
//                         dateOfBirth: rest.patientDateOfBirth,
//                         sector: rest.patientSector,
//                         gender: rest.patientGender,
//                         address: rest.patientAddress,
//                         dateOfDeath: rest.patientDateOfDeath || null,
//                         interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
//                     }, { transaction });

//                 const relationToPatients = await userDal.createModel(RelationToPatients,
//                     {
//                         contactPeopleId: contact.id,
//                         patientId: patient.id,
//                         relationId: rest.relationId,
//                     }, { transaction });

//                 newUser = {
//                     ...rest,
//                     type: type,
//                     id: contact.id,
//                 };
//             }

//             await transaction.commit();
//             return newUser;

//         } catch (e) {
//             await transaction.rollback();
//             console.error("Signup failed:", e);
//             throw e;
//         }
//     },

//     login: async ({ email, password }) => {
//         log('[POST]', { email, password });
//         const user = await userDal.findByEmail(email);
//         if (!user) return null;
//         const passwordEntry = await userDal.getPasswordByUserId(user.id);
//         if (!passwordEntry) return null;
//         const valid = await isPasswordValid(password, passwordEntry.password);
//         if (!valid) return null;
//         const userData = user.toJSON();
//         if (user.type == "volunteer") {
//             const volunteer = await userDal.findVolunteerByUserId(user.id);
//             if (!volunteer) return null;
//             userData.fullName = volunteer.fullName;
//             userData.autoId = volunteer.id;
//         } else if (user.type == "contact") {
//             const contact = await userDal.findContactByUserId(user.id);
//             if (!contact) return null;
//             userData.fullName = contact.fullName;
//             userData.autoId = contact.id;
//         }
//         return { user: userData };
//     }
// };

// export default userService;
import userDal from "../dal/userDal.js";
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";
import Users from '../Models/Users.js';
import Passwords from '../Models/Passwords.js';
import Volunteers from "../Models/Volunteers.js";
import VolunteerTypes from '../models/VolunteerTypes.js';
import ContactPeople from "../Models/ContactPeople.js"
import Patients from "../Models/Patients.js"
import RelationToPatients from '../Models/RelationToPatients.js'
import Hospitalizeds from '../Models/Hospitalizeds.js';
import VolunteeringInDepartments from '../Models/VolunteeringInDepartments.js';
import VolunteeringForSectors from '../Models/VolunteeringForSectors.js';
import VolunteeringForGenders from '../models/VolunteeringForGenders.js';
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
                };
            }

            if (type == cUserType.CONTACTPERSON) {
                const contact = await userDal.createModel(ContactPeople,
                    {
                        userId: newUser.id,
                        fullName: rest.fullName,
                        address: rest.address
                    }, { transaction });

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

                newUser = {
                    ...rest,
                    type: type,
                    id: contact.id,
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
        if (user.type == "volunteer") {
            const volunteer = await userDal.findVolunteerByUserId(user.id);
            if (!volunteer) return null;
            userData.fullName = volunteer.fullName;
            userData.autoId = volunteer.id;
        } else if (user.type == "contact") {
            const contact = await userDal.findContactByUserId(user.id);
            if (!contact) return null;
            userData.fullName = contact.fullName;
            userData.autoId = contact.id;
        }
        return { user: userData };
    }
};

export default userService;