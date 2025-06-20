import genericDAL from "../dal/genericDal.js";
import profilesDal from "../dal/profilesDal.js";

const profilesService = {
    utils: async (authenticatedType) => {
        const type = genericDAL.getModelByName('UserTypes');
        const userType = await genericDAL.findById(type, authenticatedType);
        const userTypeDesc = userType?.description;
        const model = userTypeDesc === 'Volunteers'
            ? genericDAL.getModelByName('Volunteers')
            : genericDAL.getModelByName('ContactPeople');
        return { userTypeDesc, model };
    },

    getProfile: async (authenticatedId, authenticatedType) => {
        console.log("Arrived at the services");

        try {
            const { userTypeDesc, model } = await profilesService.utils(authenticatedType);
            console.log("In getProfile service:");
            console.log("authenticatedId:", authenticatedId);
            console.log("authenticatedType:", authenticatedType);
            const userArr = await genericDAL.findByField(model, { id: authenticatedId });
            if (!userArr || userArr.length === 0) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            const user = userArr[0];
            const userIdFromToken = user.userId;
            return userTypeDesc === 'Volunteer'
                ? await profilesDal.getVolunteerProfile(userIdFromToken)
                : await profilesDal.getContactProfile(userIdFromToken);
        } catch (error) {
            console.error("Error in getProfile:", error);
            throw error;
        }
    },

    updateProfile: async (authenticatedId, authenticatedType, body) => {
        try {            
            const { userTypeDesc, model } = await profilesService.utils(authenticatedType);
            console.log("userTypeDesc:",userTypeDesc);
            console.log("model:", model);
            console.log("authenticatedId:", authenticatedId);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            const userIdFromToken = user.userId;
            return userTypeDesc === 'Volunteers'
                ? await profilesDal.updateVolunteerProfile(userIdFromToken, body)
                : await profilesDal.updateContactProfile(userIdFromToken, body);
        } catch (error) {
            console.error("Error in updateProfile:", error);
            throw error;
        }
    },

    getPatients: async (authenticatedId, authenticatedType) => {
        console.log("הגיע לסרביס");
        console.log("authenticatedId:", authenticatedId);

        try {
            const { userTypeDesc, model } = await profilesService.utils(authenticatedType);
            console.log("In getProfile service:");
            console.log("authenticatedId:", authenticatedId);
            console.log("authenticatedType:", authenticatedType);
            const contactArr = await genericDAL.findByField(model, { id: authenticatedId });
            const contact = contactArr?.[0];
            if (!contact) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            console.log("model:", model);

            if (userTypeDesc == 'ContactPerson') {
                return await profilesDal.getPatients(contact.userId);
            }
        } catch (error) {
            console.error("Error in getPatients:", error);
            throw error;
        }
    },

    updatePatientProfile: async (patientId, authenticatedId, authenticatedType, body) => {
        try {
            console.log("הגיע לסרביס");
            
            const { userTypeDesc, model } = await profilesService.utils(authenticatedType);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            if (userTypeDesc == 'ContactPerson') {
                return await profilesDal.updatePatientProfile(patientId,body);
            }
        } catch (error) {
            console.error("Error in updatePatientProfile:", error);
            throw error;
        }
    },

    deletePatient: async (patientId, authenticatedId, authenticatedType) => {
        try {
            const { userTypeDesc, model } = await profilesService.utils(authenticatedType);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            if (userTypeDesc === 'ContactPeople') {
                return await profilesDal.deletePatient(patientId);
            }
        } catch (error) {
            console.error("Error in deletePatient:", error);
            throw error;
        }
    }
};

export default profilesService;