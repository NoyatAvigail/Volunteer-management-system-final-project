import requestsService from "../services/requestsService.js";
import genericController from '../controller/genericController.js'

const requestsController = {
    getRequests: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const authenticated = await genericController.utils(req);
            const requests = await requestsService.getRequests(authenticated.authenticatedId, authenticated.authenticatedType, startDate, endDate);
            res.status(200).json(requests);
        } catch (error) {
            console.error("Error in getContactRequests Controller:", error);
            if (error.status == 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    createRequest: async (req, res) => {
        try {
            const authenticated = await genericController.utils(req);
            const body = req.body;
            const newEvent = await requestsService.createRequest(body, authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(newEvent);
        } catch (error) {
            console.error("Error in createRequests Controller:", error);
            if (error.status === 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    deleteRequest: async (req, res) => {
        const { id } = req.params;
        const authenticated = await genericController.utils(req);
        if (!id) {
            return res.status(400).json({ message: "Missing event ID" });
        }
        try {
            const deletedEvent = await requestsService.deleteRequest(authenticated.authenticatedId, authenticated.authenticatedType, id);
            res.status(200).json(deletedEvent);
        } catch (error) {
            console.error("Error in deleteRequests Controller:", error);
            res.status(error.status || 500).json({
                message: error.message || "Server error"
            });
        }
    },

    updatRequest: async (req, res) => {
        const authenticated = await genericController.utils(req);
        const { id } = req.params;
        const body = req.body;
        try {
            const updatedEvent = await requestsService.updatRequest(body, authenticated.authenticatedId, authenticated.authenticatedEmail, authenticated.authenticatedType, id);
            res.status(200).json(updatedEvent);
        } catch (error) {
            console.error("Error in updatRequests Controller:", error);
            if (error.status === 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

export default requestsController;