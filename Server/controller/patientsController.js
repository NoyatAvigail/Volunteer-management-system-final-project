import patientsService from "../services/patientsService.js";
import genericController from '../controller/genericController.js'

const patientsController = {
    createPatient: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const requests = await patientsService.createPatient(authenticated.authenticatedId, req.body);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in createPatient Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    getPatientById: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const patientId = req.params.patientId;
            const requests = await patientsService.getPatientById(authenticated.authenticatedId, patientId);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getPatientById Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    
    getPatients: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const requests = await patientsService.getPatients(authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getPatients Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    updatePatient: async (req, res) => {
        try {
            const patientId = req.params.id;
            const authenticated = await genericController.utils(req);
            const requests = await patientsService.updatePatient(patientId, authenticated.authenticatedId, authenticated.authenticatedType, req.body);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in updatePatient Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    deletePatient: async (req, res) => {
        const patientId = req.params.id;
        const authenticated = await genericController.utils(req);
        try {
            const requests = await patientsService.deletePatient(patientId, authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in deletePatient Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

export default patientsController;