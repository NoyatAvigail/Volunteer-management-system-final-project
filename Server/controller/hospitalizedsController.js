import hospitalizedsService from "../services/hospitalizedsService.js";
import genericController from '../controller/genericController.js'

const hospitalizedsController = {
    getHospitalizeds: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const patientId = req.params.id;
            const requests = await hospitalizedsService.getHospitalizeds(authenticated.authenticatedId, patientId);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getHospitalizeds Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    createHospitalized: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const restBody = await req.body;
            const newHospitalized = await hospitalizedsService.createHospitalized(authenticated.authenticatedId, restBody);
            res.status(201).json(newHospitalized);
        } catch (error) {
            console.error("Error in createHospitalized Controller:", error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
}
export default hospitalizedsController;