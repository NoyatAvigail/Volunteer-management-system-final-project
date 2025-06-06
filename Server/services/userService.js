import userDal from "../dal/userDal.js";
import { hashPassword, isPasswordValid } from "../utils/utils.js";
import { log } from "../utils/logger.js";

const userService = {
    signup: async (userData) => {
        try {
            log('[POST]', { userData });
            const { email, password, type, phone, id, ...rest } = userData;
            const existingUser = await userDal.findByEmail(email);
            if (existingUser) {
                throw new Error("Email already taken");
            }
            let newUser = await userDal.createUser({ email, type, phone, id });
            const hashed = await hashPassword(password);
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
                newUser = {
                    ...newUser,
                    ...rest,
                    id: newVolunteer.id,
                };
            }
            if (type == "contact") {
                const contact = await userDal.createContact({
                    userId: newUser.id,
                    fullName: rest.fullName,
                    address: rest.address
                });
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
                });
                const relation = await userDal.createRelation({
                    contactPeopleId: contact.id,
                    patientId: patient.id,
                    relationType: rest.relationType
                });
                console.log("Contact and patient created:", contact.id, patient.id);
                newUser = {
                    ...newUser,
                    ...rest,
                    id: contact.id,
                };
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