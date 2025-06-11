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
            let newUser = await userDal.createModel(Users, { email, type, phone, id });
            let userType = await userDal.createModel(UserTypes, { userId: newUser.id, type });
            const hashed = await hashPassword(password);
            await userDal.savePassword(newUser.id, hashed);
            if (type == "Volunteer") {
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
                });
                const VolunteerTypes = await userDal.createModel(VolunteerTypes, {
                    volunteerId: Volunteer.id,
                    volunteerTypeId: rest.volunteerTypeId
                });
                const VolunteeringInDepartments = await userDal.createModel(VolunteeringInDepartments, {
                    volunteerId: Volunteer.id,
                    departmentId: rest.departmentId,
                    hospitalId: rest.hospitalId
                });
                const VolunteeringForSectors = await userDal.createModel(VolunteeringForSectors, {
                    volunteerId: Volunteer.id,
                    sectorId: rest.sectorId
                });
                const VolunteeringForGenders = await userDal.createModel(VolunteeringForGenders, {
                    volunteerId: Volunteer.id,
                    genderId: rest.genderId
                });
                const FamilyRelation = await userDal.createModel(FamilyRelation, {
                    volunteerId: Volunteer.id,
                    relationId: rest.relationId
                });
                console.log("Volunteer created:", Volunteer);
                newUser = {
                    ...rest,
                    id: Volunteer.id,
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
                    relationId: rest.relationId,
                });
                console.log("Contact and patient created:", contact.id, patient.id);
                newUser = {
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