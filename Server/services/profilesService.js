import genericDAL from "../dal/genericDal.js";
import profilesDal from "../dal/profilesDal.js";
import genericService from '../services/genericService.js'

const profilesService = {
    getProfile: async (authenticatedId, authenticatedType) => {
        try {
            const { userTypeDesc, model } = await genericService.utils(authenticatedType);
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
            const { userTypeDesc, model } = await genericService.utils(authenticatedType);
            const user = await genericDAL.findById(model, authenticatedId);
            if (!user) {
                const error = new Error(`User not found`);
                error.status = 404;
                throw error;
            }
            const userIdFromToken = user.userId;
            return userTypeDesc === 'Volunteer'
                ? await profilesDal.updateVolunteerProfile(userIdFromToken, body)
                : await profilesDal.updateContactProfile(userIdFromToken, body);
        } catch (error) {
            console.error("Error in updateProfile:", error);
            throw error;
        }
    },
};

export default profilesService;