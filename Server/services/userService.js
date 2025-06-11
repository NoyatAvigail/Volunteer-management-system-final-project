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


// const userService = {
//     signup: async (userData) => {
//         try {
// log('[POST]', { userData });
// const { email, password, type, phone, id, ...rest } = userData;
// const existingUser = await userDal.findByEmail(email);
// if (existingUser) {
//     throw new Error("Email already taken");
// }
// let newUser = await userDal.createModel(Users, { email, type, phone, id });
// const hashed = await hashPassword(password);
// await userDal.savePassword(newUser.id, hashed);
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
//                 });
//                 for (const item of rest.helpTypes) {
//                     await userDal.createModel(VolunteerTypes, {
//                         id: Volunteer.id,
//                         volunteerTypeId: rest.helpTypes
//                     });
//                 }
//                 const volunteeringInDepartments = await userDal.createModel(VolunteeringInDepartments, {
//                     volunteerId: Volunteer.id,
//                     departmentId: rest.departmentId,
//                     hospitalId: rest.hospitalId
//                 });
//                 const volunteeringForSectors = await userDal.createModel(VolunteeringForSectors, {
//                     volunteerId: Volunteer.id,
//                     sectorId: rest.sectorId
//                 });
//                 const volunteeringForGenders = await userDal.createModel(VolunteeringForGenders, {
//                     volunteerId: Volunteer.id,
//                     genderId: rest.genderId
//                 });
//                 const relationToPatients = await userDal.createModel(RelationToPatients, {
//                     volunteerId: Volunteer.id,
//                     relationId: rest.relationId
//                 });
//                 console.log("Volunteer created:", Volunteer);
//                 newUser = {
//                     ...rest,
//                     id: Volunteer.id,
//                 };
//             }
//             if (type == "contact") {
//                 const contact = await userDal.createContact({
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     address: rest.address
//                 });
//                 const patient = await userDal.createPatient({
//                     userId: rest.patientId,
//                     contactPeopleId: contact.id,
//                     fullName: rest.patientFullName,
//                     dateOfBirth: rest.patientDateOfBirth,
//                     sector: rest.patientSector,
//                     gender: rest.patientGender,
//                     address: rest.patientAddress,
//                     dateOfDeath: rest.patientDateOfDeath || null,
//                     interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
//                 });
//                 const relation = await userDal.createRelation({
//                     contactPeopleId: contact.id,
//                     patientId: patient.id,
//                     relationId: rest.relationId,
//                 });
//                 console.log("Contact and patient created:", contact.id, patient.id);
//                 newUser = {
//                     ...rest,
//                     id: contact.id,
//                 };
//             }
//             return newUser;
//         } catch (e) {
//             console.error("Signup failed:", e);
//             if (e.errors) {
//                 e.errors.forEach(err => {
//                     console.error("Validation error:", err.message, "| Field:", err.path);
//                 });
//             }
//             throw e;
//         }
//     },

// login: async ({ email, password }) => {
//     log('[POST]', { email, password });
//     const user = await userDal.findByEmail(email);
//     if (!user) return null;
//     const passwordEntry = await userDal.getPasswordByUserId(user.id);
//     if (!passwordEntry) return null;
//     const valid = await isPasswordValid(password, passwordEntry.password);
//     if (!valid) return null;
//     const userData = user.toJSON();
//     if (user.type == "volunteer") {
//         const volunteer = await userDal.findVolunteerByUserId(user.id);
//         if (!volunteer) return null;
//         userData.fullName = volunteer.fullName;
//         userData.autoId = volunteer.id;
//     } else if (user.type == "contact") {
//         const contact = await userDal.findContactByUserId(user.id);
//         if (!contact) return null;
//         userData.fullName = contact.fullName;
//         userData.autoId = contact.id;
//     }
//     return { user: userData };
// }
// };

