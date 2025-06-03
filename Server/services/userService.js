// import userDal from "../dal/userDal.js";
// import { hashPassword, isPasswordValid } from "../utils/utils.js";
// import { log } from "../utils/logger.js";
// import Volunteers from "../Models/Volunteers.js";
// import ContactPeople from "../Models/ContactPeople.js"
// import Patients from "../Models/Patients.js"
// import RelationToPatients from '../Models/RelationToPatients.js'

// const userService = {
//     signup: async (userData) => {
//         try {
//             log('[POST]', { userData });
//             console.log("Received userData:", userData);
//             const { email, password, type, phone, id, ...rest } = userData;
//             const existingUser = await userDal.findByEmail(email);
//             if (existingUser) {
//                 throw new Error("Email already taken");
//             }
//             const newUser = await userDal.createUser({ email, type, phone, id });
//             console.log("Password from request:", password);
//             const hashed = await hashPassword(password);
//             console.log("Hashed password:", hashed);
//             await userDal.savePassword(newUser.id, hashed);
//             if (type == "volunteer") {
//                 const volunteer = await Volunteers.create({
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     dateOfBirth: rest.dateOfBirth,
//                     gender: rest.gender,
//                     sector: rest.sector,
//                     address: rest.address,
//                     photo: rest.photo,
//                     volunteerStartDate: rest.volunteerStartDate,
//                     volunteerEndDate: rest.volunteerEndDate,
//                     isActive: rest.isActive,
//                     flexible: rest.flexible
//                 });
//                 console.log("Volunteer created:", volunteer);
//             }
//             if (type == "contact") {
//                 const contact = await ContactPeople.create({
//                     userId: newUser.id,
//                     fullName: rest.fullName,
//                     address: rest.address
//                 });
//                 const patient = await Patients.create({
//                     contactPeopleId: contact.id,
//                     fullName: rest.patientFullName,
//                     dateOfBirth: rest.patientDateOfBirth,
//                     sector: rest.patientSector,
//                     gender: rest.patientGender,
//                     address: rest.patientAddress,
//                     dateOfDeath: rest.patientDateOfDeath || null,
//                     interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
//                 });
//                 await RelationToPatients.create({
//                     contactPeopleId: contact.id,
//                     patientId: patient.id,
//                     relationType: rest.relationType
//                 });
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

//     login: async ({ email, password }) => {
//         log('[POST]', { email, password });
//         const user = await userDal.findByEmail(email);
//         if (!user) return null;
//         const passwordEntry = await userDal.getPasswordByUserId(user.id);
//         if (!passwordEntry) return null;
//         const valid = await isPasswordValid(password, passwordEntry.password);
//         return valid ? user : null;
//     }
// };

// export default userService;
import userDal from "../dal/userDal.js";
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";

const userService = {
    signup: async (userData) => {
        try {
            log('[POST]', { userData });
            console.log("Received userData:", userData);
            const { email, password, type, phone, id, ...rest } = userData;
            const existingUser = await userDal.findByEmail(email);
            if (existingUser) {
                throw new Error("Email already taken");
            }
            const newUser = await userDal.createUser({ email, type, phone, id });
            console.log("Password from request:", password);
            const hashed = await hashPassword(password);
            console.log("Hashed password:", hashed);
            await userDal.savePassword(newUser.id, hashed);
            if (type == "volunteer") {
                const newVolunteer = await userDal.createVolunteer({
                    userId: newUser.id,
                    fullName: rest.fullName,
                    dateOfBirth: rest.dateOfBirth,
                    gender: rest.gender,
                    sector: rest.sector,
                    address: rest.address,
                    photo: rest.photo,
                    volunteerStartDate: rest.volunteerStartDate,
                    volunteerEndDate: rest.volunteerEndDate,
                    isActive: rest.isActive,
                    flexible: rest.flexible
                });
                console.log("Volunteer created:", newVolunteer);
            }
            if (type == "contact") {
                const contact = await userDal.createContact({
                    userId: newUser.id,
                    fullName: rest.fullName,
                    address: rest.address
                });
                const patient = await userDal.createPatient({
                    contactPeopleId: contact.id,
                    fullName: rest.patientFullName,
                    dateOfBirth: rest.patientDateOfBirth,
                    sector: rest.patientSector,
                    gender: rest.patientGender,
                    address: rest.patientAddress,
                    dateOfDeath: rest.patientDateOfDeath || null,
                    interestedInReceivingNotifications: rest.patientInterestedInReceivingNotifications ?? true
                });
                const relation = await userDal.createRelation({
                    contactPeopleId: contact.id,
                    patientId: patient.id,
                    relationType: rest.relationType
                });
            }
            return newUser;
        } catch (e) {
            console.error("Signup failed:", e);
            if (e.errors) {
                e.errors.forEach(err => {
                    console.error("Validation error:", err.message, "| Field:", err.path);
                });
            }
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
        return valid ? user : null;
    }
};

export default userService;