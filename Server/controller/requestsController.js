import requestsService from "../services/requestsService.js";

const requestsController = {
    utils: async (req) => {
        const authenticatedId = req.user.id.toString();
        const authenticatedType = req.user.type.toString();
        return { authenticatedId, authenticatedType }
    },

    getRequests: async (req, res) => {
        try {
            const { startDate, endDate } = req.query;
            const authenticated = await requestsController.utils(req);
            console.log("startDate:", startDate, "endDate:", endDate);

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

    createRequests: async (req, res) => {
        try {
            const authenticated = await requestsController.utils(req);
            const body = req.body;
            const newEvent = await requestsService.createRequests(body, authenticated.authenticatedId, authenticated.authenticatedType);
            res.status(200).json(newEvent);
        } catch (error) {
            console.error("Error in createRequests Controller:", error);
            if (error.status === 403) {
                return res.status(403).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    deleteRequests: async (req, res) => {
        const { id } = req.params;
        const authenticated = utils(req);
        if (!id) {
            return res.status(400).json({ message: "Missing event ID" });
        }

        try {
            const deletedEvent = await requestsService.deleteEvent(authenticated.authenticatedId, authenticated.authenticatedType, id);
            res.status(200).json(deletedEvent);
        } catch (error) {
            console.error("Error in deleteRequests Controller:", error);
            res.status(error.status || 500).json({
                message: error.message || "Server error"
            });
        }
    },

    updatRequests: async (req, res) => {
        console.log("הגיע לכונטרולר");
        
        const authenticated = await requestsController.utils(req);
        const { id } = req.params;
        const body = req.body;

        try {
            const updatedEvent = await requestsService.updatRequests(body, authenticated.authenticatedId, authenticated.authenticatedType, id);
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