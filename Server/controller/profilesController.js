import profilesService from "../services/profilesService.js";

const profilesController = {
    utils: async (req) => {
        const authenticatedId = req.user.id?.toString();
        const authenticatedType = req.user.type?.toString();
        return { authenticatedId, authenticatedType };
    },

    getProfile: async (req, res) => {

        const authenticated = await profilesController.utils(req);
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
        console.log("הגיע לאפדייט בכונטרול");
        try {
            const authenticated = await profilesController.utils(req);
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

    getPatients: async (req, res) => {
        try {
            const authenticated = await profilesController.utils(req);
            console.log("הגיע לכונטרולר");
            console.log("authenticated:", authenticated);
            const requests = await profilesService.getPatients(authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getPatients Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    updatePatientProfile: async (req, res) => {
        try {
            const patientId = req.params.id;
            const authenticated = await profilesController.utils(req);
            const requests = await profilesService.updatePatientProfile(patientId, authenticated.authenticatedId, authenticated.authenticatedType, req.body);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in updatePatientProfile Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    deletePatient: async (req, res) => {
        const patientId = req.params.id;
        const authenticated = utils(req);
        try {
            const requests = await profilesService.deletePatient(patientId, authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in deletePatient Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
}

export default profilesController;