// export default userService;
////////////merav
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
//             await userDal.savePassword(newUser.id, hashed, { transaction });

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

//                 for (const typeId of rest.helpTypes) {
//                     await userDal.createModel(VolunteerTypes, {
//                         id: Volunteer.id,
//                         volunteerTypeId: typeId
//                     }, { transaction });
//                 }

//                 for (const hospitalId of rest.preferredHospitals) {
//                     for (const departmentId of rest.preferredDepartments) {
//                         await userDal.createModel(VolunteeringInDepartments, {
//                             id: Volunteer.id,
//                             department: departmentId,
//                             hospital: hospitalId
//                         }, { transaction });
//                     }
//                 }

//                 for (const sectorId of rest.guardSectors) {
//                     await userDal.createModel(VolunteeringForSectors, {
//                         IIId: Volunteer.id,
//                         sectorId: sectorId
//                     }, { transaction });
//                 }

//                 for (const genderId of rest.guardGenders) {
//                     await userDal.createModel(VolunteeringForGenders, {
//                         id: Volunteer.id,
//                         genderId: genderId
//                     }, { transaction });
//                 }

//                 newUser = {
//                     ...rest,
//                     id: Volunteer.id,
//                 };
//             }
//             if (type === "contact") {
//                 const contact = await userDal.createContact({
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     address: rest.address
//                 }, { transaction });

//                 const patient = await userDal.createPatient({
//                     userId: rest.patientId,
//                     contactPeopleId: contact.id,
//                     fullName: rest.patientFullName,
//                     dateOfBirth: rest.patientDateOfBirth,
//                     sector: rest.patientSector,
//                     gender: rest.patientGender,
//                     address: rest.patientAddress,
//                     dateOfDeath: rest.patientDateOfDeath || null,
//                     interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
//                 }, { transaction });

//                 await userDal.createRelation({
//                     contactPeopleId: contact.id,
//                     patientId: patient.id,
//                     relationId: rest.relationId,
//                 }, { transaction });

//                 newUser = {
//                     ...rest,
//                     id: contact.id,
//                 };
//             }
//             await transaction.commit();
//             return newUser;
//         } catch (e) {
//             await transaction.rollback();
//             console.error("Signup failed:", e);
//             if (e.errors) {
//                 e.errors.forEach(err => {
//                     console.error("Validation error:", err.message, "| Field:", err.path);
//                 });
//             }
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
            //   await userDal.savePassword(newUser.id, hashed, { transaction });

            if (type === cUserType.VOLUNTEER) {
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

                // VolunteerTypes
                const helpTypes = rest.helpTypes.map(typeId => ({
                    id: Volunteer.id,
                    volunteerTypeId: typeId
                }));
                if (helpTypes.length)
                    await userDal.bulkCreateModel(VolunteerTypes, helpTypes, { transaction });

                // VolunteeringInDepartments
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

                // VolunteeringForSectors
                const sectors = rest.guardSectors.map(sectorId => ({
                    id: Volunteer.id,
                    sectorId
                }));
                if (sectors.length)
                    await userDal.bulkCreateModel(VolunteeringForSectors, sectors, { transaction });

                // VolunteeringForGenders
                const genders = rest.guardGenders.map(genderId => ({
                    id: Volunteer.id,
                    genderId
                }));
                if (genders.length)
                    await userDal.bulkCreateModel(VolunteeringForGenders, genders, { transaction });

                newUser = {
                    ...rest,
                    id: Volunteer.id,
                };
            }

            if (type === "contact") {
                const contact = await userDal.createContact({
                    userId: newUser.id,
                    fullName: rest.fullName,
                    address: rest.address
                }, { transaction });

                const patient = await userDal.createPatient({
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

                await userDal.createRelation({
                    contactPeopleId: contact.id,
                    patientId: patient.id,
                    relationId: rest.relationId,
                }, { transaction });

                newUser = {
                    ...rest,
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
    }
};

export default userService;