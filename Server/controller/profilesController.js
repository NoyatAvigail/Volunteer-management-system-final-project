import profilesService from "../services/profilesService.js";
import genericController from '../controller/genericController.js'

const profilesController = {
    getProfile: async (req, res) => {
        const authenticated = await genericController.utils(req);
        try {
            const requests = await profilesService.getProfile(authenticated.authenticatedId, authenticated.authenticatedType);
            return res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getProfile Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    updateProfile: async (req, res) => {
        try {                        
            const authenticated = await genericController.utils(req);
            const requests = await profilesService.updateProfile(authenticated.authenticatedId, authenticated.authenticatedType, req.body);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in updateProfile Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
}

export default profilesController;